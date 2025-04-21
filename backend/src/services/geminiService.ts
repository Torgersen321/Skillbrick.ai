import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content, Part } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file
// Adjust path as necessary if the script runs from a different CWD
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MODEL_NAME = "gemini-1.5-pro-latest"; // Or your desired model
const API_KEY = process.env.GEMINI_API_KEY;
const MAX_CONTEXT_TOKENS = 10000; // Example token limit for history

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY not found in environment variables. Please add it to the root .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// --- Caching (In-Memory Example) ---
interface CacheEntry {
    response: string;
    timestamp: number;
}
const responseCache: { [promptKey: string]: CacheEntry } = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // Cache for 5 minutes

const getCachedResponse = (promptKey: string): string | null => {
    const entry = responseCache[promptKey];
    if (entry && (Date.now() - entry.timestamp < CACHE_TTL_MS)) {
        console.log(`Cache hit for key: ${promptKey}`);
        return entry.response;
    }
    if (entry) delete responseCache[promptKey]; // Remove expired entry
    return null;
};

const cacheResponse = (promptKey: string, response: string) => {
    responseCache[promptKey] = { response, timestamp: Date.now() };
    // Optional: Add cache size limit logic here
};
// --- End Caching ---

// --- Basic Context Management (In-Memory Example) ---
// NOTE: This is a simple in-memory store. For production, use a persistent store (Redis, DB).
interface ConversationHistory {
  [conversationId: string]: Content[];
}
const conversationHistories: ConversationHistory = {};

// Function to add to history and prune if necessary (basic pruning: remove oldest)
// A more sophisticated approach would estimate token count and summarize.
const manageHistory = (conversationId: string, userPrompt: string, modelResponse: string) => {
  if (!conversationHistories[conversationId]) {
    conversationHistories[conversationId] = [];
  }
  const history = conversationHistories[conversationId];

  history.push({ role: "user", parts: [{ text: userPrompt }] });
  history.push({ role: "model", parts: [{ text: modelResponse }] });

  // Basic pruning: Keep last N turns (e.g., last 10 turns = 20 entries)
  const maxHistoryEntries = 20; 
  if (history.length > maxHistoryEntries) {
     conversationHistories[conversationId] = history.slice(history.length - maxHistoryEntries);
  }
  // TODO: Implement token-based pruning instead of simple length limit
};

const getHistory = (conversationId: string): Content[] => {
    return conversationHistories[conversationId] || [];
}
// --- End Context Management ---

// Basic configuration for generation
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Basic safety settings (adjust as needed)
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Enhanced function with Caching and Retry
async function generateGeminiResponse(prompt: string, conversationId?: string, retries = 2) {
  const cacheKey = conversationId ? `${conversationId}:${prompt.substring(0, 50)}...` : prompt.substring(0, 50); // Shortened key for logging
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  console.log(`[GeminiService] Cache miss for key: ${cacheKey}. Calling API...`);
  const startTime = Date.now();
  try {
    const history = conversationId ? getHistory(conversationId) : [];
    const chat = model.startChat({ generationConfig, safetySettings, history });
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    // TODO: Add token count logging here if needed using model.countTokens()
    const responseText = response.text();
    const duration = Date.now() - startTime;
    console.log(`[GeminiService] API call successful for key: ${cacheKey}. Duration: ${duration}ms`);

    if (conversationId) {
        manageHistory(conversationId, prompt, responseText);
    }
    cacheResponse(cacheKey, responseText); // Cache successful response
    return responseText;

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[GeminiService] Error calling Gemini API (attempt ${3 - retries}/3) for key: ${cacheKey}. Duration: ${duration}ms`, { error: error.message, stack: error.stack });
    // Check for specific retryable errors if possible (e.g., rate limit, temporary server error)
    if (retries > 0) {
        const delay = Math.pow(2, 3 - retries) * 500; 
        console.log(`[GeminiService] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateGeminiResponse(prompt, conversationId, retries - 1);
    } else {
        console.error(`[GeminiService] API call failed after multiple retries for key: ${cacheKey}.`);
        // Consider sending this final failure to a dedicated monitoring service
        throw new Error(`AI service request failed: ${error.message || 'Unknown error'}`);
    }
  }
}

// Export necessary functions or the initialized model
export {
  generateGeminiResponse,
  model,
  getHistory, // Export if needed elsewhere
  manageHistory // Export if manual management is needed
}; 