import { Routes, Route } from "react-router-dom"
import AuthPage from "./pages/auth"

function App() {

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage></AuthPage>} />
    </Routes>
  )
}

export default App