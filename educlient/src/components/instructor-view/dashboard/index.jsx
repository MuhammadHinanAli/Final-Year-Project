import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Euro, Users } from "lucide-react";

// InstructorDashboard component to display a summary and student list
function InstructorDashboard({ listOfCourses }) {

  // Function to calculate total students, total revenue, and generate student list
  function calculateTotalStudentsAndProfit() {
    // Using reduce to iterate over courses and accumulate total students and total profit
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        // Get the number of students in the current course
        const studentCount = course.students.length;

        // Add to total students and total profit
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        // Add each student to the student list with course details
        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,   // Initial value for total students
        totalProfit: 0,     // Initial value for total profit
        studentList: [],    // Initial empty student list
      }
    );

    // Return the final calculated results
    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  // Log the calculation results for debugging purposes
  console.log(calculateTotalStudentsAndProfit());

  // Configuration array for the stats cards to display
  const config = [
    {
      icon: Users,          // Icon for total students
      label: "Total Students",   // Label text
      value: calculateTotalStudentsAndProfit().totalStudents,  // Value to display
    },
    {
      icon: Euro,           // Icon for total revenue
      label: "Total Revenue",    // Label text
      value: calculateTotalStudentsAndProfit().totalProfit,    // Value to display
    },
  ];

  return (
    <div>
      {/* Grid layout for the cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Mapping through the config array to render the cards */}
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}  {/* Display the label for the card */}
              </CardTitle>
              {/* Display the icon for the card */}
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Display the value (total students or total revenue) */}
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card to display the student list */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>  {/* Title of the student list card */}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Table to display the student list */}
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {/* Table headers for course name, student name, and email */}
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mapping through the student list to render each student */}
                {calculateTotalStudentsAndProfit().studentList.map(
                  (studentItem, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {studentItem.courseTitle}  {/* Course title */}
                      </TableCell>
                      <TableCell>{studentItem.studentName}</TableCell> {/* Student name */}
                      <TableCell>{studentItem.studentEmail}</TableCell> {/* Student email */}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
