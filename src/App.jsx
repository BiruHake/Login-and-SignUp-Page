import './App.css'
import Login_form from './Login_form'
 import { ToastContainer } from 'react-toastify';
 import "react-toastify/dist/ReactToastify.css";
import SignUp from './SignUp';
import Login from './Login';

function App() {

  return (
    <>
    <Login_form/>
       <ToastContainer />
    </>
  )
}

export default App
