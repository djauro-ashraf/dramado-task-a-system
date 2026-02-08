const { MOOD } = require('../utils/constants');

/**
 * Calculate user's current mood based on scores
 */
const calculateMood = (disciplineScore, chaosScore) => {
  if (disciplineScore >= 20 && chaosScore < 10) {
    return MOOD.HEROIC;
  } else if (disciplineScore >= 10) {
    return MOOD.FOCUSED;
  } else if (chaosScore >= 15) {
    return MOOD.CHAOTIC;
  } else if (chaosScore >= 8 && disciplineScore < 8) {
    return MOOD.STRUGGLING;
  }
  return MOOD.NEUTRAL;
};

/**
 * Get mood description
 */
const getMoodDescription = (mood) => {
  const descriptions = {
    [MOOD.HEROIC]: '⭐ HEROIC - You are unstoppable! The universe trembles before your discipline!',
    [MOOD.FOCUSED]: '🎯 FOCUSED - A warrior on the path. Keep the momentum going!',
    [MOOD.NEUTRAL]: '😐 NEUTRAL - The calm before the storm. What will you become?',
    [MOOD.STRUGGLING]: '😰 STRUGGLING - The darkness closes in. Will you rise or fall?',
    [MOOD.CHAOTIC]: '🌪️ CHAOTIC - Pure chaos! Your productivity is a theatrical disaster!'
  };
  return descriptions[mood] || descriptions[MOOD.NEUTRAL];
};

/**
 * Get mood-based motivational message
 */
const getMotivationalMessage = (mood) => {
  const messages = {
    [MOOD.HEROIC]: [
      'You magnificent beast! Keep conquering!',
      'The legends will speak of this day!',
      'Absolute perfection! The cosmos applauds!'
    ],
    [MOOD.FOCUSED]: [
      'Steady as she goes, captain!',
      'One task at a time, one victory at a time.',
      'The path is clear, keep walking it!'
    ],
    [MOOD.NEUTRAL]: [
      'Every journey begins with a single step.',
      'The stage is set. What will you do?',
      'Potential energy waiting to be unleashed.'
    ],
    [MOOD.STRUGGLING]: [
      'Even heroes stumble. Get back up!',
      'The darkest hour comes before dawn.',
      'One small win can turn the tide!'
    ],
    [MOOD.CHAOTIC]: [
      'OH NO. The spiral continues!',
      'This is fine. Everything is fine. (It\'s not fine)',
      'CHAOS REIGNS! But you can still fight back!'
    ]
  };

  const messageArray = messages[mood] || messages[MOOD.NEUTRAL];
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};

module.exports = {
  calculateMood,
  getMoodDescription,
  getMotivationalMessage
};
