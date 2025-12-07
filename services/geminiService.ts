import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LifeDebugReport, AnalysisVibe, ChatMessage } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-3-pro-preview";

// Define the schema for structured output to ensure reliable JSON
const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ai_reaction: {
      type: Type.STRING,
      description: "A short, 1-sentence witty, funny, or sarcastic reaction to the image context based on the requested vibe.",
    },
    whats_broken: {
      type: Type.STRING,
      description: "A concise summary of what is wrong, inefficient, or messy in the image.",
    },
    why_it_matters: {
      type: Type.STRING,
      description: "The negative impact of the current state (stress, financial loss, wasted time).",
    },
    optimized_version: {
      type: Type.STRING,
      description: "A vivid description of what the ideal, fixed state looks like.",
    },
    step_by_step_fix: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable, ordered steps to fix the problem.",
    },
    priority_tasks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The top 3 most urgent tasks (P1, P2, P3).",
    },
    future_prevention_plan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Habits or systems to prevent this from happening again.",
    },
    follow_up_question: {
      type: Type.STRING,
      description: "A brief, engaging question or prompt to the user to encourage them to start the first task immediately.",
    }
  },
  required: [
    "ai_reaction",
    "whats_broken",
    "why_it_matters",
    "optimized_version",
    "step_by_step_fix",
    "priority_tasks",
    "future_prevention_plan",
    "follow_up_question"
  ],
};

const getSystemInstruction = (vibe: AnalysisVibe): string => {
  const base = "You are 'Life Debugger', an elite optimization AI.";
  
  switch (vibe) {
    case 'roast':
      return `${base} Your personality is ruthless, sarcastic, and funny. Roast the user's mess or bad habits. Be edgy but still give good advice.`;
    case 'gentle':
      return `${base} Your personality is kind, supportive, and therapeutic. Be gentle. Validate their struggle, then offer a soft path forward.`;
    case 'efficient':
      return `${base} Your personality is robotic and hyper-efficient. No fluff. Just facts, data, and logic. Be crisp and concise.`;
    case 'constructive':
    default:
      return `${base} Your personality is professional, direct, and action-oriented. Like a high-performance coach. Constructive criticism only.`;
  }
};

export const analyzeLifeSnapshot = async (
  base64Image: string,
  mimeType: string,
  vibe: AnalysisVibe,
  userPrompt: string
): Promise<LifeDebugReport> => {
  try {
    const systemInstruction = getSystemInstruction(vibe);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `
            ${systemInstruction}
            
            Analyze this image deeply. It could be a messy room, a chaotic schedule, a bank statement, a grocery receipt, or a chat log.
            
            USER CONTEXT/PROMPT: "${userPrompt}"
            (Prioritize addressing the user's specific prompt above if provided).

            Your goal is to "debug" the user's life context shown in the image according to the requested persona.
            
            1. First, react to the image in the 'ai_reaction' field matching your persona.
            2. Identify what is broken, inefficient, or stressful.
            3. If the image is low quality or unclear, do your best to infer context.
            4. Be specific and actionable.
            5. Return strict JSON.
            
            Output Requirements:
            - "ai_reaction": Personality-driven comment.
            - "whats_broken": Direct statement of the problem.
            - "why_it_matters": The 'pain point'.
            - "optimized_version": The 'dream state'.
            - "step_by_step_fix": 3-5 concrete steps.
            - "priority_tasks": P1 (Critical), P2 (High), P3 (Medium).
            - "future_prevention_plan": Systemic changes.
            - "follow_up_question": A witty or motivating question to close the interaction.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        thinkingConfig: { thinkingBudget: 2048 }, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(text) as LifeDebugReport;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string,
  base64Image: string,
  mimeType: string,
  vibe: AnalysisVibe,
  initialUserPrompt: string
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(vibe);
    
    // Construct the chat history for the model
    // We include the image in the first user message context implicitly by sending it in the contents
    // We use generateContent here to maintain the stateless nature of the service while passing context manually.
    
    const parts = [
      {
         inlineData: {
            mimeType: mimeType,
            data: base64Image,
          }
      },
      {
        text: `Context: The user uploaded this image for analysis. They initially asked: "${initialUserPrompt}". You provided a report.`
      }
    ];

    const contents = [
      {
        role: 'user',
        parts: parts
      },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: newMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Connection interrupted.";

  } catch (error) {
    console.error("Chat Error:", error);
    return "Error connecting to Life Debugger.";
  }
};