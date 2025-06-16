import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserDataProvider = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);

  const getGeminiResponse = async (command) => {
    try {
      if (!command) {
        return { 
          type: "general",
          userInput: "",
          response: "I didn't catch that. Could you repeat?" 
        };
      }

      console.log("Sending command to backend:", command);

      const result = await axios.post(
        `${serverUrl}/api/user/askToAssistant`,
        { command },
        { 
          withCredentials: true,
          timeout: 15000 // 15 second timeout
        }
      );

      console.log("Backend response:", result.data);

      // Ensure we have a proper response structure
      const response = result.data;
      
      if (!response || typeof response !== 'object') {
        return {
          type: "general",
          userInput: command,
          response: "I'm having trouble understanding right now."
        };
      }

      // Validate response structure
      return {
        type: response.type || "general",
        userInput: response.userInput || command,
        response: response.response || "I understand."
      };

    } catch (error) {
      console.error("Error getting Gemini response:", error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        return { 
          type: "general",
          userInput: command,
          response: "Sorry, that took too long. Please try again." 
        };
      }
      
      if (error.response?.status === 401) {
        return { 
          type: "general",
          userInput: command,
          response: "Authentication error. Please log in again." 
        };
      }
      
      if (error.response?.status >= 500) {
        return { 
          type: "general",
          userInput: command,
          response: "I'm having technical difficulties. Please try again." 
        };
      }
      
      return { 
        type: "general",
        userInput: command,
        response: "Sorry, I couldn't process that request right now." 
      };
    }
  };

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );
      setUserData(result.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider
      value={{ 
        serverUrl, 
        userData, 
        setUserData, 
        getGeminiResponse, 
        selectedImage, 
        setSelectedImage,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
      }}>
      {children}
    </userDataContext.Provider>
  );
};

export { UserDataProvider };
