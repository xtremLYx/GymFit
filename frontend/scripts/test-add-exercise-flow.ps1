$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\b46a565e-f87d-43de-b56d-a513051e1077"

Write-Host "1. Opening app..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1500

Write-Host "2. Checking onboarding / completing if needed..."
for ($i = 0; $i -lt 5; $i++) {
    $isOnboarding = agent-browser eval "document.querySelector('.onboarding-wrap') !== null"
    Write-Host "Is onboarding present: $isOnboarding"
    if ($isOnboarding -like "*true*") {
        Write-Host "Clicking primary button in onboarding (step $i)..."
        agent-browser eval "document.querySelector('.onboarding-wrap button.btn.primary')?.click()"
        Start-Sleep -Milliseconds 1000
    } else {
        break
    }
}

Start-Sleep -Milliseconds 1000
Write-Host "3. Navigating to Plan page via hash..."
agent-browser eval "location.hash = '#/plan'"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step2_plan.png"

Write-Host "4. Clicking Push Day routine card..."
agent-browser eval "Array.from(document.querySelectorAll('.tt')).find(el => el.textContent === 'Push Day')?.closest('.item')?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step3_routine_edit.png"

Write-Host "5. Clicking 'Add exercise' button..."
agent-browser eval "Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add exercise'))?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step4_picker_categories.png"

Write-Host "6. Clicking on 'Chest' muscle group card..."
agent-browser eval "Array.from(document.querySelectorAll('.muscle-cat-card')).find(c => c.textContent && c.textContent.includes('Chest'))?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step5_chest_exercises.png"

Write-Host "7. Clicking instant add button on first non-added exercise..."
agent-browser eval "document.querySelector('.exercise-category-picker .ecp-add-btn:not(.added)')?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\step6_instant_added_chest.png"

Write-Host "8. Clicking next non-added exercise ROW to open details..."
agent-browser eval "Array.from(document.querySelectorAll('.exercise-category-picker .list .item')).find(el => !el.querySelector('.ecp-add-btn.added'))?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step7_details_config_open.png"

Write-Host "9. Clicking 'Add to routine' in details sheet..."
agent-browser eval "Array.from(document.querySelectorAll('.sheet button.btn.primary')).find(b => b.textContent && b.textContent.includes('Add to routine'))?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step8_returned_to_chest_page.png"

Write-Host "10. Clicking 'Done' button in picker..."
agent-browser eval "document.querySelector('.ecp-done-btn')?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$artDir\step9_routine_with_both_exercises.png"

Write-Host "Verification complete!"
