// Shared lists used by the form, the dashboard and the journal

// mood 1 → MOODS[0], mood 5 → MOODS[4]
// mouth = the SVG path of the face's mouth (see MoodFace in icons.tsx)
export const MOODS = [
  { label: 'Sluggish', mouth: 'M8 16.6c1.2-1.6 2.5-2.3 4-2.3s2.8.7 4 2.3', tint: '#E2E8F0' },
  { label: 'Low', mouth: 'M8.5 16c1-.8 2.2-1.2 3.5-1.2s2.5.4 3.5 1.2', tint: '#E0E7FF' },
  { label: 'Okay', mouth: 'M8.5 15.3h7', tint: '#DBEAFE' },
  { label: 'Good', mouth: 'M8.5 14.4c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5', tint: '#CFE0FD' },
  { label: 'Great', mouth: 'M8 13.8c1.2 1.9 2.5 2.7 4 2.7s2.8-.8 4-2.7', tint: '#FDE9C2' },
]

export const ACTIVITIES = ['work', 'sport', 'reading', 'social', 'outdoors', 'rest']
