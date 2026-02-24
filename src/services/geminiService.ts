/**
 * AI/Gemini API Service - Handles all AI-related API calls
 * Follows Single Responsibility Principle (SRP) - only handles API communication
 * Follows Dependency Inversion Principle (DIP) - external config is injected
 */

interface GeminiServiceConfig {
  apiKey: string;
  apiEndpoint: string;
}

class GeminiService {
  private config: GeminiServiceConfig;

  constructor(config: GeminiServiceConfig) {
    this.config = config;
    if (!config.apiKey) {
      console.warn('Gemini API key is not configured. AI functionalities might be limited.');
    }
  }

  async generateContent(promptText: string, model: string = 'gemini-pro'): Promise<string | null> {
    if (!this.config.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const endpoint = `${this.config.apiEndpoint}/${model}:generateContent`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.config.apiKey,
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
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return 'No analysis available.';
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get a response from Gemini.');
    }
  }
}

// Initialize with config from environment
const geminiService = new GeminiService({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
});

export default geminiService;
