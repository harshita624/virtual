import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setErr("Password should be at least 6 chars.");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setErr('');
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

    setUserData(result.data.user || result.data);
      setLoading(false)
      navigate("/customize")

    } catch (error) {
      setUserData(null);
      setLoading(false);
      if (error.response?.data?.message) {
        setErr(error.response.data.message);
      } else {
        setErr("An error occurred during signup.");
      }
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div
      className='w-full min-h-screen flex justify-center items-center px-4 py-12 
      bg-gray-900 bg-center bg-cover relative'
      style={{ backgroundImage: `url('/dark-cyber-background.jpg')` }} // you can put your own background
    >
      {/* Signup Card */}
      <form
        onSubmit={handleSignUp}
        className='w-full max-w-md p-10 rounded-3xl backdrop-blur-md 
        border border-cyan-500/20 shadow-2xl shadow-cyan-500/20 transform hover:shadow-cyan-500/60 hover:translate-y-[-5px] 
        transition-all duration-500 ease-in-out relative bg-gray-900/90'
      >
        {/* Glowing Header */}
        <h1 className='text-cyan-500 font-semibold text-4xl mb-6 tracking-widest neon-text glow-cyan-500 text-center'>
          Signup to <span className='text-blue-500 neon-text-blue glow-blue-500'>CyberAssist</span>
        </h1>

        {/* Name */}
        <input
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
          type='text'
          placeholder='Username'
          className='w-full px-4 py-3 rounded-full border border-cyan-500/30 outline-none
          bg-gray-900/90 text-gray-100 placeholder-gray-500 
          focus:bg-gray-900 focus:border-cyan-500 
          transition-all duration-500 mb-4'
        />

        {/* Email */}
        <input
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type='email'
          placeholder='Email'
          className='w-full px-4 py-3 rounded-full border border-cyan-500/30 outline-none
          bg-gray-900/90 text-gray-100 placeholder-gray-500 
          focus:bg-gray-900 focus:border-cyan-500 
          transition-all duration-500 mb-4'
        />

        {/* Password */}
        <div className='w-full relative rounded-full border border-cyan-500/30
        bg-gray-900/90 text-gray-100 focus-within:bg-gray-900 focus-within:border-cyan-500
        transition-all duration-500 mb-4'>
          <input
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder='Create password'
            className='w-full px-4 py-3 rounded-full outline-none 
            bg-transparent text-gray-100 placeholder-gray-500'
          />

          {!showPassword ? (
            < FaRegEye
              onClick={() => setShowPassword(true)}
              className='absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500 hover:text-cyan-500 
              transition-colors duration-500 cursor-pointer'
              size='25px'
            />
          ) : (
            < FaRegEyeSlash
              onClick={() => setShowPassword(false)}
              className='absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500 hover:text-cyan-500 
              transition-colors duration-500 cursor-pointer'
              size='25px'
            />
          )}

        </div>

        {/* Confirm password */}
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type='password'
          placeholder='Confirm password'
          className='w-full px-4 py-3 rounded-full border border-cyan-500/30 outline-none
          bg-gray-900/90 text-gray-100 placeholder-gray-500 
          focus:bg-gray-900 focus:border-cyan-500 
          transition-all duration-500 mb-4'
        />

        {confirmPassword &&
          password !== confirmPassword && (
            <p className='text-red-500 mt-2 text-center'>Passwords do not match</p>
          )}

        {/* Password policy */}
        <p className='text-gray-500 text-sm mt-2 text-center'>
          Password should be at least 6 chars, with a number & a special character.
        </p>

        {/* Error */}
        {err && <p className='text-red-500 text-center mt-2'>{err}</p>}

        {/* Signup Button */}
        <button
          disabled={loading}
          className='w-full py-3 px-6 rounded-full font-semibold 
          text-gray-900 bg-cyan-500 shadow-cyan-500/50 shadow-md
          disabled:bg-gray-500 disabled:shadow-none disabled:cursor-wait
          transform hover:bg-cyan-400 hover:shadow-cyan-400 
          transition-all duration-500 mt-6'
        >
          {loading ? "Creating…" : "Create account"}
        </button>

        {/* Redirect to Sign In */}
        <p
          onClick={() => navigate('/signin')}
          className='text-gray-500 mt-4 text-center hover:text-cyan-500 transform hover:translate-x-1 
          transition-all duration-500 cursor-pointer'
        >
          Already have an account? <span className='text-cyan-500 font-semibold'>Login here</span>
        </p>
      </form>

      {/* Glowing circle effects in background (decorative)*/}
      <div aria-hidden='true' className='absolute bottom-20 left-20 w-40 h-40 rounded-full 
      blur-3xl bg-cyan-500/20'></div>

      <div aria-hidden='true' className='absolute top-20 right-20 w-40 h-40 rounded-full 
      blur-3xl bg-blue-500/20'></div>

    </div>
  );
}

export default SignUp;
