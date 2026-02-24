/**
 * Analytics Service - Handles accident statistics and analytics logic
 * Follows Single Responsibility Principle (SRP)
 * Pure functions for calculating analytics
 */

import { AccidentStat, DateRange } from '../domain';

class AnalyticsService {
  /**
   * Get stats for a specific week
   */
  getStatsForWeek(weekIndex: number, dimension: 'day' | 'time'): AccidentStat[] {
    const seeds = [
      // Week 0 (Current)
      { day: [2, 1, 5, 3, 6, 8, 4], time: [12, 18, 24, 6] },
      // Week 1
      { day: [3, 2, 4, 1, 9, 5, 2], time: [10, 15, 30, 8] },
      // Week 2
      { day: [1, 5, 2, 7, 4, 3, 6], time: [8, 20, 18, 12] },
      // Week 3
      { day: [4, 3, 8, 2, 5, 7, 1], time: [15, 12, 22, 5] },
    ];

    const data = seeds[Math.min(weekIndex, seeds.length - 1)];

    if (dimension === 'day') {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return labels.map((l, i) => ({ label: l, value: data.day[i] }));
    } else {
      const labels = ['06-12', '12-18', '18-00', '00-06'];
      return labels.map((l, i) => ({ label: l, value: data.time[i] }));
    }
  }

  /**
   * Calculate date range for a week
   */
  calculateDateRangeForWeek(weekOffset: number): DateRange {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() - now.getDay() - weekOffset * 7 + 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    return { start, end };
  }

  /**
   * Format date range as string
   */
  formatDateRange(dateRange: DateRange): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${dateRange.start.toLocaleDateString('en-US', options)} - ${dateRange.end.toLocaleDateString('en-US', options)}, ${dateRange.end.getFullYear()}`;
  }

  /**
   * Calculate trend percentage
   */
  calculateTrend(period: 'weekly' | 'monthly'): {
    percentage: string;
    isUp: boolean;
  } {
    const trendMap = {
      weekly: { percentage: '+12%', isUp: true },
      monthly: { percentage: '-4%', isUp: false },
    };

    const trend = trendMap[period];
    return {
      percentage: trend.percentage,
      isUp: trend.isUp,
    };
  }
}

export default new AnalyticsService();
