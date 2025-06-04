import "./App.css";
import Login_form from "./Login_form";
import Dashboard from "./components/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Login-and-SignUp-Page/" element={<Login_form />} />
        <Route path="/Login-and-SignUp-Page/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
