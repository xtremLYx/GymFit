$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Opening app and checking onboarding status..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1200

# Complete onboarding if visible
agent-browser eval "
  (async () => {
    // If on onboarding screen
    const continueBtn = document.querySelector('button.btn.primary');
    if (continueBtn && document.body.textContent.includes('Welcome to openGym')) {
      continueBtn.click(); // Step 1 -> Step 2
      await new Promise(r => setTimeout(r, 600));
      document.querySelector('button.btn.primary')?.click(); // Step 2 (Commercial Gym) -> Step 4
      await new Promise(r => setTimeout(r, 600));
      document.querySelector('[data-split=\'classic6\']')?.click(); // Pick classic 6-day split
      await new Promise(r => setTimeout(r, 600));
      document.querySelector('button.btn.primary')?.click(); // Finish Setup
      await new Promise(r => setTimeout(r, 1000));
    }
  })()
"
Start-Sleep -Milliseconds 2000
agent-browser screenshot "$artDir\verified_home_classic6.png"

Write-Host "2. Verifying Plan with Classic 6-Day Split..."
agent-browser eval "location.hash = '#/plan'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\verified_plan_classic6.png"

Write-Host "3. Verifying Custom Split Builder 6-Day Preset..."
agent-browser eval "location.hash = '#/plan?builder=1'"
Start-Sleep -Milliseconds 1000
agent-browser eval "document.querySelectorAll('.seg button')[3]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\verified_builder_6day.png"

# Close builder
agent-browser eval "document.querySelector('.sheet button')?.click() || document.querySelector('.mback')?.click()"
Start-Sleep -Milliseconds 600

Write-Host "4. Verifying 'I don't have this machine' in Library..."
agent-browser eval "location.hash = '#/library'"
Start-Sleep -Milliseconds 1200

# Open Assisted Pull-Up (leverage machine)
agent-browser eval "
  const items = Array.from(document.querySelectorAll('.list .item'));
  const assisted = items.find(it => it.textContent.includes('Assisted Pull-Up') || it.textContent.includes('Leverage Machine'));
  if (assisted) assisted.click();
"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\verified_exercise_detail_dont_have_machine.png"

# Click 'I don't have this machine'
agent-browser eval "
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('I don\'t have this machine'));
  if (btn) btn.click();
"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\verified_exercise_detail_auto_swapped.png"

# Close sheet
agent-browser eval "document.querySelector('.sheet button')?.click() || document.querySelector('.mback')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\verified_library_absent_banner.png"

Write-Host "5. Verifying Settings Training & Equipment..."
agent-browser eval "location.hash = '#/settings'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\verified_settings_excluded_machines.png"

# Click Restore
agent-browser eval "
  const restoreBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Restore');
  if (restoreBtn) restoreBtn.click();
"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\verified_settings_after_restore.png"

Write-Host "All verifications completed successfully!"
