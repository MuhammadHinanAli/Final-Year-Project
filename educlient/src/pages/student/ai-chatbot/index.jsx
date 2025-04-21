import { useState } from 'react'
import axios from 'axios'

function StudentViewAiChatbot() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    async function generateAnswer() {
        setAnswer("Generating answer...");
        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBPk2a4UMaNZ301eCGHUb45YYLsdPKDFe8",
                method: "post",
                data: {
                    "contents": [{
                        "parts": [{ "text": question }]
                    }]
                }
            });
            setAnswer(response.data.candidates[0].content.parts[0].text);
        } catch (err) {
            setAnswer("Error generating answer.");
        }
    }
    return (
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl">
            <h1 className="text-3xl font-bold text-black mb-6 text-center">💬 Chat AI</h1>

            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything..."
                rows="8"
                className="w-full p-4 mb-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>

            <button
                onClick={generateAnswer}
                className="bg-black hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition duration-200"
            >
                Send Question
            </button>

            <div className="mt-8 bg-gray-100 p-6 rounded-xl max-h-80 overflow-y-auto whitespace-pre-wrap break-words">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Answer:</h2>
                <div>{answer}</div>
            </div>
        </div>
    )
}

export default StudentViewAiChatbot;