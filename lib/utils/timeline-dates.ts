// Utility functions for timeline date handling

// Format date for display
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  // Return the date string as-is since it's already in YYYY-MM-DD format
  return dateString;
}

// Format date range for display
export function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) return '';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  if (!endDate) return `From ${formatDate(startDate)}`;
  
  // Same day - just show one date
  if (startDate === endDate) {
    return formatDate(startDate);
  }
  
  // Different days - show range
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
}

// Calculate duration in days
export function calculateDuration(startDate: string | null, endDate: string | null): number | null {
  if (!startDate || !endDate) return null;
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  return diffDays;
}

// Format duration for display
export function formatDuration(days: number): string {
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days === 7) return '1 week';
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
    return `${weeks} week${weeks > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `~${months} month${months > 1 ? 's' : ''}`;
  }
  const years = Math.floor(days / 365);
  return `~${years} year${years > 1 ? 's' : ''}`;
}

// Get local date string in YYYY-MM-DD format
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate date suggestions based on block type
export function suggestDates(type: string, parentStartDate?: string | null): { startDate: string; endDate: string } | null {
  // Get today's date in user's local timezone
  const today = new Date();
  let startDate: Date;
  
  if (parentStartDate) {
    // Parse parent date properly
    const [year, month, day] = parentStartDate.split('-').map(Number);
    startDate = new Date(year, month - 1, day);
  } else {
    startDate = today;
  }
  
  switch (type) {
    case 'day':
      return {
        startDate: getLocalDateString(startDate),
        endDate: getLocalDateString(startDate)
      };
    case 'week':
      const weekEnd = new Date(startDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return {
        startDate: getLocalDateString(startDate),
        endDate: getLocalDateString(weekEnd)
      };
    case 'sprint':
      const sprintEnd = new Date(startDate);
      sprintEnd.setDate(sprintEnd.getDate() + 13); // 2 weeks
      return {
        startDate: getLocalDateString(startDate),
        endDate: getLocalDateString(sprintEnd)
      };
    case 'month':
      const monthEnd = new Date(startDate);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(monthEnd.getDate() - 1);
      return {
        startDate: getLocalDateString(startDate),
        endDate: getLocalDateString(monthEnd)
      };
    case 'quarter':
      const quarterEnd = new Date(startDate);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3);
      quarterEnd.setDate(quarterEnd.getDate() - 1);
      return {
        startDate: getLocalDateString(startDate),
        endDate: getLocalDateString(quarterEnd)
      };
    default:
      return null;
  }
}

// Check if dates overlap
export function checkOverlap(
  start1: string | null, 
  end1: string | null, 
  start2: string | null, 
  end2: string | null
): boolean {
  if (!start1 || !end1 || !start2 || !end2) return false;
  
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  
  return (s1 <= e2 && e1 >= s2);
}

// Calculate child dates to fit within parent
export function fitWithinParent(
  childType: string,
  parentStartDate: string | null,
  parentEndDate: string | null,
  position: number,
  totalSiblings: number
): { startDate: string; endDate: string } | null {
  if (!parentStartDate || !parentEndDate) return null;
  
  const parentStart = new Date(parentStartDate);
  const parentEnd = new Date(parentEndDate);
  const parentDuration = Math.ceil((parentEnd.getTime() - parentStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Simple equal division for now
  const childDuration = Math.floor(parentDuration / totalSiblings);
  const childStart = new Date(parentStart);
  childStart.setDate(childStart.getDate() + (position * childDuration));
  
  const childEnd = new Date(childStart);
  childEnd.setDate(childEnd.getDate() + childDuration - 1);
  
  // Ensure last child ends on parent end date
  if (position === totalSiblings - 1) {
    childEnd.setTime(parentEnd.getTime());
  }
  
  return {
    startDate: childStart.toISOString().split('T')[0],
    endDate: childEnd.toISOString().split('T')[0]
  };
}