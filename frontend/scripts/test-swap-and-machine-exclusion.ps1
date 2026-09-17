$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Starting workout without weigh-in..."
agent-browser eval "document.querySelector('button.btn.ghost')?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\workout_running_active.png"

Write-Host "2. Clicking Quick Swap on the first workout exercise..."
agent-browser eval "document.querySelector('button[aria-label=\'Swap exercise\']')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_swap_modal_rendered.png"

Write-Host "3. Clicking 'Filter & Swap' in ExerciseSwapModal..."
agent-browser eval "document.querySelector('button.btn.danger')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\workout_after_machine_swap.png"

Write-Host "4. Opening Library and inspecting a machine exercise..."
agent-browser eval "location.hash = '#/library'"
Start-Sleep -Milliseconds 1000

# Open second exercise in library (which will be a machine or barbell)
agent-browser eval "const items = document.querySelectorAll('.list .item'); for(let it of items) { if(it.textContent.includes('Machine') || it.textContent.includes('Barbell') || it.textContent.includes('Cable')) { it.click(); break; } }"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_detail_machine_sheet.png"

Write-Host "5. Clicking 'I don't have this machine' in ExerciseDetail..."
agent-browser eval "document.querySelector('button[style*=\'rgba(255, 69, 58\']')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\exercise_detail_after_exclusion.png"

# Close sheet
agent-browser eval "document.querySelector('.sheet button')?.click() || document.querySelector('.mback')?.click()"
Start-Sleep -Milliseconds 600
agent-browser screenshot "$artDir\library_banner_absent_machines.png"

Write-Host "6. Checking Settings Training & Equipment..."
agent-browser eval "location.hash = '#/settings'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\settings_absent_machines_with_restore.png"

Write-Host "Done test-swap-and-machine-exclusion!"
