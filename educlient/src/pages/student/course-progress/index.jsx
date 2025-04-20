import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    getCurrentCourseProgressService,
} from "@/services";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from 'react-confetti'
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {

    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
        useContext(StudentContext);
    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
        useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const { id } = useParams();

    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id);
        if (response?.success) {
            if (!response?.data?.isPurchased) {
                setLockCourse(true);
            } else {
                setStudentCurrentCourseProgress({
                    courseDetails: response?.data?.courseDetails,
                    progress: response?.data?.progress,
                });

                if (response?.data?.completed) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);

                    return;
                }
            }
        }
    }

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);


    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {showConfetti && <Confetti />}
            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button onClick={() => navigate('/student-courses')} className="text-white" variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back To My Courses Page
                    </Button>
                    <h1></h1>
                </div>
            </div>
            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>You Can't View This Page</DialogTitle>
                        <DialogDescription>
                            Please Purchase This Course To Get Access
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Congratulation!
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You Have Completed The Course</Label>
                            <div className="flex flex-row gap-3">
                                <Button>My Courses Page</Button>
                                <Button>ReWatch The Course</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentViewCourseProgressPage;