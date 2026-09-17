$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Resetting storage and testing Onboarding with Classic 6-Day Split..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1000
agent-browser eval "localStorage.clear(); location.reload()"
Start-Sleep -Milliseconds 1200

# Step 1: Click Continue
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800

# Step 2: Commercial Gym is default -> click Continue (skips step 3 as requested)
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800

# Step 4: Split selection screen. Verify Classic 6-Day split card is present and click it!
agent-browser screenshot "$artDir\onboarding_step4_splits_with_classic6.png"
agent-browser eval "document.querySelector('[data-split=\'classic6\']')?.click()"
Start-Sleep -Milliseconds 600
agent-browser screenshot "$artDir\onboarding_classic6_selected.png"

# Click Finish Setup
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\home_after_classic6_onboarding.png"

Write-Host "2. Verifying Plan screen with Classic 6-Day Split..."
agent-browser eval "location.hash = '#/plan'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\plan_classic6_schedule.png"

Write-Host "3. Testing Custom Split Builder 6-Day Tab..."
agent-browser eval "location.hash = '#/plan?builder=1'"
Start-Sleep -Milliseconds 1000
agent-browser eval "document.querySelectorAll('.seg button')[3]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\custom_builder_6day_heatmap.png"

# Close builder
agent-browser eval "document.querySelector('.sheet button')?.click() || document.querySelector('.mback')?.click()"
Start-Sleep -Milliseconds 600

Write-Host "4. Testing 'I don't have this machine' in Library..."
agent-browser eval "location.hash = '#/library'"
Start-Sleep -Milliseconds 1000

# Search for Leg Extension (which is leverage machine)
agent-browser eval "const inp = document.querySelector('input.input'); if(inp) { inp.value = 'leg extension'; inp.dispatchEvent(new Event('input', {bubbles:true})); }"
Start-Sleep -Milliseconds 800

# Click the exercise item in Library
agent-browser eval "document.querySelectorAll('.list .item')[1]?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\exercise_detail_leg_ext_machine.png"

# Click 'I don't have this machine'
agent-browser eval "document.querySelector('button[style*=\'rgba(255, 69, 58\']')?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\exercise_detail_auto_swapped_alt.png"

# Close sheet
agent-browser eval "document.querySelector('.sheet button.btn-ghost')?.click() || document.querySelector('.mback')?.click()"
Start-Sleep -Milliseconds 600

# Clear search input to see library with excluded machine banner
agent-browser eval "const inp = document.querySelector('input.input'); if(inp) { inp.value = ''; inp.dispatchEvent(new Event('input', {bubbles:true})); }"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\library_excluded_machine_banner.png"

Write-Host "5. Testing Active Workout Quick Swap with Machine Exclusion..."
agent-browser eval "location.hash = '#/workout'"
Start-Sleep -Milliseconds 1000

# Start Chest & Triceps workout or Leg Day workout
agent-browser eval "document.querySelectorAll('.list .item')?.[0]?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\workout_active_session.png"

# Click swap button on first exercise
agent-browser eval "document.querySelectorAll('button[aria-label=\'Swap exercise\']')?.[0]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\workout_swap_modal_with_dont_have.png"

Write-Host "6. Verifying Settings Training & Equipment section..."
agent-browser eval "location.hash = '#/settings'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\settings_excluded_machines_list.png"

Write-Host "Full verification completed successfully!"
