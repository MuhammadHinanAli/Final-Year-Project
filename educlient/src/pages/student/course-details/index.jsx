import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {

    const {studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId, 
        setCurrentCourseDetailsId} = useContext(StudentContext);
    
    const {id} = useParams();

    useEffect(()=>{
        console.log(currentCourseDetailsId, "currentCourseDetailsId")
    },[currentCourseDetailsId])

    useEffect(()=>{
        if(id) setCurrentCourseDetailsId(id)
    },[id])

    return ( <div>StudentViewCourseDetailsPage</div> );
}

export default StudentViewCourseDetailsPage;