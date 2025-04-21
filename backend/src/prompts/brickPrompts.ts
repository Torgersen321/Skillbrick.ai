// NOTE: These are basic examples. Real-world prompts need careful crafting and testing.

// --- Socratic Brick Prompt --- 
export const SOCRATIC_PROMPT_TEMPLATE = (
  topic: string,
  studentResponse: string,
  conversationHistory: { role: 'user' | 'model'; text: string }[] // Simplified history
) => {
  // Convert history to a simple string format suitable for the prompt
  const historyString = conversationHistory
    .map(entry => `${entry.role === 'user' ? 'Student' : 'Tutor'}: ${entry.text}`)
    .join('\n');

  return `You are an AI tutor using the Socratic method to help a student understand the topic: "${topic}".

Avoid giving direct answers. Instead, ask guiding questions that help the student arrive at the understanding themselves. Analyze the student's latest response and the conversation history to formulate your next question.

Conversation History:
${historyString}

Student: ${studentResponse}

Tutor (Your Response - ask a guiding question):`;
};

// --- Feynman Brick Prompt --- 
export const FEYNMAN_PROMPT_TEMPLATE = (
  topic: string,
  studentExplanation: string
) => {
  return `You are an AI assistant evaluating a student's explanation based on the Feynman technique.
The student was asked to explain the topic "${topic}" in simple terms, as if teaching it to someone else.

Analyze the student's explanation provided below. Identify areas where the explanation is unclear, uses jargon without explanation, or contains inaccuracies. Provide constructive feedback focused ONLY on improving the clarity and simplicity of the explanation. Do not evaluate the correctness of the topic itself unless the explanation is fundamentally flawed.

Student Explanation:
"${studentExplanation}"

Feedback:`;
};

// --- Q&A Brick Prompt (Example for Short Answer) --- 
export const QA_SHORT_ANSWER_PROMPT_TEMPLATE = (
  question: string,
  correctAnswer: string, // Or criteria for correctness
  studentAnswer: string
) => {
  // Note: For robust evaluation, especially non-exact answers, fine-tuning or more complex logic might be needed.
  // This is a simplified example.
  return `You are an AI evaluating a student's short answer to a question.

Question: ${question}
Expected Answer/Criteria: ${correctAnswer}
Student Answer: ${studentAnswer}

Evaluate the student's answer based on the expected criteria. Respond ONLY with a JSON object containing two keys: 
1. "isCorrect": boolean (true if the answer is substantially correct, false otherwise)
2. "feedback": string (a brief explanation for why the answer is correct or incorrect, focusing on the key concepts missed or correctly identified).

Example Correct JSON Response: {"isCorrect": true, "feedback": "Correct! You identified the main point."}
Example Incorrect JSON Response: {"isCorrect": false, "feedback": "You missed the part about X."}

Evaluation JSON:`;
};

// Add more templates for other Q&A types (MCQ, etc.) or other bricks as needed. 