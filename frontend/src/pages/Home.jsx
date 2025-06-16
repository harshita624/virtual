import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif"
import userimg from "../assets/user.gif"  // Fixed: removed extra .gif extension
import { RiMenu3Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
const Home = () => {
  const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [lastCommand, setLastCommand] = useState("");
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham,setHam]=useState(false)
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      stopAllProcesses();
    };
  }, []);

  const handleLogOut = async () => {
    try {
      stopAllProcesses();

      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/signin'); 
    } catch (error) {
      console.error("Logout error.", error);
      setUserData(null);
      navigate('/signin'); 
    }
  };

  // Stop all ongoing processes gracefully
  const stopAllProcesses = useCallback(() => {
    // Stop speech
    if (synth.current) {
      synth.current.cancel();
    }
    isSpeakingRef.current = false;

    // Stop recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      isRecognizingRef.current = false;
    }
    setListening(false);
    setIsProcessing(false);

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Enhanced speak
  const speak = useCallback((text) => {
    if (!text) return;

    // Stop any ongoing first
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    // Select a Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((voice) =>
      voice.lang.startsWith("hi")
    );
    utterance.voice = hindiVoice ? hindiVoice : voices.find((voice) =>
      voice.lang.startsWith("en")
    );

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };
    utterance.onend = () => {
      isSpeakingRef.current = false;

      // Restart recognition after a small delay
      timeoutRef.current = setTimeout(restartRecognition, 500);
    };
    utterance.onerror = (error) => {
      console.error("Speech synthesis error.", error);
      isSpeakingRef.current = false;

      // Restart recognition after error
      timeoutRef.current = setTimeout(restartRecognition, 500);
    };

    synth.current.speak(utterance);
  }, []);

  // Handle command
  const handleCommand = useCallback((data) => {
    if (!data) return;

    const { type, userInput, response } = data;

    setLastCommand(userInput || "");
    setAiText(response);

    if (response) {
      speak(response);
    }

    try {
      // Perform side effects
      if (type === "google_search") {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
      } else if (type === "calculator_open") {
        window.open("https://www.google.com/search?q=calculator");

      } else if (type === "instagram_open") {
        window.open("https://www.instagram.com");

      } else if (type === "facebook_open") {
        window.open("https://www.facebook.com");

      } else if (type === "weather_show") {
        window.open("https://www.google.com/search?q=weather");

      } else if (type === "youtube_search" ||
                 type === "youtube_play") {
        if (userInput) {
          window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
        }
      } else if (type === "get_time") {
        const currentTime = new Date().toLocaleTimeString();
        speak(`The current time is ${currentTime}`);

      } else if (type === "get_date") {
        const currentDate = new Date().toLocaleDateString();
        speak(`Today's date is ${currentDate}`);

      } else if (type === "get_day") {
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        speak(`Today is ${currentDay}`);

      } else if (type === "get_month") {
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
        speak(`The current month is ${currentMonth}`);

      } 
    } catch (error) {
      console.error("Error executing command.", error);
      speak("Sorry, I encountered an error while processing your request.");
    }
  }, [speak]);

  // Restart recognition gracefully
  const restartRecognition = useCallback(() => {
    if (isSpeakingRef.current ||
        isRecognizingRef.current ||
        isProcessing) {
      return;
    }

    if (!recognitionRef.current) return;

    try {
      setError(null);
      recognitionRef.current.start();
      isRecognizingRef.current = true;
      setListening(true);
    } catch (error) {
      console.error("Error restarting recognition.", error);
      setError("Failed to restart voice recognition.");
      isRecognizingRef.current = false;
      setListening(false);
    }
  }, [isProcessing]);

  // Initialize recognition
  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition = window.SpeechRecognition ||
                                window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      setIsProcessing(false);

      // Auto-restart if not speaking or processing
      if (!isSpeakingRef.current && !isProcessing) {
        timeoutRef.current = setTimeout(restartRecognition, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error.", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      setIsProcessing(false);

      if (event.error === "not-allowed") {
        setError("Microphone access denied.");
      } else if (event.error === "network") {
        setError("Network error.");
      } else if (event.error === "aborted") {
        console.log("Recognition aborted.");
      } else if (event.error === "no-speech") {
        console.log("No speech.");
      } else {
        setError(`Recognition error: ${event.error}`);
      }

      // Auto-restart after a delay
      if (!isSpeakingRef.current &&
          event.error !== "not-allowed") {
        timeoutRef.current = setTimeout(restartRecognition, 2000);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Transcript.", transcript);

      const assistantName = userData.assistantName.toLowerCase();

      if (transcript.toLowerCase().includes(assistantName) &&
          getGeminiResponse) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        setIsProcessing(true);
        setAiText('');
        setUserText(transcript);

        try {
          const data = await getGeminiResponse(transcript);
          console.log("Gemini response.", data);
          handleCommand(data);
        } catch (error) {
          console.error("Error getting Gemini response.", error);
          setError("Failed to process your request.");
          speak("Sorry, I couldn't process your request.");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    // Cleanup
    return () => {
      stopAllProcesses();
      if (recognitionRef.current) {
        recognitionRef.current = null;
      }
    };
  }, [userData, getGeminiResponse, handleCommand, restartRecognition]);

  // Manual start/stop
  const toggleRecognition = useCallback(() => {
    if (listening) {
      stopAllProcesses();
    } else {
      restartRecognition();
    }
  }, [listening, restartRecognition, stopAllProcesses]);

  // Check if browser supports
  const browserSupported = typeof window !== "undefined" &&
    (window.SpeechRecognition ||
      window.webkitSpeechRecognition) &&
    window.speechSynthesis;

  if (!userData) {
    return (
      <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#0f0f77] flex justify-center items-center'>
        <div className='text-gray-50 text-xl'>Loading...</div>
      </div>
    );
  }


  return (
   <div
  className='w-full min-h-screen 
    bg-gray-900 
    bg-gradient-to-br from-[#0a001f] to-[#220033]
    text-gray-100 flex flex-col justify-center items-center gap-4 p-5
    relative overflow-hidden'
>
  {/* Glowing Orbs in Background */}
  <div aria-hidden='true'
    className='absolute w-[500px] h-[500px] 
               bg-[#8e66ff33] blur-[140px] rounded-full 
               top-[-100px] left-[-100px] z-0 
               animate-pulse'></div>

  <div aria-hidden='true'
    className='absolute w-[400px] h-[400px] 
               bg-[#00fff733] blur-[100px] rounded-full 
               bottom-[100px] right-[20px] z-0 
               animate-pulse delay-500'></div>
   
  {/* Top controls */}
  <RiMenu3Fill onClick={()=>setHam(true)}
  className='lg:hidden text-gray-50 absolute top-5 right-5 w-6 h-6 z-40 cursor-pointer hover:text-[#b099ff] transform hover:rotate-90 transition-all duration-500 ease-in-out'
  
/>
  <div className={`absolute top-0 left-0 w-full h-full z-50 
                   bg-black/60 backdrop-blur-md p-5 
                   flex flex-col items-end gap-4 
                   shadow-2xl shadow-[#c8a2ff] 
                   transform translate-x-0 
                   transition transform duration-500 ease-in-out ${ham?"translate-x-0":"translate-x-full"}`}>

    {/* Close icon */}
    <RxCross2
       onClick={()=>setHam(false)}
      className='text-gray-50 w-6 h-6 mb-4 mr-4 cursor-pointer hover:text-[#b099ff] transform hover:rotate-90 transition-all duration-500 ease-in-out'
    />

    {/* Action Buttons */}
    <button
      onClick={handleLogOut}
      className='px-5 py-3 rounded-full font-semibold 
                 text-[#b099ff] backdrop-blur-md 
                 border border-[#8e66ff]  
                 shadow-md shadow-[#c8a2ff] 
                 hover:bg-[#8e66ff] hover:text-gray-50 
                 transform hover:translate-y-[-5px] 
                 transition-all duration-500 ease-in-out'
    >
      Log Out
    </button>

    <button
      onClick={() => navigate('/customize')}
      className='px-5 py-3 rounded-full font-semibold 
                 text-[#b099ff] backdrop-blur-md 
                 border border-[#8e66ff] 
                 shadow-md shadow-[#c8a2ff] 
                 hover:bg-[#8e66ff] hover:text-gray-50 
                 transform hover:translate-y-[-5px] 
                 transition-all duration-500 ease-in-out'
    >
      Customize Your Assistant
    </button>
    <div className='w-full h-[2px] bg-gray-400'></div>
    <h1 className='text-white font-semibold text-[19px]'>History</h1>
    <div className='w-full h-[60%] overflow-auto flex flex-col gap-[20px]'>
    {userData.history && userData.history.length > 0 ? (
  userData.history.map((his, index) => (
    <span key={index} className='block px-2 py-1 rounded-md bg-gray-800/50 mb-2'>
      {his}
    </span>
  ))
) : (
  <p className='text-gray-500 mt-2'>No history available</p>
)}

    </div>
  </div>


  <button
    onClick={handleLogOut}
    className='absolute top-5 right-5 px-5 py-3 rounded-full font-semibold 
               text-[#b099ff] backdrop-blur-md 
               border border-[#8e66ff]  hidden lg:block
               shadow-md shadow-[#c8a2ff] 
               hover:bg-[#8e66ff] hover:text-gray-50 
               transform hover:translate-y-[-5px] 
               transition-all duration-500 ease-in-out'
  >
    Log Out
  </button>

  <button
    onClick={() => navigate('/customize')}
    className='absolute top-20 right-5 px-5 py-3 rounded-full font-semibold 
               text-[#b099ff] backdrop-blur-md 
               border border-[#8e66ff] hidden lg:block
               shadow-md shadow-[#c8a2ff] 
               hover:bg-[#8e66ff] hover:text-gray-50 
               transform hover:translate-y-[-5px] 
               transition-all duration-500 ease-in-out'
  >
    Customize Your Assistant
  </button>

  {/* Error messages */}
  {error && (
    <div className='absolute top-5 left-5 px-4 py-2 rounded-md 
                     bg-red-500/80 backdrop-blur-md shadow-md 
                     border border-red-400/50 text-gray-50 max-w-sm z-50 transform translate-y-[-5px] transition transform duration-500 ease-in-out'>
      <p className='text-sm'>{error}</p>
      <button 
        onClick={() => setError(null)} 
        className='text-gray-100 underline mt-1 text-xs'
      >
        Dismiss
      </button>
    </div>
  )}

  {/* Browser support warning*/}
  {!browserSupported && (
    <div className='bg-yellow-500/80 backdrop-blur-md px-4 py-2 rounded-md mb-4 shadow-md border border-yellow-400/50 transform translate-y-[-5px] transition transform duration-500 ease-in-out'>
      <p className='text-black text-sm font-semibold'>
        Your browser doesn't support speech recognition or synthesis.
      </p>
    </div>
  )}

{/* Listening button */}
<button
  disabled={!browserSupported || isProcessing}
  onClick={toggleRecognition}
  className={`px-6 py-2 rounded-full font-semibold text-md 
              transform 
              shadow-[0_0_30px_#c8a2ff] 
              border border-[#8e66ff] 
              backdrop-blur-md 
              transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-wait 
              ${
                listening
                    ? 'bg-[#8e66ff] text-gray-50 hover:bg-[#b099ff]'
                    : isProcessing
                    ? 'bg-gray-500 text-gray-900'
                    : 'bg-[#220033] text-[#b099ff] hover:bg-[#8e66ff] hover:text-gray-50'
              }`}
>
  {isProcessing ? "Processing…" : listening ? "Stop Listening" : "Start Listening"}
</button>


  {/* Assistant Card */}
  <div
    className='w-72 h-96 overflow-hidden rounded-3xl shadow-2xl 
               shadow-cyan-500/20 border border-cyan-500/30 
               backdrop-blur-md p-5 transform hover:scale-105 
               transition transform duration-500 ease-in-out 
               group relative'
  >
    {userData?.assistantImage ? (
      <img 
        src={userData.assistantImage} 
        alt='assistant' 
        className='h-full w-full object-cover rounded-3xl'
        onError={(e) => (e.target.src = '/default-assistant.png')}
      />
    ) : (
      <div className='h-full w-full 
                       bg-gradient-to-br from-cyan-500 to-blue-500 
                       flex items-center justify-center 
                       rounded-3xl shadow-inner'>
        <span className='text-gray-50 text-6xl group-hover:animate-pulse'>🤖</span>
      </div>
    )}

    {/* Animated AI Sound Wave */}
    <div aria-hidden='true' className='absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 z-20'>
      {/* Outer circle pulse */}
      <span className='absolute rounded-full border-4 border-cyan-500/50 w-32 h-32 animate-ping'></span>
      {/* Inner circle pulse */}
      <span className='absolute rounded-full border-4 border-cyan-500/50 w-20 h-20 animate-ping delay-500'></span>
      {/* Core circle */}
      <span className='absolute rounded-full bg-cyan-500 w-12 h-12 shadow-[0_0_30px_#0ff]'></span>
    </div>
  </div>

  {/* Animated AI Sound Wave */}
<div aria-hidden='true' className='absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 z-20'>
  {/* Outer circle pulse */}
  <span className='absolute rounded-full border-4 border-cyan-500/50 w-32 h-32 animate-ping'></span>
  {/* Inner circle pulse */}
  <span className='absolute rounded-full border-4 border-cyan-500/50 w-20 h-20 animate-ping delay-500'></span>
  {/* Core circle */}
  <span className='absolute rounded-full bg-cyan-500 w-12 h-12 shadow-[0_0_30px_#0ff]'></span>
</div>

{/* GIF Display with Name Below */}
<div className='flex flex-col items-center gap-2 mt-4 px-5 py-3 rounded-3xl backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform hover:shadow-[0_0_50px_#c8a2ff] hover:translate-y-[-5px] transition transform duration-500 ease-in-out group'>

  {/* GIF Display */}
  <div 
    className='rounded-full p-2 border-4 border-cyan-500/50 shadow-[0_0_30px_#c8a2ff] transform hover:rotate-12 hover:shadow-[0_0_50px_#c8a2ff] transition transform duration-500 ease-in-out group-hover:animate-pulse relative'
  >
    {aiText ? (
      <img src={ai} alt='ai speaking' className='w-20 h-20 rounded-full' />
    ) : (
      <img src={userimg} alt='user' className='w-20 h-20 rounded-full' />
    )}

    {/* Magic aura */}
    <span aria-hidden='true' className='absolute rounded-full border-4 border-cyan-500/50 w-20 h-20 animate-ping'></span>
  </div>

  {/* Assistant Name */}
  <h1 className='text-gray-50 text-2xl font-semibold drop-shadow-md'>{userData?.assistantName ?? "Your Assistant"}</h1>

</div>

{/* User or AI Text Display */}
<h1 className='text-gray-50 text-[18px] font-semibold text-wrap mt-4 px-5'>{userText ? userText : aiText ? aiText : ''}</h1>

</div>

  );
};

export default Home;
