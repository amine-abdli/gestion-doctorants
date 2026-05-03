# PowerShell script to convert .doc to .docx using Word COM object
$sourcePath = "C:\Users\amine\Desktop\stage en fst bm\fstbm-backend\storage\app\Prénom NOM (1).docx"
$outputPath = "C:\Users\amine\Desktop\stage en fst bm\fstbm-backend\storage\app\invitation_template.docx"

Write-Host "Converting template from .doc to .docx format..."
Write-Host "Source: $sourcePath"
Write-Host "Output: $outputPath"

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0  # wdAlertsNone
    
    $doc = $word.Documents.Open($sourcePath)
    
    # Save as .docx format (16 = wdFormatXMLDocument)
    $doc.SaveAs([ref]$outputPath, [ref]16)
    
    $doc.Close()
    $word.Quit()
    
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    
    Write-Host "Conversion successful!"
    Write-Host "New file size: $((Get-Item $outputPath).Length) bytes"
    
    # Verify it's a valid ZIP/docx
    $bytes = [System.IO.File]::ReadAllBytes($outputPath)
    if ($bytes[0] -eq 0x50 -and $bytes[1] -eq 0x4B) {
        Write-Host "Verification: Valid .docx (ZIP) format confirmed!"
    } else {
        Write-Host "WARNING: File does not appear to be valid .docx format"
    }
} catch {
    Write-Host "Error: $_"
    Write-Host "Make sure Microsoft Word is installed and the template file is not open in Word."
}
