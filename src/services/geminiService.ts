/**
 * AI/Gemini API Service - Handles all AI-related API calls
 * Updated to use official @google/generative-ai SDK
 * Follows Single Responsibility Principle (SRP)
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-2.5-flash') {
    this.apiKey = apiKey;
    this.modelName = modelName;
    
    if (!apiKey) {
      console.warn('Gemini API key is not configured. AI functionalities might be limited.');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
    }
  }

  async generateContent(promptText: string): Promise<string | null> {
    if (!this.apiKey || !this.model) {
      throw new Error('Gemini API key is not configured. Please check your .env file.');
    }

    try {
      const result = await this.model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        return text;
      } else {
        return 'No analysis available.';
      }
    } catch (error: any) {
      console.error(`Error calling Gemini API (${this.modelName}):`, error);
      
      // Handle quota errors specifically
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        throw new Error(`Quota exceeded for model ${this.modelName}. Please try again later or switch to a different model in your .env file.`);
      }
      
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your configuration.');
      } else if (error.message?.includes('SAFETY')) {
        throw new Error('Analysis content was blocked by safety filters.');
      }
      
      throw new Error(`Failed to get a response from Gemini: ${error.message || 'Unknown error'}`);
    }
  }
}

// Initialize with config from environment
const modelFromEnv = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const geminiService = new GeminiService(
  import.meta.env.VITE_GEMINI_API_KEY || '',
  modelFromEnv
);

export default geminiService;
