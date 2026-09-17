Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\bicep-option-2.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Icon($size, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($img, 0, 0, $size, $size)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outPath ($size x $size)"
}

Resize-Icon 512 "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\icon-512.png"
Resize-Icon 192 "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\icon-192.png"
Resize-Icon 180 "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\icon-180.png"
Resize-Icon 64  "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\favicon-64.png"
Resize-Icon 32  "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\favicon-32.png"
Resize-Icon 32  "c:\Users\goura\OneDrive\Desktop\habbits\opengym\frontend\public\favicon.png"

$img.Dispose()
Write-Host "All icons generated successfully!"
