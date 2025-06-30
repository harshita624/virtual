import React, { useContext, useRef } from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";

import Card from "../components/Card";

import { LuImagePlus } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";

import { userDataContext } from "../context/UserContext";

import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const inputImage = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file)); // preview for UI
      setSelectedImage("input"); // mark this as selected
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-[#0a001f] to-[#12003c] 
      text-white flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      {/* BACKGROUND GLOW ORBITS (OPTIONAL - just for effect)*/}
      <div className="absolute w-[400px] h-[400px] bg-[#8e66ff33] blur-[120px] rounded-full top-[-100px] left-[-100px] z-0" />
      <div className="absolute w-[300px] h-[300px] bg-[#00fff766] blur-[100px] rounded-full bottom-[100px] right-[20px] z-0" />

      <IoArrowBack
        className="absolute top-[30px] left-[30px] cursor-pointer text-[#b099ff] w-[28px] h-[28px] 
        hover:text-gray-50 transition duration-300 z-10"
        onClick={() => navigate("/")} // back to home
      />

      <h1
        className="text-[28px] md:text-[34px] z-10 text-center mb-10 font-semibold font-mono tracking-wider 
      bg-gradient-to-r from-[#00f0ff] via-gray-50 to-[#a700ff] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
        Select your <span className="text-[#b387ff]">AI Assistant's Image</span>
      </h1>

      {/* Card Grid */}
      <div className="w-full max-w-[1080px] flex justify-center items-center flex-wrap gap-5 z-10">
        {/* Predefined cards */}
        <Card image={image1} onClick={() => setSelectedImage("image1")} isSelected={selectedImage === "image1"} />
        <Card image={image2} onClick={() => setSelectedImage("image2")} isSelected={selectedImage === "image2"} />
        <Card image={image3} onClick={() => setSelectedImage("image3")} isSelected={selectedImage === "image3"} />
        <Card image={image4} onClick={() => setSelectedImage("image4")} isSelected={selectedImage === "image4"} />
        <Card image={image5} onClick={() => setSelectedImage("image5")} isSelected={selectedImage === "image5"} />
        <Card image={image6} onClick={() => setSelectedImage("image6")} isSelected={selectedImage === "image6"} />
        <Card image={image7} onClick={() => setSelectedImage("image7")} isSelected={selectedImage === "image7"} />

        {/* Upload custom image */}
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] overflow-hidden 
            bg-[#1a103bcc] border-2 border-[#3e2c77] rounded-2xl cursor-pointer 
            hover:border-[#c8a2ff] hover:shadow-[0_0_25px_#b387ff] flex items-center justify-center 
            transition-all duration-500 backdrop-blur-sm ${
              selectedImage === "input" ? "border-[#ffffff] shadow-[0_0_30px_#d6bcff]" : ""
            }`}
          onClick={() => inputImage.current.click()}>
          {!frontendImage ? (
            <LuImagePlus className="text-[#cccccc] w-[30px] h-[30px]" />
          ) : (
            <img src={frontendImage} alt="Selected" className="w-full h-full object-cover" />
          )}

        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Continue button */}
      {selectedImage && (
        <button
          className="mt-12 px-8 py-3 bg-[#1e1e2f] text-[#b387ff] border border-[#8e66ff] 
            rounded-full font-semibold text-lg backdrop-blur-md 
            hover:bg-[#8e66ff] hover:text-gray-50 transition-all duration-300 
            hover:shadow-[0_0_25px_#a579ff]"
          onClick={() => navigate("/customize2")}>
          ➤ Continue
        </button>
      )}

    </div>
  );
};

export default Customize;
