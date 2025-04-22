import { Button } from "@/components/ui/button";  // Importing the Button component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  // Importing card components for layout
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";  // Importing dialog components for displaying modals
import { Skeleton } from "@/components/ui/skeleton";  // Importing Skeleton loader for displaying while data is loading
import VideoPlayer from "@/components/video-player";  // Importing VideoPlayer component for playing course videos
import { AuthContext } from "@/context/auth-context";  // Importing authentication context
import { StudentContext } from "@/context/student-context";  // Importing student context
import {
    checkCoursePurchaseInfoService,
    createPaymentService,
    fetchStudentViewCourseDetailsService,
} from "@/services";  // Importing service functions for course data and payment handling
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";  // Importing icons
import { useContext, useEffect, useState } from "react";  // Importing hooks from React
import { useLocation, useNavigate, useParams } from "react-router-dom";  // Importing routing hooks

function StudentViewCourseDetailsPage() {
    // Accessing student and auth context values
    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);

    const { auth } = useContext(AuthContext);

    // Local state for video preview and dialog control
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const [approvalUrl, setApprovalUrl] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();  // Extracting course ID from URL
    const location = useLocation();  // Getting the current location (path) of the page

    // Function to fetch course details and handle purchase checks
    async function fetchStudentViewCourseDetails() {
        // Checking if the course has been purchased
        const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(
            currentCourseDetailsId,
            auth?.user._id
        );

        // If course is purchased, navigate to course progress page
        if (
            checkCoursePurchaseInfoResponse?.success &&
            checkCoursePurchaseInfoResponse?.data
        ) {
            navigate(`/course-progress/${currentCourseDetailsId}`);
            return;
        }

        // Fetching course details
        const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);

        // If the details are successfully fetched, update the state
        if (response?.success) {
            setStudentViewCourseDetails(response?.data);
            setLoadingState(false);
        } else {
            setStudentViewCourseDetails(null);
            setLoadingState(false);
        }
    }

    // Function to set the video preview when user selects a curriculum item
    function handleSetFreePreview(getCurrentVideoInfo) {
        console.log(getCurrentVideoInfo);
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }

    // Function to initiate the payment process for the course
    async function handleCreatePayment() {
        // Preparing the payment payload
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "initiated",
            orderDate: new Date(),
            paymentId: "",
            payerId: "",
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: studentViewCourseDetails?.pricing,
        };

        console.log(paymentPayload, "paymentPayload");
        // Sending payment data to the service
        const response = await createPaymentService(paymentPayload);

        // If payment creation is successful, set the approval URL for PayPal
        if (response.success) {
            sessionStorage.setItem(
                "currentOrderId",
                JSON.stringify(response?.data?.orderId)
            );
            setApprovalUrl(response?.data?.approveUrl);
        }
    }

    // Show preview dialog when a free video preview URL is set
    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
    }, [displayCurrentVideoFreePreview]);

    // Fetch course details when the course ID changes
    useEffect(() => {
        if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
    }, [currentCourseDetailsId]);

    // Set the current course ID when it's passed in the URL parameters
    useEffect(() => {
        if (id) setCurrentCourseDetailsId(id);
    }, [id]);

    // Reset course details and related state when the URL changes
    useEffect(() => {
        if (!location.pathname.includes("course/details"))
            setStudentViewCourseDetails(null),
                setCurrentCourseDetailsId(null);
    }, [location.pathname]);

    // Display loading skeleton while data is being fetched
    if (loadingState) return <Skeleton />;

    // Redirect to PayPal approval URL if available
    if (approvalUrl !== "") {
        window.location.href = approvalUrl;
    }

    // Find the index of the first free preview video in the curriculum
    const getIndexOfFreePreviewUrl =
        studentViewCourseDetails !== null
            ? studentViewCourseDetails?.curriculum?.findIndex(
                (item) => item.freePreview
            )
            : -1;

    return (
        <div className="mx-auto p-4">
            {/* Course details header */}
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">
                    {studentViewCourseDetails?.title}
                </h1>
                <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Created By {studentViewCourseDetails?.instructorName}</span>
                    <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
                    <span className="flex items-center">
                        <Globe className="mr-1 h-4 w-4" />
                        {studentViewCourseDetails?.primaryLanguage}
                    </span>
                    <span>
                        {studentViewCourseDetails?.students.length}{" "}
                        {studentViewCourseDetails?.students.length <= 1
                            ? "Student"
                            : "Students"}
                    </span>
                </div>
            </div>

            {/* Main content displaying course details */}
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    {/* What you'll learn section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What you'll learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {studentViewCourseDetails?.objectives
                                    .split(",")
                                    .map((objective, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span>{objective}</span>
                                        </li>
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Course description section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>{studentViewCourseDetails?.description}</CardContent>
                    </Card>

                    {/* Curriculum section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentViewCourseDetails?.curriculum?.map(
                                (curriculumItem, index) => (
                                    <li
                                        className={`${curriculumItem?.freePreview
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                            } flex items-center mb-4`}
                                        onClick={
                                            curriculumItem?.freePreview
                                                ? () => handleSetFreePreview(curriculumItem)
                                                : null
                                        }
                                    >
                                        {curriculumItem?.freePreview ? (
                                            <PlayCircle className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Lock className="mr-2 h-4 w-4" />
                                        )}
                                        <span>{curriculumItem?.title}</span>
                                    </li>
                                )
                            )}
                        </CardContent>
                    </Card>
                </main>

                {/* Payment and course pricing section */}
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            {/* Video preview */}
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <VideoPlayer
                                    url={
                                        getIndexOfFreePreviewUrl !== -1
                                            ? studentViewCourseDetails?.curriculum[
                                                getIndexOfFreePreviewUrl
                                            ].videoUrl
                                            : ""
                                    }
                                    width="450px"
                                    height="200px"
                                />
                            </div>

                            {/* Pricing and Buy Now button */}
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    ${studentViewCourseDetails?.pricing}
                                </span>
                            </div>
                            <Button onClick={handleCreatePayment} className="w-full">
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>

            {/* Free preview dialog */}
            <Dialog
                open={showFreePreviewDialog}
                onOpenChange={() => {
                    setShowFreePreviewDialog(false);
                    setDisplayCurrentVideoFreePreview(null);
                }}
            >
                <DialogContent className="w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="450px"
                            height="200px"
                        />
                    </div>
                    {/* List of free preview videos */}
                    <div className="flex flex-col gap-2">
                        {studentViewCourseDetails?.curriculum
                            ?.filter((item) => item.freePreview)
                            .map((filteredItem) => (
                                <p
                                    onClick={() => handleSetFreePreview(filteredItem)}
                                    className="cursor-pointer text-[16px] font-medium"
                                >
                                    {filteredItem?.title}
                                </p>
                            ))}
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentViewCourseDetailsPage;
