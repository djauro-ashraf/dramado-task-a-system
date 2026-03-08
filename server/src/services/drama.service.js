/**
 * Service to generate DRAMATICALLY EXAGGERATED messages based on user actions.
 * Mockery, indirect insults, and theatrical hyperbole are ENCOURAGED.
 * Religious references are left untouched.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateCompletionMessage = (isOnTime, priority, mood) => {
  if (isOnTime) {
    const onTimeMessages = {
      high: [
        '🎭 ABSOLUTELY BREATHTAKING!! A HIGH-PRIORITY task annihilated ON TIME! The universe itself paused to applaud your magnificence — briefly, before resuming its indifference to you specifically.',
        '⚡ GLORIOUS, EARTH-SHATTERING VICTORY!! You have slain the dragon of procrastination! Scientists are baffled! Historians are weeping! Average people remain unimpressed, but WE know the truth!',
        '🏆 THE CHAMPION ASCENDS!! High priority? More like HIGH PERFORMANCE, HIGH IQ, HIGH EVERYTHING — okay that might be a stretch, but take the win, you genuinely need it!',
        '🌋 VOLCANIC LEVELS OF PRODUCTIVITY DETECTED!! On-time completion of a HIGH-PRIORITY task! Your ancestors in the afterlife are doing a standing ovation right now — yes, even the ones who gave up on you!'
      ],
      medium: [
        '✨ Well well well... the protagonist actually showed up to their own life for once! Another chapter closes! The critics are... cautiously optimistic. Don\'t ruin it.',
        '🎯 Precision execution! The plot thickens IN YOUR FAVOR for once! A rare event, truly. Scientists will study this anomaly for years to come.',
        '👏 A solid — genuinely SOLID — performance! The narrator, who had almost completely given up on you, begrudgingly nods in approval.',
        '🎪 Task DEMOLISHED! You looked chaos in the eye and said "not today, chaos!" and chaos actually blinked first. UNPRECEDENTED.'
      ],
      low: [
        '🌟 Even the small victories count! Especially for you, because frankly the bar has been concerningly low lately. But TODAY? TODAY you cleared it! Barely. But still!',
        '✅ Task complete! Even the tiniest role matters in this grand play of life! You were cast as the person who does small things adequately, and today you NAILED that role!',
        '🎭 A minor subplot resolved! The grand narrative of your existence shuffles forward one inch! Every inch counts! We are SO desperate for you to inch forward at this point!'
      ]
    };
    return pick(onTimeMessages[priority] || onTimeMessages.medium);
  } else {
    const lateMessages = {
      high: [
        '😰 FINALLY!! Only took you an eternity, but the high-priority task is DONE! The audience wasn\'t just restless — they filed for divorce from your timeline. But here we are. Completion achieved. Barely.',
        '⏰ YOU ABSOLUTE LAST-MINUTE LEGEND!! Late on a HIGH-PRIORITY task, yet somehow strutting in like you own the place! The sheer audacity is almost admirable. ALMOST.',
        '🎭 DRAMATIC LATE FINISH ON HIGH PRIORITY! This is what historians will write about when they document the reign of Captain Procrastination the Perpetually Behind! At least it\'s DONE now, you magnificent disaster!',
        '💀 It is done. Finished. Complete. Embarrassingly, catastrophically, hilariously LATE — but DONE. The task gods weep, but they also reluctantly tick the box. +1 discipline score, you chaotic wonder.'
      ],
      medium: [
        '🕐 Done! Fashionably late, as if this were a gala and not a personal obligation you avoided for an uncomfortable amount of time. The drama continues, but so does your existence. Congratulations.',
        '⚠️ Complete, though the execution timing was so poor it qualifies as a cry for help. Not Oscar-worthy. Not even Razzie-worthy. More of a "participation ribbon at the remedial life skills fair" situation.',
        '😅 Mission accomplished... eventually. The historians took notes. The notes say "...why though?" But POINTS FOR PERSISTENCE, you magnificent, baffling creature!',
        '🐢 You did it at the pace of a very tired snail with bad knees, but you DID IT! The task sits in the completed pile, quietly judging the time it spent waiting for you to notice it existed.'
      ],
      low: [
        '🐌 Slow and steady... well. Mostly just slow. The "steady" part is being generous. But it is, miraculously, DONE. The low-priority task thanks you for the eventual attention. It had given up.',
        '✅ Better late than never, our gloriously procrastinating hero! This task waited for you like a loyal dog. You finally remembered it existed. History will be kind. Mostly.',
        '🎬 CUT! Scene! After AGES of waiting, our star finally delivers the performance! It was not worth the wait, but it IS finished, and that\'s what matters. Mostly. Kind of. Moving on!'
      ]
    };
    return pick(lateMessages[priority] || lateMessages.medium);
  }
};

const generateSnoozeMessage = (snoozeCount, priority) => {
  if (snoozeCount > 5) {
    return pick([
      '🔕 Snooze number INFINITY reaches its final form!! At this point the alarm has given up, the task has given up, and frankly even the narrator has lost the will to narrate. BUT HERE WE ARE. Chaos +1.',
      '😱 SEVEN SNOOZES. S-E-V-E-N. The alarm has Stockholm syndrome now. It WANTS you to snooze it. You\'ve broken it completely. This is genuinely unprecedented levels of avoidance.',
      '🎭 ACT 47: THE ETERNAL SNOOZE. Our protagonist, too powerful for time management, too charismatic for deadlines, snoozes again into the howling void. The chaos score ascends.',
      '💀 The alarm is now a SUGGESTION. You have successfully trained it to expect disappointment. It barely beeps with conviction anymore. You\'ve destroyed an alarm\'s sense of purpose. ARE YOU PROUD?'
    ]);
  } else if (snoozeCount > 3) {
    return pick([
      '🔕 REALLY?! AGAIN?! This is beyond dramatic — this is a DOCUMENTARY about human avoidance behavior! You are the subject! This is your TED talk! The topic is "Why?"!',
      '😱 The snooze button addiction is REAL and you are the case study! Medical journals want to feature you! Not in a flattering way! Chaos +1. You deserve it.',
      '🎭 Act ' + (snoozeCount + 4) + ': The Eternal Snooze. Will our hero ever confront their responsibilities? The audience, once excited, now just watches with morbid fascination.'
    ]);
  } else if (priority === 'high') {
    return pick([
      '⏰ HIGH PRIORITY SNOOZED!! The plot twist nobody wanted, in the episode nobody asked for, of the show that was already struggling in the ratings! BOLD. STUPID. But BOLD.',
      '😬 Snoozing the important stuff?! This is the strategy of legends — specifically, legendary cautionary tales told to business school students about what NOT to do!',
      '🚨 DANGER ALERT: A HIGH-PRIORITY alarm has been snoozed by someone who apparently doesn\'t feel like being a functional adult right now! The chaos gods scribble in their notebooks.',
      '🌋 A HIGH-PRIORITY task just got snoozed like it was a mild inconvenience on a lazy Sunday! It was NOT a mild inconvenience! The stakes continue to rise, apparently unbothered by your indifference!'
    ]);
  } else {
    return pick([
      '😴 "Just 5 more minutes," said the hero, serenely hurtling toward consequences. The alarm, betrayed and weeping, starts counting down again. +1 chaos. Sweet dreams.',
      '⏸️ Snooze activated! Chaos score increments upward, as it always does when you choose comfort over competence! The drama builds to what experts are calling "an unnecessary level"!',
      '🎪 Delaying the inevitable with THEATRICAL FLAIR! A lesser person would simply face their tasks. You have chosen the path of artful, excruciating procrastination. Respect. Misguided respect, but respect.',
      '🐢 The snooze button thanks you for the visit. It sees you more than most of your responsibilities do. A tragic, intimate relationship is forming between you and the concept of "later".'
    ]);
  }
};

const generateIgnoreMessage = (priority) => {
  const messages = {
    high: [
      '🔥 IGNORED A HIGH-PRIORITY ALARM?! THE ABSOLUTE AUDACITY!! The plot doesn\'t just spiral into chaos — it LEAPS into chaos, does a triple backflip, and sticks the landing in a burning building!!',
      '💀 DEVASTATING!! The hero chooses to ignore their destiny with the confidence of someone who clearly doesn\'t understand what "high priority" means! The chaos gods are taking notes. Very angry notes.',
      '⚠️ CATASTROPHIC DECISION LOGGED!! Future you will find this in the historical record under "Decisions That Aged Poorly." Chaos +2. The universe has officially begun side-eyeing you.',
      '🌋 A HIGH-PRIORITY ALARM, IGNORED!! This isn\'t even chaos anymore — this is PERFORMANCE ART about chaos! You\'ve transcended bad planning and entered the realm of chaotic self-expression! +2 chaos for the art!'
    ],
    medium: [
      '😬 Ignored! The universe takes very specific note of your defiance, writes it down, dates it, timestamps it, and files it under "Yeah, we saw that." Chaos +2.',
      '🎭 BOLD MOVE, IGNORING YOUR RESPONSIBILITIES like a free spirit untethered from the concept of consequences! The narrator is not supportive. The chaos score, however, is thriving.',
      '⚡ Dismissed!! The chaos gods don\'t just smile upon your recklessness — they are HOWLING with laughter and updating your file with fresh material! +2 chaos, you beautiful disaster.',
      '🗑️ Task alarm, deposited directly into the void! The task itself sits there, alarmless now, staring at you with hollow eyes. "So this is what it feels like," it thinks. "To be abandoned."'
    ],
    low: [
      '👀 Ignored. Small consequences, yes. But they are REAL consequences, stacking like tiny snowflakes into the avalanche of chaos that your future self will eventually have to ski through.',
      '🌪️ Another task alarm falls by the wayside! The chaos grows from the ashes of your discarded responsibilities! It\'s only +2 chaos this time, but chaos has a long memory and short patience.',
      '😐 Ignored. The narrator is disappointed but not surprised — which is honestly the worst possible review one can receive from one\'s own internal narrator. Not surprised. Think about that.'
    ]
  };
  return pick(messages[priority] || messages.medium);
};

const generateMissedDeadlineMessage = (priority, hoursOverdue) => {
  if (hoursOverdue > 48) {
    return pick([
      '💀 DEADLINE OBLITERATED INTO POWDER!! DAYS have passed!! This task has been overdue long enough to have gone through several emotional stages of grief about being abandoned by you!!',
      '🔥 MULTIPLE DAYS OVERDUE!! The tragic arc of this story has reached its lowest point and somehow found a basement beneath the basement! The chaos score weeps and increments simultaneously!',
      '😱 The deadline is but a distant memory, a faint ghost of a commitment you once made to yourself when you were briefly optimistic about your own capabilities! How innocent you were then!',
      '⚰️ This task has been overdue so long it has developed its own personality. It calls itself "The Forgotten One." It has started a support group with your other overdue tasks. They meet on Tuesdays.'
    ]);
  } else if (hoursOverdue > 24) {
    return pick([
      '💀 OVER 24 HOURS OVERDUE!! A full day and night has passed while this task sat there, deadline long gone, wondering what it did to deserve this abandonment! Chaos takes another victory lap!',
      '🔥 A WHOLE DAY OF OVERDUE!! The task hasn\'t moved. You haven\'t moved. Time, unfortunately, has VERY much moved. The gap between you and your deadline now spans an entire Earth rotation!',
      '😱 Yesterday\'s deadline has become today\'s shame spiral! The chaos score has been upgraded to "structural damage" levels. But do not despair — technically it can still get worse!'
    ]);
  } else {
    const messages = {
      high: [
        '🚨 HIGH-PRIORITY DEADLINE MISSED!! Sound the alarms!! (Oh wait — you ignored those too, didn\'t you. The alarms have filed a complaint. The deadline has filed for separation. Chaos +3.)',
        '💔 The deadline passed. The high-priority dreams... shattered into pixels. The timeline you set for yourself, now just a monument to ambition and poor follow-through. Very cinematic. Very bad.',
        '⚰️ A critical deadline, now just a painful memory and a +3 chaos score. Future you is already planning how to explain this. Present you has not yet fully processed the gravity of the situation.',
        '🌋 HIGH-PRIORITY DEADLINE EVAPORATED!! It didn\'t pass gracefully — it EXPLODED past you while you were doing something of questionable importance! Chaos score now has a new high score!'
      ],
      medium: [
        '⏰ The deadline whooshed past like an express train you missed because you were on your phone! You didn\'t just miss it — you were THERE, watching it leave, and still didn\'t move! +3 chaos.',
        '😞 Overdue. Not ideal. Not even close to ideal. The "ideal" and "actual" versions of your timeline are currently in different timezones. Chaos grows. The show must go on. It just goes on LATE.',
        '⚠️ Past the deadline. The chaos score has climbed another rung on the ladder it\'s been enthusiastically ascending since you started this magnificent streak of underperformance. Keep it up? Please don\'t.',
        '🕰️ Time of deadline: passed. Time of completion: unknown. Time of reckoning: pending. The narrative clock ticks louder with each overdue hour. Chaos +3. The universe remains unimpressed.'
      ],
      low: [
        '📅 Missed a low-priority deadline. Barely a footnote in this saga, but footnotes ADD UP. This footnote joins a growing collection that\'s starting to look less like a footnote and more like a thesis.',
        '🕐 Overdue, but it was low priority anyway, right? ...Right? The silence after that question is increasingly uncomfortable. Low priority or not, chaos got its +3. It doesn\'t discriminate.',
        '😐 Another small deadline missed. Death by a thousand cuts, as the saying goes. This is cut number... well, we\'ve lost count. But they accumulate! As cuts do! Chaos increments!'
      ]
    };
    return pick(messages[priority] || messages.medium);
  }
};

const generateMissedAlarmMessage = (priority, missedCount) => {
  const baseMessages = {
    high: [
      '🚨 MISSED ALARM ON HIGH-PRIORITY!! The alarm played. It screamed. It begged. You did NOTHING. The alarm has gone silent not because it finished — but because it gave up on you. Chaos +3.',
      '💀 THE HIGH-PRIORITY ALARM EXPIRED UNACKNOWLEDGED!! You let it ring into the void and simply... waited for it to stop! Bold! Terrible! Deeply, profoundly telling about your relationship with accountability!',
      '🔥 ALARM PERIOD EXPIRED!! That HIGH-PRIORITY alarm screamed for its entire allotted time, received zero response, and has now filed a formal complaint with the Chaos Bureau. +3 chaos. LOGGED.'
    ],
    medium: [
      '😱 The alarm rang. And rang. And rang. And then — silence. Not the peaceful kind. The kind where the alarm has accepted defeat and your chaos score quietly gained 3 points while you did nothing.',
      '⏰ Alarm period over. Unacknowledged. The alarm has gone to that great snooze in the sky. It will be remembered as a warning that was warning that was comprehensively, enthusiastically ignored. Chaos +3.',
      '🎭 Your alarm gave a full performance — sound, fury, the complete dramatic production — and the audience (you) didn\'t even glance up from whatever was more important than your own obligations. Stunning.'
    ],
    low: [
      '👀 Even a LOW-PRIORITY alarm was missed. It rang. It expired. It was never acknowledged. Somewhere a small task weeps quietly. Chaos +3, because chaos has no minimum order.',
      '😐 The alarm rang its entire period, found zero engagement, and retired in quiet dignity. You remain blissfully, chaotically unaccountable. The score reflects this. It always does.',
      '🌪️ Alarm missed. Chaos +3. The low-priority task joins the growing council of your unacknowledged responsibilities. They are organizing. You should probably care about this eventually.'
    ]
  };

  let msg = pick(baseMessages[priority] || baseMessages.medium);

  if (missedCount > 3) {
    msg += ` (MISSED ALARM #${missedCount} — at this point the alarms have formed a union and are demanding hazard pay for emotional damages)`;
  } else if (missedCount > 1) {
    msg += ` (Missed alarm streak: ${missedCount}. The universe is keeping a detailed ledger.)`;
  }

  return msg;
};

const generateTaskCreatedMessage = (priority, hasAlarm) => {
  if (hasAlarm) {
    const messages = {
      high: [
        '🎯 A HIGH-PRIORITY task WITH AN ALARM has entered the arena!! Someone means SERIOUS business!! Or at least, someone intends to mean business! The execution remains to be seen! DRAMATICALLY!',
        '⚡ The hero sets a CRITICAL MISSION with DRAMATIC TIMING!! The alarm is armed! The stakes are established! All that remains is for you to not completely obliterate this with procrastination!',
        '🔔 HIGH STAKES! HIGH PRIORITY! ALARM LOADED AND READY! A rude awakening of your own deliberate design approaches!! Will you answer the call when it comes?! HISTORY WILL JUDGE YOU EITHER WAY!!'
      ],
      medium: [
        '✅ New task FORGED in the fires of intention, equipped with an alarm! The plot THICKENS! The challenge is SET! The future moment of reckoning is now officially scheduled on the calendar of destiny!',
        '🎬 Scene SET! Alarm SCHEDULED! The stage is prepared for an action sequence that future-you will either handle brilliantly or catastrophically! We genuinely do not know which! The drama lives in the uncertainty!',
        '⏰ A new challenge rises on the horizon, equipped with an alarm to ensure you cannot PRETEND you didn\'t know about it! All excuses pre-emptively neutralized! Impressive foresight!'
      ],
      low: [
        '📝 A low-priority task enters the list, complete with alarm! Even the small missions deserve their dramatic entrance! And their dramatic alarm! And their dramatic potential for being ignored!',
        '🎪 A small task, armed with an alarm — either because you are MAGNIFICENTLY organized, or because even low-priority things have learned they need a scheduled intervention to get your attention.',
        '✨ Task created. Alarm set. Let the games begin! (And they will begin. The alarm will see to that. Whether you engage with the games is, as always, entirely up to your mercurial decision-making.)'
      ]
    };
    return pick(messages[priority] || messages.medium);
  } else {
    return pick([
      '📋 New task added to the ever-growing monument to your aspirations! The to-do list expands! The drama deepens! The possibility of actually doing this remains theoretically open!',
      '🎭 A NEW TASK ENTERS THE ARENA!! No alarm. No deadline timer. Just pure, raw intention standing alone in the ring against the heavyweight champion: Future Avoidance. We\'ll see how this goes.',
      '✍️ Task created! Dropped into the list like a pebble into an ocean of other things you intend to do eventually! Will it sink into the depths of neglect, or rise to completion? The narrative awaits!'
    ]);
  }
};

const generateChaosLockMessage = () => {
  return pick([
    '🔴 YOUR CHAOS SCORE IS SO HIGH THAT THIS ALARM IS NOW UNDER LOCK AND KEY!! You don\'t get to just snooze your way through life when you\'ve achieved THIS level of spectacular self-sabotage! Play the game. WIN the game. THEN you may interact with your responsibilities like a functional human being. MAYBE.',
    '💀 MAXIMUM CHAOS DETECTED!! The system has observed your spectacular track record of alarm abandonment and has decided: NO MORE FREE PASSES!! Before you can complete, snooze, or ignore — you must PROVE yourself. Via a game. Yes. A game. This is your life now.',
    '🌋 YOUR CHAOS SCORE HAS REACHED CATASTROPHIC LEVELS!! The alarm system refuses to be ignored by someone of YOUR established avoidance pedigree without at least a small challenge! Play. Win. Then — and ONLY THEN — shall you have access to the buttons.',
    '🎪 Congratulations! You\'ve gamified your own dysfunction! Your chaos score is so astronomically high that the system has implemented MANDATORY FUN as a prerequisite for basic task management! Enjoy the game you earned through your choices!'
  ]);
};

const generateSockbombWinMessage = () => {
  return pick([
    '🎉 YOU ACTUALLY WON!! Against all reasonable expectations, given your recent track record!! The game is defeated! The lock is lifted! You may now engage with your alarm like a person who has EARNED the right! USE THIS WISELY!!',
    '🏆 GAME VICTORY ACHIEVED!! The chaos locks disengage! A small part of the system had bet against you. That part now owes the other part money. Please proceed to handle your alarm before you waste this hard-won opportunity on regret!',
    '⚡ THE SOCKBOMBS ARE VANQUISHED!! You have demonstrated the bare minimum of cognitive function required to manage your own schedule! The alarm buttons are unlocked! DO SOMETHING GOOD WITH THEM, FOR ONCE!!',
    '🎭 WINNER!! The game concedes! The chaos system, begrudgingly, tips its hat! YOU HAVE EARNED THE RIGHT TO INTERACT WITH YOUR OWN TASK MANAGEMENT SYSTEM!! What a time to be alive and only marginally responsible!!'
  ]);
};

const generateSockbombLoseMessage = () => {
  return pick([
    '💀 YOU LOST THE GAME!! You couldn\'t even win a simple mini-game that was specifically designed to give you a chance! The chaos tightens its grip! The alarm rings on!! TRY AGAIN!!',
    '😱 DEFEATED BY SOCKBOMBS!! The chaos system is genuinely unsurprised but also somehow still disappointed! The alarm buttons remain LOCKED! Your only path forward is through this game, which you just failed! AGAIN!!',
    '🔥 GAME OVER!! The sockbombs DEFEATED you!! The universe has noted this additional failure in your already impressively long file! The alarm continues! The buttons remain locked! Pick yourself up!! TRY AGAIN!! It\'s really not that hard!!',
    '🌋 L O S T. To a browser game. Designed to be beatable. By YOU. The chaos is nourished by this development. The alarm screams on. You must try again. This is your journey now. A journey that includes this mini-game apparently.'
  ]);
};

module.exports = {
  generateCompletionMessage,
  generateSnoozeMessage,
  generateIgnoreMessage,
  generateMissedDeadlineMessage,
  generateMissedAlarmMessage,
  generateTaskCreatedMessage,
  generateChaosLockMessage,
  generateSockbombWinMessage,
  generateSockbombLoseMessage
};
