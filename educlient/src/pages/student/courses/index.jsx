import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    checkCoursePurchaseInfoService,
    fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Helper function to create search parameters for the query string
function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    // Loop through filterParams and add them to query string
    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(",");
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join("&");
}

function StudentViewCoursesPage() {
    // States to manage sorting, filters, and loading
    const [sort, setSort] = useState("price-lowtohigh");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    // Handle filter change for checkboxes
    function handleFilterOnChange(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSeection =
            Object.keys(cpyFilters).indexOf(getSectionId);

        // Check if the current filter exists, if not, create it
        if (indexOfCurrentSeection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption.id],
            };
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
                getCurrentOption.id
            );

            // If the option is not already selected, add it
            if (indexOfCurrentOption === -1)
                cpyFilters[getSectionId].push(getCurrentOption.id);
            else
                // Otherwise, remove it
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }

        setFilters(cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters)); // Save filters to sessionStorage
    }

    // Fetch the list of courses based on filters and sorting
    async function fetchAllStudentViewCourses(filters, sort) {
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort,
        });
        const response = await fetchStudentViewCourseListService(query);
        if (response?.success) {
            setStudentViewCoursesList(response?.data);
            setLoadingState(false); // Set loading state to false once courses are fetched
        }
    }

    // Navigate to the course page, either course details or course progress based on purchase status
    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId,
            auth?.user?._id
        );

        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }

    useEffect(() => {
        const buildQueryStringForFilters = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(buildQueryStringForFilters)); // Update URL params when filters change
    }, [filters]);

    useEffect(() => {
        setSort("price-lowtohigh"); // Set default sorting
        setFilters(JSON.parse(sessionStorage.getItem("filters")) || {}); // Load filters from sessionStorage
    }, []);

    // Fetch courses when filters or sort order change
    useEffect(() => {
        if (filters !== null && sort !== null)
            fetchAllStudentViewCourses(filters, sort);
    }, [filters, sort]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("filters"); // Cleanup filters when component unmounts
        };
    }, []);

    // Render loading state and course content
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64 space-y-4">
                    <div>
                        {/* Render filter options */}
                        {Object.keys(filterOptions).map((keyItem) => (
                            <div className="p-4 border-b" key={keyItem}>
                                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                                <div className="grid gap-2 mt-2">
                                    {filterOptions[keyItem].map((option) => (
                                        <Label className="flex font-medium items-center gap-3" key={option.id}>
                                            <Checkbox
                                                checked={filters && filters[keyItem] && filters[keyItem].indexOf(option.id) > -1}
                                                onCheckedChange={() =>
                                                    handleFilterOnChange(keyItem, option)
                                                }
                                            />
                                            {option.label}
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="flex-1">
                    {/* Sorting and results display */}
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 p-5"
                                >
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span className="text-[16px] font-medium">Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuRadioGroup
                                    value={sort}
                                    onValueChange={(value) => setSort(value)}
                                >
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem
                                            value={sortItem.id}
                                            key={sortItem.id}
                                        >
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black font-bold">
                            {studentViewCoursesList.length} Results
                        </span>
                    </div>
                    <div className="space-y-4">
                        {/* Displaying courses or loading/skeleton state */}
                        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                            studentViewCoursesList.map((courseItem) => (
                                <Card
                                    onClick={() => handleCourseNavigate(courseItem?._id)}
                                    className="cursor-pointer"
                                    key={courseItem?._id}
                                >
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <img
                                                src={courseItem?.image}
                                                className="w-ful h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">
                                                {courseItem?.title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Created By{" "}
                                                <span className="font-bold">
                                                    {courseItem?.instructorName}
                                                </span>
                                            </p>
                                            <p className="text-[16px] text-gray-600 mt-3 mb-2">
                                                {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length <= 1
                                                    ? "Lecture"
                                                    : "Lectures"
                                                    } - ${courseItem?.level.toUpperCase()} Level`}
                                            </p>
                                            <p className="font-bold text-lg">
                                                €{courseItem?.pricing}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : loadingState ? (
                            <Skeleton />
                        ) : (
                            <h1 className="font-extrabold text-4xl">No Courses Found</h1>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StudentViewCoursesPage;
