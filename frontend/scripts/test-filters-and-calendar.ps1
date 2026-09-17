$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\a32845ba-9b65-41a9-acd7-4968dbe36f6f"

Write-Host "1. Initializing test data with workouts..."
$seedCode = Get-Content "scripts\seed-browser.js" -Raw

agent-browser open "http://localhost:5173"
Start-Sleep -Milliseconds 1200

agent-browser eval "$seedCode"
Start-Sleep -Milliseconds 1500

Write-Host "2. Capturing Exercises clean view without cluttering chips..."
agent-browser open "http://localhost:5173/#/exercises"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\exercises_clean_view.png"

Write-Host "3. Opening Exercise Filter Modal..."
agent-browser eval "document.querySelector('.filter-trigger-btn')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_filter_sheet_open.png"

Write-Host "4. Selecting Multiple Filters (Chest + Back, Cable + Dumbbell)..."
$filterSelectCode = @'
const pills = Array.from(document.querySelectorAll('.filter-pill'));
const chest = pills.find(p => p.textContent.toLowerCase().includes('chest'));
const back = pills.find(p => p.textContent.toLowerCase().includes('back'));
const dumbbell = pills.find(p => p.textContent.toLowerCase().includes('dumbbell'));
const cable = pills.find(p => p.textContent.toLowerCase().includes('cable'));

if (chest) chest.click();
if (back) back.click();
if (dumbbell) dumbbell.click();
if (cable) cable.click();
'@
agent-browser eval "$filterSelectCode"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_filter_multi_selected.png"

Write-Host "5. Applying filters..."
agent-browser eval "document.querySelector('.filter-sheet-footer button')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercises_filtered_with_chips.png"

Write-Host "6. Navigating to Stats page with new Month Calendar..."
agent-browser open "http://localhost:5173/#/stats"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\stats_month_calendar_clean.png"

Write-Host "7. Clicking on a completed workout day..."
$clickDayCode = @'
const cells = Array.from(document.querySelectorAll('.month-cal-cell.done'));
if (cells.length > 2) cells[2].click();
'@
agent-browser eval "$clickDayCode"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\stats_day_workout_detail.png"

Write-Host "8. Dismissing workout detail and opening All Year Report..."
agent-browser eval "document.querySelector('.sheet-backdrop')?.click() || document.querySelector('.sheet button')?.click()"
Start-Sleep -Milliseconds 500

agent-browser eval "document.querySelector('.month-cal-year-btn')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\stats_all_year_report_matrix.png"

Write-Host "9. Switching Year Report to 52-Week Heatmap tab..."
$switchTabCode = @'
const segBtns = Array.from(document.querySelectorAll('.seg button'));
if (segBtns.length > 1) segBtns[1].click();
'@
agent-browser eval "$switchTabCode"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\stats_year_report_heatmap_tab.png"

Write-Host "Done testing!"
