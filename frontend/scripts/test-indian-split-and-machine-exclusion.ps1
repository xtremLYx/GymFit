$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Opening app and loading Classic 6-Day Split..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1000

# Open Custom Split Builder from Plan
agent-browser eval "location.hash = '#/plan?builder=1'"
Start-Sleep -Milliseconds 1000

# Click the 6-Day Classic split tab (the 4th button in the .seg control)
agent-browser eval "document.querySelectorAll('.seg button')[3]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\custom_plan_builder_6day_classic.png"

# Apply the 6-day split
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\plan_with_6day_routines.png"

Write-Host "2. Testing 'I don't have this machine' in ExerciseDetail..."
# Navigate to Library
agent-browser eval "location.hash = '#/library'"
Start-Sleep -Milliseconds 1000

# Search for Leg Extension
agent-browser eval "const inp = document.querySelector('input.input'); if(inp) { inp.value = 'leg extension'; inp.dispatchEvent(new Event('input', {bubbles:true})); }"
Start-Sleep -Milliseconds 600

# Click the first exercise item in Library
agent-browser eval "document.querySelectorAll('.list .item')[1]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_detail_with_dont_have_machine.png"

# Click 'I don't have this machine' button
agent-browser eval "document.querySelector('button[style*=\'rgba(255, 69, 58\']')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\exercise_detail_swapped_to_alternative.png"

# Close sheet and verify Library banner
agent-browser eval "document.querySelector('.mback')?.click() || document.querySelector('.sheet button')?.click()"
Start-Sleep -Milliseconds 600
agent-browser screenshot "$artDir\library_with_excluded_banner.png"

Write-Host "3. Testing Settings Equipment management..."
agent-browser eval "location.hash = '#/settings'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\settings_equipment_excluded.png"

Write-Host "Verification script completed successfully!"
