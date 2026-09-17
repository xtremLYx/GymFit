$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Resetting storage and opening app..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 800
agent-browser eval "localStorage.clear(); location.reload()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\onboarding_step1_fresh.png"

Write-Host "2. Clicking 2nd option (Save Progress & Sync / Google Auth)..."
agent-browser eval "document.querySelectorAll('.card.selectable')[1]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_google_auth_modal.png"

Write-Host "3. Dismissing Google Auth modal..."
agent-browser eval "document.querySelectorAll('.sheet button')?.[1]?.click()"
Start-Sleep -Milliseconds 600

Write-Host "4. Continuing to Step 2 (Environment)..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_step2_env.png"

Write-Host "5. Verifying Commercial Gym skips equipment selection and goes directly to Step 4..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_commercial_skipped_to_routine.png"

Write-Host "6. Clicking Back to test Home equipment flow..."
agent-browser eval "document.querySelectorAll('button.btn')?.[0]?.click()"
Start-Sleep -Milliseconds 800

Write-Host "7. Selecting Home / Free Weights..."
agent-browser eval "document.querySelector('[data-env=\'home\']')?.click()"
Start-Sleep -Milliseconds 500
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_home_step3_eq.png"

Write-Host "8. Going back and re-selecting Commercial Gym..."
agent-browser eval "document.querySelectorAll('button.btn')?.[0]?.click()"
Start-Sleep -Milliseconds 800
agent-browser eval "document.querySelector('[data-env=\'gym\']')?.click()"
Start-Sleep -Milliseconds 500
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800

Write-Host "9. Selecting Custom Routine..."
agent-browser eval "document.querySelector('[data-split=\'custom\']')?.click()"
Start-Sleep -Milliseconds 600
agent-browser screenshot "$artDir\onboarding_custom_selected.png"

Write-Host "10. Completing setup with Custom Routine..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\home_with_create_custom_btn.png"

Write-Host "11. Clicking 'Create Custom Routine' on Home screen..."
agent-browser eval "document.querySelectorAll('button.btn.primary')[0]?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\plan_builder_opened_from_home.png"

Write-Host "Done!"
