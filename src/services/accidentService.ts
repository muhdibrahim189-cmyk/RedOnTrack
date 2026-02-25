/**
 * Accident/Incident Service - Handles accident-related business logic
 * Follows Single Responsibility Principle (SRP)
 * Separated from UI components and data persistence
 */

import { FootageFolder, AccidentStat } from '../domain';
import geminiService from './geminiService';

class AccidentService {
  /**
   * Perform AI analysis on a footage folder
   */
  async analyzeAccidentFootage(folder: FootageFolder): Promise<string> {
    const prompt = `Act as a forensic railway safety investigator. Perform a detailed safety analysis for the following incident:

Incident Metadata:
- Platform: ${folder.platform}
- Time of Incident: ${folder.time} (${folder.day}, ${folder.date})
- Initial Personnel Remarks: "${folder.remarks}"
- Available Camera Angles: ${folder.cameras.join(', ')}

Please provide:
1. ANOMALY DETECTION: Identify potential technical or human factors based on the metadata.
2. RISK ASSESSMENT: Evaluate the severity and impact on station operations.
3. PREVENTATIVE MEASURES: Suggest 3-5 specific, actionable technical or procedural improvements to prevent recurrence.
4. FORENSIC SUMMARY: A concise professional summary for the official station log.

Keep the tone professional, analytical, and concise.`;

    try {
      const result = await geminiService.generateContent(prompt);
      return result || 'No analysis available.';
    } catch (error) {
      throw new Error(`Analysis failed: ${(error as Error).message}`);
    }
  }

  /**
   * Update remarks for a footage folder
   */
  updateFolderRemarks(folder: FootageFolder, newRemarks: string): FootageFolder {
    return {
      ...folder,
      remarks: newRemarks,
    };
  }

  /**
   * Toggle save status for a folder
   */
  toggleFolderSaveStatus(folder: FootageFolder): FootageFolder {
    return {
      ...folder,
      saved: !folder.saved,
    };
  }

  /**
   * Filter folders by time dimension (hours)
   */
  filterFoldersByTimeSlot(
    folder: FootageFolder,
    selectedSlot: string | null
  ): boolean {
    if (!selectedSlot) return true;

    const hour = parseInt(folder.time.split(':')[0], 10);

    const timeRanges: Record<string, [number, number][]> = {
      '06-12': [[6, 12]],
      '12-18': [[12, 18]],
      '18-00': [[18, 24], [0, 6]],
      '00-06': [[0, 6]],
    };

    const ranges = timeRanges[selectedSlot] || [];
    return ranges.some(([start, end]) =>
      end === 24 ? hour >= start : hour >= start && hour < end
    );
  }

  /**
   * Filter folders by day
   */
  filterFoldersByDay(folder: FootageFolder, selectedDay: string | null): boolean {
    if (!selectedDay) return true;

    const dayMap: Record<string, string> = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
      Sun: 'Sunday',
    };

    return folder.day === dayMap[selectedDay] || folder.day === selectedDay;
  }

  /**
   * Calculate total accidents
   */
  calculateTotalAccidents(stats: AccidentStat[]): number {
    return stats.reduce((acc, curr) => acc + curr.value, 0);
  }

  /**
   * Get maximum value from stats
   */
  getMaxStatValue(stats: AccidentStat[]): number {
    const max = Math.max(...stats.map((s) => s.value));
    return max > 0 ? max : 1;
  }
}

export default new AccidentService();
