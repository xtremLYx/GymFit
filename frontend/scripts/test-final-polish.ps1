$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Navigating to Library..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1000

agent-browser eval "
  localStorage.setItem('gym_guest', '1');
  const s = JSON.parse(localStorage.getItem('gym_state_v1') || '{}');
  s.onboardingDone = true;
  localStorage.setItem('gym_state_v1', JSON.stringify(s));
  location.hash = '#/library';
  location.reload();
"
Start-Sleep -Milliseconds 1500

# Open Assisted Pull-Up detail sheet
agent-browser eval "
  const grows = Array.from(document.querySelectorAll('.list .item .grow'));
  const assisted = grows.find(g => g.textContent.includes('Assisted Pull-Up'));
  if (assisted) assisted.click();
"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\exercise_detail_machine_with_button.png"

# Click 'I don't have this machine'
agent-browser eval "
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('I don\'t have this machine'));
  if (btn) btn.click();
"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\exercise_detail_swapped_to_pullup.png"

# Close sheet
agent-browser eval "document.querySelector('.sheet button')?.click() || document.querySelector('.mback')?.click()"
Start-Sleep -Milliseconds 600
agent-browser screenshot "$artDir\library_banner_absent_machines_visible.png"

# Check Settings to view the excluded machine item and restore button
agent-browser eval "location.hash = '#/settings'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\settings_absent_machines_row.png"

Write-Host "Done test-final-polish!"
