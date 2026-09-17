$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\6cbe0217-fe66-4761-a7dd-bc646c9b2ff6"

Write-Host "1. Opening app..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_step1.png"

Write-Host "2. Step 1 -> Step 2 (Environment)..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_step2.png"

Write-Host "3. Step 2 -> Step 3 (Equipment Multi-Select)..."
agent-browser eval "document.querySelectorAll('button.btn.primary')[0]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_step3.png"

Write-Host "4. Step 3 -> Step 4 (Starter Split & Gemini AI)..."
agent-browser eval "document.querySelectorAll('button.btn.primary')[0]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\onboarding_step4.png"

Write-Host "5. Step 4 -> Complete Setup..."
agent-browser eval "document.querySelectorAll('button.btn.primary')[0]?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\home_screen.png"

Write-Host "6. Navigating to Library..."
agent-browser open "http://localhost:5173/#/library"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\library_essentials.png"

Write-Host "7. Switching to All (1,324 exercises)..."
agent-browser eval "document.querySelectorAll('.seg button')[1]?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\library_all.png"

Write-Host "8. Navigating to Plan & opening Split Builder..."
agent-browser open "http://localhost:5173/#/plan"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\plan_screen.png"

agent-browser eval "document.querySelectorAll('button.btn').forEach(b => { if(b.textContent.includes('Split Builder')) b.click() })"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\split_builder.png"

Write-Host "9. Starting a Workout to test Quick-Swap..."
agent-browser open "http://localhost:5173/#/workout"
Start-Sleep -Milliseconds 1000
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\workout_active.png"

Write-Host "10. Clicking Quick-Swap..."
agent-browser eval "document.querySelector('.quick-swap-btn')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_swap_modal.png"

Write-Host "All browser verification steps completed!"
