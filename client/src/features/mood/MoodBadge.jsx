export default function MoodBadge({ user }) {
  if (!user) return null;

  const moodEmoji = {
    heroic: '⭐',
    focused: '🎯',
    neutral: '😐',
    struggling: '😰',
    chaotic: '🌪️'
  };

  const moodLabel = {
    heroic: 'HEROIC',
    focused: 'FOCUSED',
    neutral: 'NEUTRAL',
    struggling: 'STRUGGLING',
    chaotic: 'CHAOTIC'
  };

  return (
    <div className={`mood-badge mood-${user.mood}`}>
      {moodEmoji[user.mood]} {moodLabel[user.mood]}
    </div>
  );
}