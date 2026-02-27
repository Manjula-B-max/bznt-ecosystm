$file = 'c:\Users\bhuja\Downloads\bezent\bezent\client\app.js'
$content = [System.IO.File]::ReadAllText($file)

$content = $content.Replace('<table class="w-full text-sm min-w-[800px]">', '<table class="w-full text-sm" style="min-width: 800px;">')
$content = $content.Replace('<table class="w-full text-sm border-collapse min-w-[800px]">', '<table class="w-full text-sm border-collapse" style="min-width: 800px;">')
$content = $content.Replace('<table class="w-full text-sm min-w-[1000px]">', '<table class="w-full text-sm" style="min-width: 1050px;">')

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Table inline styles applied"
