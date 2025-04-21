const paypal = require("../../helpers/paypal");  // Import Paypal helper module
const Order = require("../../models/Order");  // Import Order model
const Course = require("../../models/Course");  // Import Course model
const StudentCourses = require("../../models/StudentCourses");  // Import StudentCourses model

// Create an order and initiate Paypal payment process
const createOrder = async (req, res) => {
    try {
        // Destructure the necessary fields from the request body
        const {
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            payerId,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
        } = req.body;

        // Define the payment details in PayPal's required format
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",  // Payment method is Paypal
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/payment-return`,  // URL to return to after payment
                cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,  // URL to go to if payment is canceled
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: courseTitle,  // Course title
                                sku: courseId,  // Course ID (used as SKU)
                                price: coursePricing,  // Price of the course
                                currency: "EUR",  // Currency
                                quantity: 1,  // Only one course
                            },
                        ],
                    },
                    amount: {
                        currency: "EUR",  // Currency for the payment
                        total: coursePricing.toFixed(2),  // Total price formatted to 2 decimal places
                    },
                    description: courseTitle,  // Course title as the payment description
                },
            ],
        };

        // Call PayPal to create the payment
        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);  // Log the error if payment creation fails
                return res.status(500).json({
                    success: false,
                    message: "Error while creating PayPal payment!",
                });
            } else {
                // If the payment is created successfully, save the order
                const newlyCreatedCourseOrder = new Order({
                    userId,
                    userName,
                    userEmail,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    orderDate,
                    paymentId,
                    payerId,
                    instructorId,
                    instructorName,
                    courseImage,
                    courseTitle,
                    courseId,
                    coursePricing,
                });

                await newlyCreatedCourseOrder.save();  // Save the order to the database

                // Find the approval URL from the payment response to redirect the user for approval
                const approveUrl = paymentInfo.links.find(
                    (link) => link.rel == "approval_url"
                ).href;

                res.status(201).json({
                    success: true,
                    data: {
                        approveUrl,  // URL for user to approve payment
                        orderId: newlyCreatedCourseOrder._id,  // Order ID for future reference
                    },
                });
            }
        });
    } catch (err) {
        console.log(err);  // Log any errors that occur during the process
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

// Capture the payment after approval and finalize the order
const capturePaymentAndFinalizeOrder = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        // Retrieve the order using the orderId from the request body
        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order can not be found",
            });
        }

        // Update the order status to 'paid' and mark the order as 'confirmed'
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        await order.save();  // Save the updated order status

        // Update the StudentCourses collection with the purchased course details
        const studentCourses = await StudentCourses.findOne({
            userId: order.userId,
        });

        if (studentCourses) {
            // If student courses exist, add the new course to the courses array
            studentCourses.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage,
            });

            await studentCourses.save();  // Save the updated student courses
        } else {
            // If no student courses exist, create a new record for the student
            const newStudentCourses = new StudentCourses({
                userId: order.userId,
                courses: [
                    {
                        courseId: order.courseId,
                        title: order.courseTitle,
                        instructorId: order.instructorId,
                        instructorName: order.instructorName,
                        dateOfPurchase: order.orderDate,
                        courseImage: order.courseImage,
                    },
                ],
            });

            await newStudentCourses.save();  // Save the new student courses record
        }

        // Update the Course schema to add the student to the course's enrolled students list
        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                },
            },
        });

        // Respond with the success message and updated order data
        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
        });
    } catch (err) {
        console.log(err);  // Log any errors that occur during the process
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };  // Export the functions for use elsewhere
