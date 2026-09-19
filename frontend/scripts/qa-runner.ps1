$ErrorActionPreference = "Continue"
$reportDir = "C:\Users\goura\OneDrive\Desktop\habbits\opengym\.gstack\qa-reports"
$shotsDir = "$reportDir\screenshots"

if (-not (Test-Path $shotsDir)) {
    New-Item -ItemType Directory -Path $shotsDir -Force | Out-Null
}

Write-Host "========================================="
Write-Host "  Starting GymFit Automated QA Test Suite"
Write-Host "========================================="

Write-Host "`n[Phase 1] Resetting storage and opening application..."
agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1200
agent-browser eval "localStorage.clear(); location.reload()"
Start-Sleep -Milliseconds 1500

Write-Host "`n[Phase 2] Welcome / Onboarding..."
agent-browser screenshot "$shotsDir\01-onboarding-welcome.png"

# Click Continue on Step 1 (Guest Mode)
Write-Host "Clicking Continue (Guest Mode)..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\02-onboarding-env.png"

# Click Continue on Step 2 (Commercial Gym)
Write-Host "Clicking Continue (Commercial Gym)..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\03-onboarding-routine.png"

# Click Start Training on Step 4 (Routines)
Write-Host "Clicking Start Training..."
agent-browser eval "document.querySelector('button.btn.primary')?.click()"
Start-Sleep -Milliseconds 1500

Write-Host "`n[Phase 3] Verifying Home Screen (Fresh State)..."
agent-browser screenshot "$shotsDir\04-home-fresh-state.png"

# Test Mobile Viewport (375x812)
Write-Host "Testing Mobile Viewport (375x812)..."
agent-browser set viewport 375 812
Start-Sleep -Milliseconds 600
agent-browser screenshot "$shotsDir\05-home-mobile.png"
agent-browser set viewport 1280 800
Start-Sleep -Milliseconds 600

Write-Host "`n[Phase 4] Verifying Plan Screen..."
agent-browser eval "location.hash = '#/plan'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\06-plan-view.png"

Write-Host "`n[Phase 5] Verifying Stats & Year Report Month Drilldown..."
agent-browser eval "location.hash = '#/stats'"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$shotsDir\07-stats-fresh-state.png"

# Click All Year Report
Write-Host "Opening All Year Report sheet (Full Year Overview)..."
agent-browser eval "document.querySelector('.month-cal-year-btn')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\08-year-report-modal.png"

# Click January month card / bar
Write-Host "Drilling down into January..."
agent-browser eval "document.querySelectorAll('.year-month-card')[0]?.click() || document.querySelectorAll('.year-bar-col')[0]?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\09-year-report-jan-drilldown.png"

# Click 'Open in Calendar' from January drilldown
Write-Host "Clicking Open in Calendar from January drilldown..."
agent-browser eval "Array.from(document.querySelectorAll('.sheet button')).find(b => b.textContent.includes('Calendar'))?.click()"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$shotsDir\10-calendar-jumped-to-jan.png"

Write-Host "`n[Phase 6] Verifying Exercises Library..."
agent-browser eval "location.hash = '#/library'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\11-exercises-library.png"

# Search for Bench
Write-Host "Searching for Bench..."
agent-browser eval "var inp = document.querySelector('input[type=\"search\"], input[placeholder*=\"Search\"], input'); if (inp) { inp.value = 'Bench'; inp.dispatchEvent(new Event('input', { bubbles: true })); }"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$shotsDir\12-exercises-search-bench.png"

# Click first search result
Write-Host "Opening Exercise Detail for Bench Press..."
agent-browser eval "document.querySelector('.list .item, .ex-item, .card.selectable')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\13-exercise-detail-sheet.png"

# Close Sheet
agent-browser eval "document.querySelector('.sheet button.iconbtn, .sheet .mclose, .mback')?.click()"
Start-Sleep -Milliseconds 600

Write-Host "`n[Phase 7] Verifying Settings Screen..."
agent-browser eval "location.hash = '#/settings'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\14-settings-guest-mode.png"

Write-Host "`n[Phase 8] Verifying History Screen (Clean Empty State)..."
agent-browser eval "location.hash = '#/history'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\15-history-empty-state.png"

Write-Host "`n[Phase 9] End-to-End Workout Flow..."
agent-browser eval "location.hash = '#/workout'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\16-start-workout-chooser.png"

# Start Workout (on rest day or regular day, click routine item)
Write-Host "Starting Workout (Push Day)..."
agent-browser eval "document.querySelector('.narrow .card .btn.primary, .narrow .list .item, .narrow .item')?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$shotsDir\17-quick-checkin-sheet.png"

# Confirm Quick Check-in
Write-Host "Confirming Quick check-in..."
agent-browser eval "Array.from(document.querySelectorAll('.sheet button')).find(b => b.textContent.includes('Save & start') || b.textContent.includes('Start without'))?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$shotsDir\18-workout-active.png"

# Log / Check off Set 1
Write-Host "Checking off Set 1..."
agent-browser eval "document.querySelector('button.chk, .chk, input[type=\"checkbox\"], .check-btn, .set-row .check')?.click() || document.querySelector('[aria-label=\"Check\"], .check')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\19-workout-set1-checked.png"

# Click Finish Workout
Write-Host "Clicking Finish Workout..."
agent-browser eval "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Finish workout'))?.click()"
Start-Sleep -Milliseconds 1000

# Confirm finish in .center dialog
Write-Host "Confirming finish in dialog..."
agent-browser eval "document.querySelector('.center .btn.danger, .center .btn.primary, .center button')?.click()"
Start-Sleep -Milliseconds 1500
agent-browser screenshot "$shotsDir\20-workout-completed-summary.png"

# Dismiss summary sheet / return
Write-Host "Dismissing summary modal..."
agent-browser eval "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nice'))?.click() || document.querySelector('.center .btn.primary, .center button, .mback')?.click()"
Start-Sleep -Milliseconds 1200

Write-Host "`n[Phase 10] Post-Workout Verification (History & Stats)..."
agent-browser eval "location.hash = '#/history'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\21-history-one-workout-logged.png"

agent-browser eval "location.hash = '#/stats'"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\22-stats-one-workout-logged.png"

# Open Year report with new workout
Write-Host "Verifying Year Report with completed workout..."
agent-browser eval "document.querySelector('.month-cal-year-btn')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$shotsDir\23-year-report-with-workout.png"

Write-Host "`n[Phase 11] Checking JavaScript Console Errors..."
$errs = agent-browser errors
Write-Host "Console errors output:"
Write-Host $errs
$errs | Out-File -FilePath "$reportDir\console-errors.txt" -Encoding utf8

Write-Host "`n========================================="
Write-Host "  QA Test Suite Complete! All shots saved."
Write-Host "========================================="
