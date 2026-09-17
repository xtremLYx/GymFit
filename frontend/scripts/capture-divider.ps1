$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\a32845ba-9b65-41a9-acd7-4968dbe36f6f"

agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1500

agent-browser eval @"
(function() {
  localStorage.setItem('gym_guest', '1');
  const def = {
    unit: 'kg', restSec: 90, sound: true, keepAwake: true, lang: 'en',
    theme: 'dark', accent: 'lime', body: 'male', targetW: null,
    bodyweight: [], week: {}, dayPlan: {},
    exWeights: {}, workouts: [], active: null, customEx: [], gifSize: 'full',
    reminder: { on: false, time: '08:00', tz: null }, effort: null,
    coach: null,
    equipment: ['barbell', 'dumbbell', 'cable', 'body weight', 'leverage machine', 'sled machine'],
    excludedEquipment: [],
    environment: 'gym',
    experienceLevel: 'intermediate',
    onboardingDone: true,
    libraryMode: 'all',
    routines: [
      {
        id: 'rt_push',
        name: 'Push Hypertrophy',
        emoji: '🔥',
        prog: 'linear',
        ex: []
      }
    ]
  };
  localStorage.setItem('gym_state_v1', JSON.stringify(def));
  location.hash = '#/plan/r/rt_push';
  location.reload();
})()
"@
Start-Sleep -Milliseconds 2200

agent-browser eval @"
(function() {
  const btns = Array.from(document.querySelectorAll('button'));
  const addBtn = btns.find(b => b.textContent.includes('Add exercise') || b.textContent.includes('Add Exercise'));
  if (addBtn) addBtn.click();
})()
"@
Start-Sleep -Milliseconds 1000

agent-browser eval @"
(function() {
  const catCards = Array.from(document.querySelectorAll('.muscle-cat-card'));
  const chestCard = catCards.find(c => c.textContent.includes('Chest'));
  if (chestCard) chestCard.click();
})()
"@
Start-Sleep -Milliseconds 1000

agent-browser eval @"
(function() {
  const items = Array.from(document.querySelectorAll('.exercise-category-picker .item'));
  if (items.length > 20) {
    items[20].scrollIntoView({ behavior: 'instant', block: 'center' });
  }
})()
"@
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\top_ex_step6_divider_centered.png"
Write-Host "Captured divider centered!"
