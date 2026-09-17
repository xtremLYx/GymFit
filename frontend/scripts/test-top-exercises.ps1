$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\a32845ba-9b65-41a9-acd7-4968dbe36f6f"

Write-Host "1. Opening app at http://localhost:5173..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1500

Write-Host "2. Setting up gym_guest=1 and gym_state_v1 with onboardingDone and test routine..."
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
Start-Sleep -Milliseconds 2500

Write-Host "3. Taking screenshot of RoutineEdit view..."
agent-browser screenshot "$artDir\top_ex_step0_routine_edit.png"

Write-Host "4. Clicking 'Add exercise' button..."
agent-browser eval @"
(function() {
  const btns = Array.from(document.querySelectorAll('button'));
  const addBtn = btns.find(b => b.textContent.includes('Add exercise') || b.textContent.includes('Add Exercise'));
  if (addBtn) addBtn.click();
})()
"@
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\top_ex_step1_categories.png"

Write-Host "5. Clicking Chest category card..."
agent-browser eval @"
(function() {
  const catCards = Array.from(document.querySelectorAll('.muscle-cat-card'));
  const chestCard = catCards.find(c => c.textContent.includes('Chest'));
  if (chestCard) chestCard.click();
})()
"@
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\top_ex_step2_chest_top20.png"

Write-Host "6. Scrolling down to show transition to All Chest Exercises..."
agent-browser eval @"
(function() {
  const sheet = document.querySelector('.sheet-body') || document.querySelector('.sheet') || document.querySelector('.modal');
  if (sheet) {
    sheet.scrollTop = 800;
  }
})()
"@
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\top_ex_step3_chest_transition.png"

Write-Host "7. Clicking Dumbbell equipment chip..."
agent-browser eval @"
(function() {
  const sheet = document.querySelector('.sheet-body') || document.querySelector('.sheet') || document.querySelector('.modal');
  if (sheet) {
    sheet.scrollTop = 0;
  }
  const chips = Array.from(document.querySelectorAll('.chip'));
  const dbChip = chips.find(c => c.textContent.trim().toLowerCase() === 'dumbbell');
  if (dbChip) dbChip.click();
})()
"@
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\top_ex_step4_chest_dumbbell_filtered.png"

Write-Host "8. Navigating back to All Muscle Groups and clicking Legs -> Upper Legs..."
agent-browser eval @"
(function() {
  const backBtn = document.querySelector('.ecp-back-btn');
  if (backBtn) backBtn.click();
})()
"@
Start-Sleep -Milliseconds 800

agent-browser eval @"
(function() {
  const catCards = Array.from(document.querySelectorAll('.muscle-cat-card'));
  const legsCard = catCards.find(c => c.textContent.includes('Legs'));
  if (legsCard) legsCard.click();
})()
"@
Start-Sleep -Milliseconds 800

agent-browser eval @"
(function() {
  const subCards = Array.from(document.querySelectorAll('.muscle-cat-card'));
  const upperLegsCard = subCards.find(c => c.textContent.includes('Upper Legs'));
  if (upperLegsCard) upperLegsCard.click();
})()
"@
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\top_ex_step5_upper_legs_top20.png"

Write-Host "Finished all test steps!"
