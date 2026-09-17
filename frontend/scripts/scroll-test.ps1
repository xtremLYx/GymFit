$artDir = "C:\Users\goura\.gemini\antigravity-ide\brain\a32845ba-9b65-41a9-acd7-4968dbe36f6f"
agent-browser eval @"
(function() {
  const sheet = document.querySelector('.sheet-body') || document.querySelector('.sheet') || document.querySelector('.modal');
  if (sheet) {
    sheet.scrollTop = 1450;
  }
})()
"@
Start-Sleep -Milliseconds 800
agent-browser screenshot "$artDir\top_ex_step6_divider.png"
