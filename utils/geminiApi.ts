// utils/geminiApi.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Using Vite's environment variable convention
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models`;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set. AI functionalities might be limited.");
}

export async function generateGeminiContent(promptText: string, model: string = 'gemini-pro'): Promise<string | null> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const endpoint = `${API_ENDPOINT}/${model}:generateContent`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY, // API Key in header
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Gemini API Error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Gemini API Error: ${errorData.error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "No analysis available.";
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error("Failed to get a response from Gemini.");
  }
}

// You can add other Gemini API functions here if needed, e.g., for embeddings.
