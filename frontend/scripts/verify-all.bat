@echo off
set "ARTDIR=C:\Users\goura\.gemini\antigravity-ide\brain\a32845ba-9b65-41a9-acd7-4968dbe36f6f"

agent-browser open http://localhost:5173 ^
&& agent-browser wait 1000 ^
&& agent-browser eval "const td = new Date(), y = td.getFullYear(), mo = String(td.getMonth() + 1).padStart(2, '0'); const ws = []; [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28].forEach((d, i) => ws.push({ id: 'w' + i, d: y + '-' + mo + '-' + String(d).padStart(2, '0'), start: Date.now() - (30 - d) * 86400000, end: Date.now() - (30 - d) * 86400000 + 3600000, name: i % 2 === 0 ? 'Upper Body Push' : 'Lower Body Strength', vol: 8500 + i * 400, entries: [{ id: '0025', n: 'bench press', sets: [{ done: true, w: 80, r: 8 }] }] })); const pmo = String(td.getMonth() === 0 ? 12 : td.getMonth()).padStart(2, '0'); const py = td.getMonth() === 0 ? y - 1 : y; [3, 7, 12, 16, 21, 25].forEach((d, i) => ws.push({ id: 'pw' + i, d: py + '-' + pmo + '-' + String(d).padStart(2, '0'), start: Date.now() - (60 - d) * 86400000, end: Date.now() - (60 - d) * 86400000 + 3600000, name: 'Full Body', vol: 7500, entries: [{ id: '0025', n: 'bench press', sets: [{ done: true, w: 75, r: 8 }] }] })); localStorage.setItem('gym_guest', '1'); localStorage.setItem('gym_state_v1', JSON.stringify({ unit: 'kg', theme: 'dark', accent: 'pink', onboardingDone: true, workouts: ws, routines: [], bodyweight: [] })); location.hash = '#/stats'; location.reload();" ^
&& agent-browser wait 1500 ^
&& agent-browser screenshot "%ARTDIR%\stats_month_calendar_clean.png" ^
&& agent-browser eval "document.querySelector('.month-cal-year-btn')?.click()" ^
&& agent-browser wait 1000 ^
&& agent-browser screenshot "%ARTDIR%\stats_year_report_final.png"
