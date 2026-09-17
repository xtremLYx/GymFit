$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\a32845ba-9b65-41a9-acd7-4968dbe36f6f"

Write-Host "1. Navigating to Exercises page..."
agent-browser open "http://localhost:5173/#/exercises"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\exercises_clean_view.png"

Write-Host "2. Opening Exercise Filter Modal..."
agent-browser eval "document.querySelector('.filter-trigger-btn')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_filter_sheet_open.png"

Write-Host "3. Selecting multiple filters..."
$selectCode = @'
const pills = Array.from(document.querySelectorAll('.filter-pill'));
const chest = pills.find(p => p.textContent.toLowerCase().trim() === 'chest');
const back = pills.find(p => p.textContent.toLowerCase().trim() === 'back');
const dumbbell = pills.find(p => p.textContent.toLowerCase().trim() === 'dumbbell');
const cable = pills.find(p => p.textContent.toLowerCase().trim() === 'cable');

if (chest) chest.click();
if (back) back.click();
if (dumbbell) dumbbell.click();
if (cable) cable.click();
'@
agent-browser eval "$selectCode"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercise_filter_multi_selected.png"

Write-Host "4. Applying filters and verifying active pills..."
agent-browser eval "document.querySelector('.filter-sheet-footer button')?.click()"
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\exercises_filtered_with_chips.png"

Write-Host "5. Navigating to Stats page with centered circular calendar..."
agent-browser open "http://localhost:5173/#/stats"
Start-Sleep -Milliseconds 1200
agent-browser screenshot "$artDir\stats_month_calendar_clean.png"

Write-Host "6. Opening All Year Report..."
agent-browser eval "document.querySelector('.month-cal-year-btn')?.click()"
Start-Sleep -Milliseconds 1000
agent-browser screenshot "$artDir\stats_year_report_final.png"

Write-Host "All tests completed!"
