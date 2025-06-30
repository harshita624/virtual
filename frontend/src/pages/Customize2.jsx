// Customize2.jsx

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
    formData.append('assistantName', assistantName);
    if (backendImage) {
      formData.append('assistantImage', backendImage);
    } else {
      formData.append('imageUrl', selectedImage);
    }

    // Await the result
    const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
      withCredentials: true
    });

    // Update context first
    setUserData(result.data);

    // THEN navigate
    navigate('/', { replace: true });
  } catch (error) {
    console.error(error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className='w-full min-h-screen bg-gradient-to-br from-[#0a001f] to-[#220033]
        text-gray-100 flex flex-col items-center py-8 px-4 relative overflow-hidden'
    >
      {/* Viewport tag needs to be in your index.html */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}

      {/* Glowing Orbs */}
      <div aria-hidden='true'
        className='absolute w-[300px] h-[300px] bg-[#8e66ff33] blur-[140px] rounded-full top-[-80px] left-[-80px] z-0'>
      </div>
      <div aria-hidden='true'
        className='absolute w-[250px] h-[250px] bg-[#00fff733] blur-[100px] rounded-full bottom-[50px] right-[10px] z-0'>
      </div>

      {/* Back Arrow */}
      <IoArrowBack
        className='absolute top-4 left-4 cursor-pointer text-[#b099ff] w-7 h-7
          hover:text-[#fff] transform hover:-translate-x-1 transition-all duration-300 z-10'
        onClick={() => navigate('/customize')}
        onTouchStart={() => navigate('/customize')}
      />

      {/* Title */}
      <h1
        className='text-2xl md:text-4xl font-semibold font-mono tracking-wider z-10
          bg-gradient-to-r from-[#00f0ff] via-[#c8a2ff] to-[#a700ff]
          bg-clip-text text-transparent drop-shadow-md mb-8 text-center px-2'
      >
        Name Your <span className='text-[#b387ff]'>AI Assistant</span>
      </h1>

      {/* Input Card */}
      <div
        className='w-full max-w-md p-4 md:p-6 rounded-3xl border border-[#8e66ff]
          backdrop-blur-md shadow-md md:shadow-lg transform transition-all duration-500 ease-in-out z-10'
      >
        <input
          required
          aria-label='assistant-name'
          type='text'
          placeholder='e.g. Shifra'
          className='w-full p-3 md:p-4 rounded-full outline-none
            border border-dashed border-[#fff] bg-[#1c1337cc] text-gray-100
            placeholder-gray-400 text-base md:text-lg focus:ring-2 focus:ring-[#b387ff]
            transition-all duration-300'
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />

        {assistantName && (
          <button
            disabled={loading}
            onClick={handleUpdateAssistant}
            onTouchStart={(e) => {
              e.preventDefault();
              handleUpdateAssistant();
            }}
            className='w-full mt-6 py-3 md:py-4 px-6 md:px-10 rounded-full font-semibold
              text-lg border border-[#8e66ff] backdrop-blur-md
              text-[#b099ff] hover:bg-[#8e66ff] hover:text-[#fff]
              transform hover:-translate-y-1
              shadow-md md:shadow-lg transition-all duration-300 ease-in-out
              disabled:opacity-50 disabled:cursor-wait'
          >
            {loading ? '🔄 Loading...' : '⚙️ Create Your Assistant'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Customize2;
