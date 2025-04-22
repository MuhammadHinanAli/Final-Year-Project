import { useCallback, useEffect, useRef, useState } from "react";  // Import React hooks
import ReactPlayer from "react-player";  // Import ReactPlayer component for playing video
import { Slider } from "../ui/slider";  // Import Slider component for video progress and volume control
import { Button } from "../ui/button";  // Import Button component
import {  // Import icons for UI buttons
    Maximize,
    Minimize,
    Pause,
    Play,
    RotateCcw,
    RotateCw,
    Volume2,
    VolumeX,
} from "lucide-react";  // Import icons from lucide-react

// VideoPlayer component accepts props like video width, height, URL, and progress update callback
function VideoPlayer({
    width = "100%",
    height = "100%",
    url,
    onProgressUpdate,
    progressData,
}) {
    const [playing, setPlaying] = useState(false);  // Track if the video is playing
    const [volume, setVolume] = useState(0.5);  // Volume state (default 50%)
    const [muted, setMuted] = useState(false);  // Mute state
    const [played, setPlayed] = useState(0);  // Track how much of the video has been played (0 to 1)
    const [seeking, setSeeking] = useState(false);  // Track if the user is seeking the video
    const [isFullScreen, setIsFullScreen] = useState(false);  // Fullscreen state
    const [showControls, setShowControls] = useState(true);  // State for showing or hiding controls

    const playerRef = useRef(null);  // Reference to the ReactPlayer component
    const playerContainerRef = useRef(null);  // Reference to the video player container
    const controlsTimeoutRef = useRef(null);  // Timeout reference to hide controls after inactivity

    // Function to toggle play/pause state
    function handlePlayAndPause() {
        setPlaying(!playing);
    }

    // Function to handle progress updates from ReactPlayer
    function handleProgress(state) {
        if (!seeking) {
            setPlayed(state.played);  // Update played progress if not seeking
        }
    }

    // Function to rewind video by 5 seconds
    function handleRewind() {
        playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
    }

    // Function to forward video by 5 seconds
    function handleForward() {
        playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
    }

    // Function to toggle mute state
    function handleToggleMute() {
        setMuted(!muted);
    }

    // Function to handle seeking video
    function handleSeekChange(newValue) {
        setPlayed(newValue[0]);  // Update played value when seeking
        setSeeking(true);  // Set seeking state to true
    }

    // Function to update player when seeking is completed
    function handleSeekMouseUp() {
        setSeeking(false);  // Set seeking state to false
        playerRef.current?.seekTo(played);  // Seek the player to the new position
    }

    // Function to change volume
    function handleVolumeChange(newValue) {
        setVolume(newValue[0]);
    }

    // Utility function to pad numbers for formatting time
    function pad(string) {
        return ("0" + string).slice(-2);  // Ensure two digits for minutes and seconds
    }

    // Function to format the time in minutes and seconds (or hours if applicable)
    function formatTime(seconds) {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = pad(date.getUTCSeconds());

        if (hh) {
            return `${hh}:${pad(mm)}:${ss}`;  // Format as HH:MM:SS
        }

        return `${mm}:${ss}`;  // Format as MM:SS
    }

    // Function to handle fullscreen toggle
    const handleFullScreen = useCallback(() => {
        if (!isFullScreen) {
            if (playerContainerRef?.current.requestFullscreen) {
                playerContainerRef?.current?.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, [isFullScreen]);

    // Function to show controls when the user moves the mouse over the video player
    function handleMouseMove() {
        setShowControls(true);  // Show controls
        clearTimeout(controlsTimeoutRef.current);  // Clear previous timeout for hiding controls
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);  // Hide controls after 3 seconds
    }

    // Effect to listen to fullscreen change events
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(document.fullscreenElement);  // Update fullscreen state when fullscreen changes
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);  // Add event listener for fullscreen changes

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);  // Cleanup event listener
        };
    }, []);

    // Effect to update progress data after each progress update
    useEffect(() => {
        if (played === 1) {
            onProgressUpdate({
                ...progressData,
                progressValue: played,  // Update the progress value
            });
        }
    }, [played]);

    return (
        <div
            ref={playerContainerRef}
            className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}  // Fullscreen styling
      `}
            style={{ width, height }}  // Set width and height based on props
            onMouseMove={handleMouseMove}  // Show controls when mouse moves
            onMouseLeave={() => setShowControls(false)}  // Hide controls when mouse leaves
        >
            <ReactPlayer
                ref={playerRef}
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                url={url}  // Pass video URL
                playing={playing}  // Control video play state
                volume={volume}  // Set volume
                muted={muted}  // Set mute state
                onProgress={handleProgress}  // Update progress
            />
            {showControls && (  // Show controls if 'showControls' is true
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Video progress slider */}
                    <Slider
                        value={[played * 100]}  // Set slider value to played progress
                        max={100}
                        step={0.1}
                        onValueChange={(value) => handleSeekChange([value[0] / 100])}  // Handle seek change
                        onValueCommit={handleSeekMouseUp}  // Commit seeking
                        className="w-full mb-4"
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* Play/Pause button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePlayAndPause}
                                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                            >
                                {playing ? (
                                    <Pause className="h-6 w-6" />  // Show pause icon if playing
                                ) : (
                                    <Play className="h-6 w-6" />  // Show play icon if paused
                                )}
                            </Button>
                            {/* Rewind and Forward buttons */}
                            <Button
                                onClick={handleRewind}
                                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                                variant="ghost"
                                size="icon"
                            >
                                <RotateCcw className="h-6 w-6" />
                            </Button>
                            <Button
                                onClick={handleForward}
                                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                                variant="ghost"
                                size="icon"
                            >
                                <RotateCw className="h-6 w-6" />
                            </Button>
                            {/* Mute button */}
                            <Button
                                onClick={handleToggleMute}
                                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                                variant="ghost"
                                size="icon"
                            >
                                {muted ? (
                                    <VolumeX className="h-6 w-6" />  // Show muted icon
                                ) : (
                                    <Volume2 className="h-6 w-6" />  // Show unmuted icon
                                )}
                            </Button>
                            {/* Volume control slider */}
                            <Slider
                                value={[volume * 100]}
                                max={100}
                                step={1}
                                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                                className="w-24 "
                            />
                        </div>
                        {/* Video time display and fullscreen toggle */}
                        <div className="flex items-center space-x-2">
                            <div className="text-white">
                                {formatTime(played * (playerRef?.current?.getDuration() || 0))}/{" "}
                                {formatTime(playerRef?.current?.getDuration() || 0)}
                            </div>
                            <Button
                                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                                variant="ghost"
                                size="icon"
                                onClick={handleFullScreen}
                            >
                                {isFullScreen ? (
                                    <Minimize className="h-6 w-6" />  // Minimize icon when fullscreen
                                ) : (
                                    <Maximize className="h-6 w-6" />  // Maximize icon when not fullscreen
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;
