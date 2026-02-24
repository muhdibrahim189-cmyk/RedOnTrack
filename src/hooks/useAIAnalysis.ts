/**
 * Hook for AI analysis operations
 * Single Responsibility - handles AI analysis state and operations
 */

import { useState, useCallback } from 'react';
import { FootageFolder } from '../domain';
import { accidentService } from '../services';

interface UseAIAnalysisReturn {
  analyzing: boolean;
  aiResult: string | null;
  performAnalysis: (folder: FootageFolder) => Promise<void>;
  clearResult: () => void;
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const performAnalysis = useCallback(async (folder: FootageFolder) => {
    setAnalyzing(true);
    try {
      const result = await accidentService.analyzeAccidentFootage(folder);
      setAiResult(result);
    } catch (error) {
      setAiResult(
        `SYSTEM ERROR: AI engine failed to connect. Details: ${(error as Error).message}`
      );
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setAiResult(null);
  }, []);

  return {
    analyzing,
    aiResult,
    performAnalysis,
    clearResult,
  };
}
