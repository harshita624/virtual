import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(400).json({ message: "Error in current user" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(400).json({ message: "Update assistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    console.log("Received command!", req.body.command);
    console.log("UserId from auth!", req.userId);
    
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ 
        type: "general",
        userInput: "",
        response: "I didn't hear anything. Could you try again?" 
      });
    }

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        type: "general",
        userInput: command,
        response: "User not found" 
      });
    }
    user.history.push(command)
    user.save()

    const userName = user.name;
    const assistantName = user.assistantName || "Assistant";

    console.log("Calling Gemini with:", { command, assistantName, userName });

    // Call Gemini API
    let result = await geminiResponse(command, assistantName, userName);
    
    console.log("Gemini result:", result);

    // Handle time and date requests manually if Gemini doesn't provide them
    if (result.type === "get_time") {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      result.response = `It's ${currentTime}`;
    } else if (result.type === "get_date") {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      result.response = `Today is ${currentDate}`;
    }

    // Ensure result is properly formatted
    const finalResponse = {
      type: result.type || "general",
      userInput: result.userInput || command,
      response: result.response || "I understand your request."
    };

    console.log("Final response:", finalResponse);
    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({ 
      type: "general",
      userInput: req.body.command || "",
      response: "I'm having technical difficulties right now. Please try again." 
    });
  }
};