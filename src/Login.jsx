import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './SignUp';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Login successfully!");
        window.location.href = 'https://www.amazon.in/computers-and-accessories/b/?ie=UTF8&node=976392031&ref_=nav_cs_pc';
        setUsername('');
        setPassword('');
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
     toast.error("Server error, please try again.");
    }
  };

  return (
    <div className='bg-amber-200 max-w-[500px] p-4 flex flex-col justify-center items-center rounded-md shadow-4xl-white '>
      <h2 className='font-bold text-4xl bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent'>Login</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-1 mt-4 text-center'>
        <div className='mb-3'>
          <label>Username:</label><br />
          <input
            type="text"
            //value={username}
            placeholder='enter username'
            onChange={e => setUsername(e.target.value)}
            className='px-[26px] py-[4px] text-center border-1 rounded-md'
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
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
        <p>Not a member <a className="text-blue-700" href="#" onClick={()=>setISLogin(true)} >SignUp Now</a> </p>
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