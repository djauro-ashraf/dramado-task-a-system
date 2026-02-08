/**
 * Service to generate dramatic messages based on user actions
 */

const generateCompletionMessage = (isOnTime, priority, mood) => {
  if (isOnTime) {
    const onTimeMessages = {
      high: [
        '🎭 MAGNIFICENT! A high-priority task completed ON TIME! The audience rises to their feet!',
        '⚡ GLORIOUS VICTORY! You have defeated the dragon of procrastination!',
        '🏆 THE CHAMPION STRIKES! High priority? More like HIGH PERFORMANCE!'
      ],
      medium: [
        '✨ Well done, protagonist! Another chapter closes successfully.',
        '🎯 Precision execution! The plot thickens in your favor.',
        '👏 A solid performance! The critics nod in approval.'
      ],
      low: [
        '🌟 Every small victory counts! The journey of a thousand miles...',
        '✅ Task complete! Even the smallest role matters in this grand play.',
        '🎪 A minor subplot resolved! The story flows smoothly.'
      ]
    };
    const messages = onTimeMessages[priority] || onTimeMessages.medium;
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const lateMessages = {
      high: [
        '😰 Finally! Better late than never, but the audience was getting restless!',
        '⏰ PHEW! You squeaked by, but the critics noticed the delay...',
        '🎭 Dramatic finish! Late completion of a high-priority task - so cinematic!'
      ],
      medium: [
        '🕐 Done, but fashionably late. The drama continues...',
        '⚠️ Complete, though not exactly Oscar-worthy timing.',
        '😅 Mission accomplished... eventually. Points for persistence!'
      ],
      low: [
        '🐌 Slow and steady... well, mostly slow. But it\'s done!',
        '✅ Better late than never, our procrastinating hero!',
        '🎬 CUT! Finally wrapped this scene. Moving on!'
      ]
    };
    const messages = lateMessages[priority] || lateMessages.medium;
    return messages[Math.floor(Math.random() * messages.length)];
  }
};

const generateSnoozeMessage = (snoozeCount, priority) => {
  if (snoozeCount > 3) {
    return [
      '🔕 REALLY?! Another snooze? This is becoming a tragedy!',
      '😱 The snooze button addiction is REAL! Intervention needed!',
      '🎭 Act 47: The Eternal Snooze. Will our hero ever wake up?!'
    ][Math.floor(Math.random() * 3)];
  } else if (priority === 'high') {
    return [
      '⏰ High priority snoozed! The plot twist nobody wanted!',
      '😬 Snoozing the important stuff? Bold strategy, let\'s see how it plays out.',
      '🚨 DANGER! Snoozing a high-priority alarm! The stakes rise!'
    ][Math.floor(Math.random() * 3)];
  } else {
    return [
      '😴 Just 5 more minutes... said the hero, tempting fate.',
      '⏸️ Snooze activated. Chaos score +1. The drama builds!',
      '🎪 Delaying the inevitable! How theatrical!'
    ][Math.floor(Math.random() * 3)];
  }
};

const generateIgnoreMessage = (priority) => {
  const messages = {
    high: [
      '🔥 IGNORED A HIGH-PRIORITY ALARM?! The plot spirals into chaos!',
      '💀 DEVASTATING! The hero chooses to ignore their destiny!',
      '⚠️ CATASTROPHIC DECISION! This will have consequences!'
    ],
    medium: [
      '😬 Ignored! The universe takes note of your defiance.',
      '🎭 Bold move! Ignoring your responsibilities like a true rebel.',
      '⚡ Dismissed! The chaos gods smile upon your recklessness.'
    ],
    low: [
      '👀 Ignored. Small consequences, but consequences nonetheless.',
      '🌪️ Another task falls by the wayside. The chaos grows...',
      '😐 Ignored. The narrator is disappointed but not surprised.'
    ]
  };
  const messageArray = messages[priority] || messages.medium;
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};

const generateMissedDeadlineMessage = (priority, hoursOverdue) => {
  if (hoursOverdue > 24) {
    return [
      '💀 DEADLINE OBLITERATED! Days have passed! This is a disaster!',
      '🔥 MULTIPLE DAYS OVERDUE! The tragic arc deepens!',
      '😱 The deadline is but a distant memory now. All hope seems lost!'
    ][Math.floor(Math.random() * 3)];
  } else {
    const messages = {
      high: [
        '🚨 HIGH-PRIORITY DEADLINE MISSED! Sound the alarms! (Oh wait, you ignored those too)',
        '💔 The deadline passed. The high-priority dreams... shattered.',
        '⚰️ A critical deadline, now just a painful memory.'
      ],
      medium: [
        '⏰ Deadline whooshed past like a train you missed.',
        '😞 Overdue. Not ideal, but the show must go on.',
        '⚠️ Past the deadline. The chaos score climbs higher.'
      ],
      low: [
        '📅 Missed a low-priority deadline. Barely a footnote in this saga.',
        '🕐 Overdue, but it was low priority anyway, right? ...Right?',
        '😐 Another small deadline missed. Death by a thousand cuts.'
      ]
    };
    const messageArray = messages[priority] || messages.medium;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  }
};

const generateTaskCreatedMessage = (priority, hasAlarm) => {
  if (hasAlarm) {
    const messages = {
      high: [
        '🎯 A HIGH-PRIORITY task with an ALARM! Someone means business!',
        '⚡ The hero sets a critical mission with dramatic timing!',
        '🔔 High stakes, high priority, and a rude awakening ahead!'
      ],
      medium: [
        '✅ New task created with alarm! The plot thickens!',
        '🎬 Scene set! Alarm scheduled! Action awaits!',
        '⏰ A new challenge appears on the horizon...'
      ],
      low: [
        '📝 New low-priority task. Every journey begins somewhere!',
        '🎪 A small task, but with an alarm? Interesting choice!',
        '✨ Task created. Alarm set. Let the games begin!'
      ]
    };
    const messageArray = messages[priority] || messages.medium;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  } else {
    return '📋 New task created! The to-do list grows, as does the drama!';
  }
};

module.exports = {
  generateCompletionMessage,
  generateSnoozeMessage,
  generateIgnoreMessage,
  generateMissedDeadlineMessage,
  generateTaskCreatedMessage
};
