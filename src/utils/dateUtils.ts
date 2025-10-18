import { addDays, startOfDay, getDay } from 'date-fns';
import { Sprint } from '../types';
import { SPRINT_DURATION_DAYS, SPRINT_START_DAY } from '../constants';

/**
 * Finds the start of the next Tuesday from a given date
 * @param date - The reference date
 * @returns The next Tuesday at midnight
 */
export function startOfNextTuesday(date: Date): Date {
  const day = getDay(date);
  const daysUntilTuesday = (SPRINT_START_DAY - day + 7) % 7 || 7;
  return addDays(startOfDay(date), daysUntilTuesday);
}

/**
 * Generates sprint objects with calculated date ranges
 * @param numSprints - Number of sprints to generate
 * @param startDate - Start date for the first sprint
 * @param velocity - Story points capacity per sprint
 * @returns Array of Sprint objects
 */
export function generateSprints(
  numSprints: number,
  startDate: Date,
  velocity: number
): Sprint[] {
  const sprints: Sprint[] = [];
  let currentStart = startOfNextTuesday(startDate);

  for (let i = 1; i <= numSprints; i++) {
    const endDate = addDays(currentStart, SPRINT_DURATION_DAYS - 1); // 10-day sprint (inclusive)
    sprints.push({
      id: crypto.randomUUID(),
      number: i,
      startDate: currentStart,
      endDate: endDate,
      velocity: velocity,
    });
    currentStart = addDays(endDate, 1); // Next Tuesday
  }

  return sprints;
}

/**
 * Formats a date range for display
 * @param startDate - Sprint start date
 * @param endDate - Sprint end date
 * @returns Formatted string like "Tue, 10/15 - Mon, 10/24"
 */
export function formatSprintDateRange(startDate: Date, endDate: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  };

  const startStr = startDate.toLocaleDateString('en-US', formatOptions);
  const endStr = endDate.toLocaleDateString('en-US', formatOptions);

  return `${startStr} - ${endStr}`;
}
