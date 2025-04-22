import { useState } from 'react'  // Importing useState hook from React for managing component state
import axios from 'axios'  // Importing axios for making HTTP requests

function StudentViewAiChatbot() {
    // State hooks to manage user question and generated answer
    const [question, setQuestion] = useState("");  // Stores the user's question
    const [answer, setAnswer] = useState("");  // Stores the generated answer

    // Function to generate an AI response for the user's question
    async function generateAnswer() {
        setAnswer("Generating answer...");  // Display a loading message while fetching the answer
        try {
            // Sending a POST request to the Google Gemini API with the user's question
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBPk2a4UMaNZ301eCGHUb45YYLsdPKDFe8",  // API endpoint with the key
                method: "post",  // POST request to send data
                data: {
                    "contents": [{
                        "parts": [{ "text": question }]  // Passing the user's question as part of the request payload
                    }]
                }
            });
            // Setting the response data (AI-generated answer) to state
            setAnswer(response.data.candidates[0].content.parts[0].text);
        } catch (err) {
            // In case of an error, set the answer state to an error message
            setAnswer("Error generating answer.");
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">💬 Chat AI</h1>

            {/* Textarea where the user types their question */}
            <textarea
                value={question}  // The value of the textarea is controlled by the 'question' state
                onChange={(e) => setQuestion(e.target.value)}  // Updates the 'question' state when the user types
                placeholder="Ask me anything..."  // Placeholder text for the textarea
                rows="8"  // Sets the number of rows visible in the textarea
                className="w-full p-4 mb-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>

            {/* Button that triggers the AI response generation */}
            <button
                onClick={generateAnswer}  // When the button is clicked, it calls the 'generateAnswer' function
                className="bg-black hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition duration-200"
            >
                Send Question  {/* Button text */}
            </button>

            {/* Section to display the AI-generated answer */}
            <div className="mt-8 bg-gray-100 p-6 rounded-xl max-h-80 overflow-y-auto whitespace-pre-wrap break-words">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Answer:</h2>
                <div>{answer}</div>  {/* Display the AI answer here */}
            </div>
        </div>
    )
}

export default StudentViewAiChatbot;  // Export the component to be used elsewhere in the application
