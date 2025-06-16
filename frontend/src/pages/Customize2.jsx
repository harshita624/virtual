import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {
    userData,
    backendImage,
    selectedImage,
    setUserData,
    serverUrl,
  } = useContext(userDataContext);

  const [assistantName, setAssistantName] = useState(userData?.assistantName || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('assistantName', assistantName.trim());

    if (backendImage) {
      formData.append('assistantImage', backendImage);
    } else if (selectedImage) {
      formData.append('imageUrl', selectedImage);
    }

    const result = await axios.post(
      `${serverUrl}/api/user/update`,
      formData,
      { withCredentials: true }
    );

    setUserData(result.data);
    console.log(result.data);
    navigate('/'); // <- This should work to redirect
  } catch (error) {
    console.error(error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className='w-full min-h-screen bg-gradient-to-br from-[#0a001f] to-[#220033] 
      text-gray-100 flex flex-col items-center py-12 px-6 relative overflow-hidden'
    >

      {/* Glowing Orbs */}
      <div aria-hidden='true'
        className='absolute w-[500px] h-[500px] bg-[#8e66ff33] blur-[140px] rounded-full top-[-100px] left-[-100px] z-0'></div>

      <div aria-hidden='true'
        className='absolute w-[400px] h-[400px] bg-[#00fff733] blur-[100px] rounded-full bottom-[100px] right-[20px] z-0'></div>

      {/* BACK ARROW */}
      <IoArrowBack
        className='absolute top-[30px] left-[30px] cursor-pointer text-[#b099ff] w-[30px] h-[30px] 
          hover:text-[#fff] transform hover:translate-x-[-5px] 
          transition-all duration-500 z-10'
        onClick={() => navigate('/customize')}
      />

      {/* TITLE */}
      <h1
        className='text-4xl font-semibold font-mono tracking-wider z-10 
          bg-gradient-to-r from-[#00f0ff] via-[#c8a2ff] to-[#a700ff] 
          bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,121,255,0.4)] 
          mb-12 text-center px-4'
      >
        Name Your <span className='text-[#b387ff]'>AI Assistant</span>
      </h1>

      {/* Input Section */}
      <div
        className='w-full max-w-md p-6 rounded-3xl border border-[#8e66ff] 
          backdrop-blur-md shadow-[0_0_30px_#c8a2ff] 
          hover:shadow-[0_0_50px_#c8a2ff] transform hover:translate-y-[-5px] 
          transition-all duration-500 ease-in-out z-10 text-center'
      >
        <input
          required
          aria-label='assistant-name'
          type='text'
          placeholder='e.g. Shifra'
          className='w-full p-4 rounded-full outline-none 
            border border-[#fff] border-dashed 
            bg-[#1c1337cc] text-gray-100 
            placeholder-gray-400 text-lg backdrop-blur-md 
            shadow-md focus:ring-2 focus:ring-[#b387ff] 
            transition-all duration-500'
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />

        {assistantName && (
          <button
            disabled={loading}
            onClick={handleUpdateAssistant}
            className='w-full mt-10 py-4 px-10 rounded-full font-semibold 
              text-lg border border-[#8e66ff] backdrop-blur-md 
              text-[#b099ff] hover:bg-[#8e66ff] hover:text-[#fff] 
              transform hover:translate-y-[-5px] 
              shadow-[0_0_30px_#c8a2ff] hover:shadow-[0_0_50px_#c8a2ff] 
              transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-wait'
          >
            {loading ? '🔄 Loading...' : '⚙️ Create Your Assistant'}
          </button>
        )}

      </div>

    </div>
  );
}

export default Customize2;
