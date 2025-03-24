import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { StudentContext } from "@/context/student-context";

function StudentHomePage() {

    //const [studentCoursesList, setStudentCoursesList] = useContext(StudentContext);

    return (
        <div className="min-h-screen bg-white ">
            <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12 ">
                    <h1 className="text-3xl font-bold mb-4">"Education is the most powerful weapon which you can use to change the world." ~ Nelson Mandela</h1>
                    <p className="text-xl">Welcome to EduQuest, the ultimate online learning platform designed to empower students and educators. Whether you're looking to enhance your skills, access interactive courses, or manage educational resources efficiently, our LMS provides a seamless and engaging learning experience. With intuitive navigation, real-time progress tracking, and a vast library of courses, we make education accessible anytime, anywhere. Join us today and take the next step in your learning journey!</p>
                </div>
                <div className="lg:w-full mb-8 lg:mb-0">
                    <img 
                    src={banner}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg"/>
                </div>
            </section>
            <section className="py-8 px-4 lg:px-8 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {
                        courseCategories.map(categoryItem=>
                            <Button className="justify-start" variant="outline" key={categoryItem.id}>{categoryItem.label}</Button>
                        )
                    }
                </div>
            </section>
        </div>
    );
}

export default StudentHomePage;