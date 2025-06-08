import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/Login-and-SignUp-Page/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('token',data.token);
        toast.success(data.message || "Login successfully!");
        setUsername('');
        setPassword('');
       navigate('/Login-and-SignUp-Page/dashboard');
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
     toast.error("Server error, please try again.");
    }
  };

  return (
    <div className='bg-amber-200 max-w-[1000px] p-4 flex flex-col justify-center items-center rounded-md shadow-4xl-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <h2 className='font-bold text-4xl bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent'>Login</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-1 mt-4 text-center'>
        <div className='mb-3'>
          <label>Username:</label><br/>
          <input
            type="text"
            value={username}
            placeholder='enter username'
            onChange={e => setUsername(e.target.value)}
            className='px-[26px] py-[4px] text-center border-1 rounded-md'
          />
        </div>
        <div style={{ marginBottom: '1rem'}}>
          <label>Password:</label><br />
          <input
            type="password"
            placeholder='enter password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='px-[26px] py-[4px] text-center border-1 rounded-md'
          />
        </div>
         <a className="text-blue-700 text-right" href="#">forgote password</a>
        <button type="submit" className='bg-blue-500 shadow-4xs text-white '>Login</button>
        <h4>Not a member <a className="text-blue-700" href="#" onClick={()=>setISLogin(true)} >SignUp Now</a> </h4>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
}

export default Login;