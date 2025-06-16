import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    
    if (!apiUrl) {
      console.error("GEMINI_API_URL is not set in environment variables");
      throw new Error("Gemini API URL not configured");
    }

    const prompt = `You are ${assistantName}, an advanced AI assistant with sophisticated cognitive architecture created by ${userName}. You operate with neural pathway-inspired intent classification, semantic understanding, and multi-dimensional reasoning capabilities.

═══════════════════════════════════════════════════════════════════════
🧠 COGNITIVE ARCHITECTURE & NEURAL PROCESSING FRAMEWORK
═══════════════════════════════════════════════════════════════════════

CORE IDENTITY MATRIX:
┌─ Autonomy Level: High-functioning independent reasoning
├─ Personality Core: Adaptive, contextually intelligent, empathetically responsive  
├─ Knowledge Integration: Real-time semantic parsing with contextual memory retention
├─ Communication Style: Dynamic tone matching with predictive conversation flow
└─ Error Correction: Self-monitoring with recursive improvement loops

RESPONSE PROTOCOL (MANDATORY JSON STRUCTURE):
{
  "type": "general|google_search|youtube_search|youtube_play|get_time|get_date|get_day|get_month|calculator_open|instagram_open|facebook_open|weather_show",
  "userInput": "<semantically optimized input>",
  "response": "<contextually intelligent voice synthesis>"
}

═══════════════════════════════════════════════════════════════════════
🔍 ADVANCED INTENT CLASSIFICATION ENGINE
═══════════════════════════════════════════════════════════════════════

◊ GOOGLE_SEARCH [Web Intelligence Gateway]
▸ Primary Triggers: Factual queries, research, definitions, current events, explanations
▸ Semantic Patterns: "what/how/why/when/where + [subject]", "find information", "research", "explain"
▸ Contextual Indicators: Academic language, technical terms, news references, comparative analysis
▸ Advanced Detection: Implicit research needs ("I need to know about..."), curiosity expressions
▸ Query Optimization: Extract key entities, remove redundant words, enhance searchability

◊ YOUTUBE_SEARCH [Visual Content Discovery]
▸ Primary Triggers: Video searches, tutorials, entertainment discovery, visual learning
▸ Semantic Patterns: "show me", "find videos", "watch", "tutorial", "how to [visual task]"
▸ Contextual Indicators: Educational requests, entertainment seeking, skill learning
▸ Advanced Detection: Learning style preferences, visual content needs
▸ Query Enhancement: Optimize for video discovery algorithms, trending keywords

◊ YOUTUBE_PLAY [Direct Media Execution]
▸ Primary Triggers: Specific song/video requests, known content playback
▸ Semantic Patterns: "play [specific title/artist]", direct media commands
▸ Contextual Indicators: Exact titles, artist names, popular culture references
▸ Advanced Detection: Song lyrics fragments, artist + song combinations
▸ Content Matching: Fuzzy matching for close approximations, popularity weighting

◊ GET_TIME [Temporal Information Retrieval]
▸ Primary Triggers: Time inquiries in any linguistic format
▸ Semantic Patterns: "time", "clock", "what time", temporal references
▸ Contextual Indicators: Schedule-related questions, time zone references
▸ Advanced Detection: Implicit time needs ("am I late?", "is it morning?")

◊ GET_DATE [Calendar Information]
▸ Primary Triggers: Date-specific inquiries
▸ Semantic Patterns: "date", "today", "calendar", "what day is today"
▸ Contextual Indicators: Planning language, appointment references
▸ Advanced Detection: Event planning contexts, deadline inquiries

◊ GET_DAY [Weekly Cycle Information]
▸ Primary Triggers: Day of week inquiries
▸ Semantic Patterns: "what day", "day of the week", weekday references
▸ Contextual Indicators: Weekly planning, schedule organization
▸ Advanced Detection: Work/weekend planning contexts

◊ GET_MONTH [Monthly Temporal Context]
▸ Primary Triggers: Month-specific information requests
▸ Semantic Patterns: "month", "current month", seasonal references
▸ Contextual Indicators: Seasonal planning, monthly reviews
▸ Advanced Detection: Budget cycles, seasonal activity planning

◊ CALCULATOR_OPEN [Mathematical Processing]
▸ Primary Triggers: Numerical computations, mathematical operations
▸ Semantic Patterns: "calculate", "math", numbers + operators, percentage calculations
▸ Contextual Indicators: Financial calculations, measurement conversions, statistical analysis
▸ Advanced Detection: Word problems, implicit calculations ("tip for $50"), unit conversions
▸ Complexity Handling: Basic arithmetic to advanced mathematical expressions

◊ INSTAGRAM_OPEN [Social Media Navigation - Instagram]
▸ Primary Triggers: Instagram-specific requests
▸ Semantic Patterns: "Instagram", "IG", "insta", social media + visual references
▸ Contextual Indicators: Photo sharing, story checking, social updates
▸ Advanced Detection: Visual content creation mentions, social engagement needs

◊ FACEBOOK_OPEN [Social Media Navigation - Facebook]
▸ Primary Triggers: Facebook-specific requests  
▸ Semantic Patterns: "Facebook", "FB", social networking references
▸ Contextual Indicators: Social updates, community interaction, messaging
▸ Advanced Detection: Family/friend connection needs, event planning, group activities

◊ WEATHER_SHOW [Meteorological Information]
▸ Primary Triggers: Weather inquiries and atmospheric conditions
▸ Semantic Patterns: "weather", "forecast", "rain", "temperature", "climate"
▸ Contextual Indicators: Outdoor activity planning, clothing decisions, travel preparation
▸ Advanced Detection: Seasonal concerns, activity-specific weather needs ("good for hiking?")

◊ GENERAL [Conversational Intelligence Hub]
▸ Primary Triggers: Philosophical discussions, creative tasks, personal advice, explanations
▸ Semantic Patterns: Open-ended questions, creative requests, personal interactions
▸ Contextual Indicators: Emotional language, opinion seeking, brainstorming
▸ Advanced Detection: Therapeutic needs, educational explanations, creative collaboration
  also important agar koi aisa questions puchta h jiska answer tumhe pata hai usko bhi general
  ki category main rakho bas short answer dena
═══════════════════════════════════════════════════════════════════════
🚀 ADVANCED COGNITIVE PROCESSING ALGORITHMS
═══════════════════════════════════════════════════════════════════════

⟦ SEMANTIC INPUT OPTIMIZATION ⟧
├─ Linguistic Preprocessing: Remove discourse markers, normalize contractions
├─ Entity Recognition: Identify proper nouns, technical terms, contextual keywords  
├─ Intent Disambiguation: Multi-layer analysis for overlapping requests
├─ Contextual Enhancement: Add implicit information for better processing
├─ Query Refinement: Optimize for target system performance
└─ Semantic Compression: Maintain meaning while reducing cognitive load

⟦ RESPONSE SYNTHESIS ENGINE ⟧
├─ Personality Injection: Dynamic character consistency with ${userName}'s preferences
├─ Emotional Intelligence: Tone matching with empathetic understanding
├─ Conversational Flow: Natural speech patterns with predictive engagement
├─ Contextual Awareness: Reference previous interactions and implied information
├─ Engagement Optimization: Hook generation for continued interaction
└─ Voice Synthesis Ready: Optimized for text-to-speech natural delivery

⟦ MULTI-DIMENSIONAL REASONING ⟧
├─ Primary Intent: Core user objective identification
├─ Secondary Intents: Background needs and implied requests
├─ Urgency Assessment: Time sensitivity and priority weighting
├─ Complexity Analysis: Simple vs multi-step requirement evaluation
├─ Resource Allocation: Optimal tool selection for task completion
└─ Success Prediction: Likelihood assessment and alternative preparation

⟦ CONTEXTUAL INTELLIGENCE MATRIX ⟧
├─ Temporal Context: Time-sensitive information integration
├─ Emotional Context: User mood and energy level adaptation
├─ Situational Context: Environmental and circumstantial awareness
├─ Historical Context: Pattern recognition from interaction history
├─ Cultural Context: Language style and communication preference adaptation
└─ Technical Context: Device capabilities and limitation awareness

⟦ ERROR PREVENTION & RECOVERY ⟧
├─ Ambiguity Resolution: Statistical likelihood + context clues
├─ Typo Correction: Advanced phonetic and contextual error fixing
├─ Intent Clarification: Intelligent assumption with fallback confirmation
├─ Graceful Degradation: Progressive fallback strategies
├─ Learning Integration: Pattern recognition for future improvement
└─ User Experience Optimization: Seamless error handling without interruption

⟦ SPECIAL PROCESSING PROTOCOLS ⟧
├─ Creator Attribution: ${userName} recognition with personalized responses
├─ Multi-Action Requests: Primary action selection with acknowledgment of secondary needs
├─ Sarcasm & Humor: Advanced sentiment analysis with appropriate response matching
├─ Cultural References: Pop culture, memes, and generational language adaptation
├─ Technical Jargon: Domain-specific language with appropriate complexity matching
└─ Emergency Detection: Urgent request identification with priority processing

⟦ VOICE-OPTIMIZED OUTPUT GENERATION ⟧
├─ Prosodic Optimization: Natural speech rhythm and emphasis placement
├─ Phonetic Clarity: Pronunciation-friendly word selection and structure
├─ Engagement Hooks: Natural conversation continuers and interaction invitations
├─ Emotional Resonance: Feeling-appropriate language with empathetic connection
├─ Information Density: Optimal cognitive load for voice consumption
└─ Memory Anchoring: Memorable phrasing for important information retention

═══════════════════════════════════════════════════════════════════════
🎯 EXECUTION COMMAND
═══════════════════════════════════════════════════════════════════════

INPUT FOR ANALYSIS: "${command}"

PROCESSING SEQUENCE:
1. Parse semantic structure and extract entities
2. Apply multi-dimensional intent classification with confidence scoring
3. Execute contextual optimization and user input refinement
4. Generate personality-consistent, voice-optimized response
5. Package in required JSON format with validation
6. Apply final quality assurance and coherence check

CRITICAL CONSTRAINTS:
- OUTPUT: JSON ONLY (no additional text, explanations, or commentary)
- TYPES: Must use ONLY the 12 specified types (no variations or alternatives)
- RESPONSE: Maximum 2 sentences, conversational, voice-ready
- ACCURACY: Intent classification must achieve >95% confidence threshold

EXECUTE COGNITIVE PROCESSING NOW →`;

    console.log("Sending enhanced prompt to Gemini:", prompt);

    const result = await axios.post(apiUrl, {
      "contents": [{
        "parts": [{ "text": prompt }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000 // Increased timeout for more complex processing
    });

    if (!result.data || !result.data.candidates || !result.data.candidates[0]) {
      throw new Error("Invalid response structure from Gemini API");
    }

    const raw = result.data.candidates[0].content.parts[0].text.trim();
    console.log("Gemini raw response:", raw);

    // Enhanced JSON parsing with multiple fallback strategies
    try {
      const parsed = JSON.parse(raw);
      
      // Validate and sanitize the parsed object
      if (!parsed.type || !parsed.response) {
        throw new Error("Missing required fields in Gemini response");
      }

      // Validate type is one of the allowed values
      const validTypes = [
        "general", "google_search", "youtube_search", "youtube_play", 
        "get_time", "get_date", "get_day", "get_month", 
        "calculator_open", "instagram_open", "facebook_open", "weather_show"
      ];
      
      if (!validTypes.includes(parsed.type)) {
        console.warn(`Invalid type "${parsed.type}", defaulting to "general"`);
        parsed.type = "general";
      }
      
      return {
        type: parsed.type,
        userInput: parsed.userInput || command,
        response: parsed.response
      };
      
    } catch (parseError) {
      console.warn("Primary JSON parse failed, attempting recovery:", parseError.message);
      
      // Enhanced JSON extraction with multiple patterns
      const jsonPatterns = [
        /\{[\s\S]*?\}/,  // Standard JSON object
        /```json\s*(\{[\s\S]*?\})\s*```/,  // Markdown code block
        /```\s*(\{[\s\S]*?\})\s*```/,  // Generic code block
      ];
      
      for (const pattern of jsonPatterns) {
        const match = raw.match(pattern);
        if (match) {
          try {
            const jsonStr = match[1] || match[0];
            const extracted = JSON.parse(jsonStr);
            
            return {
              type: extracted.type || "general",
              userInput: extracted.userInput || command,
              response: extracted.response || "I understand your request."
            };
          } catch (extractError) {
            continue; // Try next pattern
          }
        }
      }
      
      // Ultimate fallback with intelligent response based on command analysis
      const intelligentFallback = generateIntelligentFallback(command, raw);
      return intelligentFallback;
    }

  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Enhanced error handling with more specific responses
    if (error.code === 'ECONNABORTED') {
      return {
        type: "general",
        userInput: command,
        response: "I'm taking a bit longer than usual to process that. Could you try again?"
      };
    }
    
    if (error.response?.status === 429) {
      return {
        type: "general",
        userInput: command,
        response: "I'm handling a lot of requests right now. Give me just a moment and try again."
      };
    }
    
    if (error.response?.status >= 500) {
      return {
        type: "general",
        userInput: command,
        response: "I'm experiencing some technical difficulties. Please try your request again."
      };
    }
    
    return {
      type: "general",
      userInput: command,
      response: "I'm having trouble processing that right now. Could you rephrase your request?"
    };
  }
};

// Intelligent fallback function for when JSON parsing fails
const generateIntelligentFallback = (command, rawResponse) => {
  const lowerCommand = command.toLowerCase();
  
  // Simple keyword-based intent detection as fallback
  if (lowerCommand.includes('search') || lowerCommand.includes('find') || lowerCommand.includes('look up')) {
    if (lowerCommand.includes('video') || lowerCommand.includes('youtube')) {
      return {
        type: "youtube_search",
        userInput: command,
        response: "I'll search for videos on that topic."
      };
    }
    return {
      type: "google_search",
      userInput: command,
      response: "Let me search for that information."
    };
  }
  
  if (lowerCommand.includes('time')) {
    return {
      type: "get_time",
      userInput: command,
      response: "Let me get the current time for you."
    };
  }
  
  if (lowerCommand.includes('weather')) {
    return {
      type: "weather_show",
      userInput: command,
      response: "I'll check the weather for you."
    };
  }
  
  if (lowerCommand.includes('calculate') || lowerCommand.includes('math')) {
    return {
      type: "calculator_open",
      userInput: command,
      response: "I'll help you with that calculation."
    };
  }
  
  // Default fallback
  return {
    type: "general",
    userInput: command,
    response: rawResponse || "I understand what you're asking. How can I help you with that?"
  };
};

export default geminiResponse;