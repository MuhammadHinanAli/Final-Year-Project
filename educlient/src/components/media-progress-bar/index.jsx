import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// MediaProgressbar component to display a progress bar during media upload
function MediaProgressbar({ isMediaUploading, progress }) {
    // State to control visibility of the progress bar and its animation
    const [showProgress, setShowProgress] = useState(false);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // Effect hook to trigger when uploading state or progress changes
    useEffect(() => {
        // If media is uploading, show progress bar and set progress
        if (isMediaUploading) {
            setShowProgress(true);
            setAnimatedProgress(progress);
        } else {
            // If media upload is done, hide the progress bar after 1 second
            const timer = setTimeout(() => {
                setShowProgress(false);
            }, 1000);

            // Cleanup the timer if component unmounts or upload state changes
            return () => clearTimeout(timer);
        }
    }, [isMediaUploading, progress]);

    // If progress bar is not to be shown, return null
    if (!showProgress) return null;

    return (
        <div className="w-full bg-gray-200 rounded-full h-3 mt-5 mb-5 relative overflow-hidden">
            {/* Motion div for animated progress bar */}
            <motion.div
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}  // Initial width is 0
                animate={{
                    width: `${animatedProgress}%`,  // Animate width based on progress
                    transition: { duration: 0.5, ease: "easeInOut" },  // Smooth animation
                }}
            >
                {/* If progress is 100% and upload is still in progress, add a moving effect */}
                {progress >= 100 && isMediaUploading && (
                    <motion.div
                        className="absolute top-0 left-0 right-0 bottom-0 bg-blue-400 opacity-50"
                        animate={{
                            x: ["0%", "100%", "0%"],  // Moving effect from left to right
                        }}
                        transition={{
                            duration: 2,  // 2 seconds duration for full cycle
                            repeat: Infinity,  // Repeat the animation indefinitely
                            ease: "linear",  // Smooth continuous movement
                        }}
                    />
                )}
            </motion.div>
        </div>
    );
}

export default MediaProgressbar;
