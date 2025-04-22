import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    getCurrentCourseProgressService,
    markLectureAsViewedService,
    resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
    // Hook for navigation between pages
    const navigate = useNavigate();

    // Contexts for authentication and student data
    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
        useContext(StudentContext);

    // State management for course view logic
    const [lockCourse, setLockCourse] = useState(false); // Locks course if not purchased
    const [currentLecture, setCurrentLecture] = useState(null); // Tracks the current lecture
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
        useState(false); // Controls showing completion dialog
    const [showConfetti, setShowConfetti] = useState(false); // Controls showing confetti on completion
    const [isSideBarOpen, setIsSideBarOpen] = useState(true); // Controls side bar visibility

    // Fetch course ID from URL params
    const { id } = useParams();

    // Fetch current course progress from the server
    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id);
        if (response?.success) {
            if (!response?.data?.isPurchased) {
                setLockCourse(true); // Lock course if not purchased
            } else {
                setStudentCurrentCourseProgress({
                    courseDetails: response?.data?.courseDetails,
                    progress: response?.data?.progress,
                });

                // If course is completed, show completion dialog and confetti
                if (response?.data?.completed) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);

                    return;
                }

                // Determine the next lecture to be viewed based on progress
                if (response?.data?.progress?.length === 0) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                } else {
                    const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
                        (acc, obj, index) => {
                            return acc === -1 && obj.viewed ? index : acc;
                        },
                        -1
                    );

                    setCurrentLecture(
                        response?.data?.courseDetails?.curriculum[
                        lastIndexOfViewedAsTrue + 1
                        ]
                    );
                }
            }
        }
    }

    // Update course progress by marking the current lecture as viewed
    async function updateCourseProgress() {
        if (currentLecture) {
            const response = await markLectureAsViewedService(
                auth?.user?._id,
                studentCurrentCourseProgress?.courseDetails?._id,
                currentLecture._id
            );

            if (response?.success) {
                fetchCurrentCourseProgress(); // Refresh course progress after update
            }
        }
    }

    // Reset course progress and allow rewatching the course
    async function handleRewatchCourse() {
        const response = await resetCourseProgressService(
            auth?.user?._id,
            studentCurrentCourseProgress?.courseDetails?._id
        );

        if (response?.success) {
            setCurrentLecture(null); // Reset current lecture
            setShowConfetti(false); // Stop confetti
            setShowCourseCompleteDialog(false); // Close the completion dialog
            fetchCurrentCourseProgress(); // Fetch updated course progress
        }
    }

    // Initial data fetch when component is mounted or course ID changes
    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    // Update course progress when the current lecture's progress reaches 100%
    useEffect(() => {
        if (currentLecture?.progressValue === 1) updateCourseProgress();
    }, [currentLecture]);

    // Hide confetti after 15 seconds
    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);

    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {showConfetti && <Confetti />} {/* Show confetti on course completion */}

            {/* Header with navigation and course title */}
            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate("/student-courses")}
                        className="text-white"
                        variant="ghost"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Courses Page
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                    {isSideBarOpen ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Main content area with video player and sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <div
                    className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}
                >
                    {/* Video Player */}
                    <VideoPlayer
                        width="100%"
                        height="500px"
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-6 bg-[#1c1d1f]">
                        <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>

                {/* Sidebar with course content and overview */}
                <div
                    className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
                            <TabsTrigger
                                value="content"
                                className=" text-white rounded-none h-full"
                            >
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger
                                value="overview"
                                className=" text-white rounded-none h-full"
                            >
                                Overview
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-4">
                                    {/* List of course curriculum */}
                                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                                        (item) => (
                                            <div
                                                className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                                                key={item._id}
                                            >
                                                {/* Check if the lecture is viewed */}
                                                {studentCurrentCourseProgress?.progress?.find(
                                                    (progressItem) => progressItem.lectureId === item._id
                                                )?.viewed ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Play className="h-4 w-4 " />
                                                )}
                                                <span>{item?.title}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="overview" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-4">About this course</h2>
                                    <p className="text-gray-400">
                                        {studentCurrentCourseProgress?.courseDetails?.description}
                                    </p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialogs for locked course and course completion */}
            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>You can't view this page</DialogTitle>
                        <DialogDescription>
                            Please purchase this course to get access
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent showOverlay={false} className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course</Label>
                            <div className="flex flex-row gap-3">
                                <Button onClick={() => navigate("/student-courses")}>
                                    My Courses Page
                                </Button>
                                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentViewCourseProgressPage;
