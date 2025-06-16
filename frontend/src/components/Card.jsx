import React, { useContext } from 'react';
import { userDataContext } from '../context/userContext';

const Card = ({ image }) => {
  const {
    setBackendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const handleClick = () => {
    setSelectedImage(image);
    setBackendImage(null);
    setFrontendImage(null);
  };

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] overflow-hidden bg-[#0b0b3d] border-2 
      hover:shadow-2xl hover:shadow-blue-950 border-[#2020747e] rounded-2xl cursor-pointer 
      hover:border-white transition-all duration-300 ${
        selectedImage === image ? 'border-white shadow-2xl shadow-blue-950' : ''
      }`}
      onClick={handleClick}
    >
      <img src={image} alt="assistant option" className="w-full h-full object-cover" />
    </div>
  );
};

export default Card;


