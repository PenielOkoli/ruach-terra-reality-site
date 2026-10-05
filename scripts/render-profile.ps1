param(
  [string]$Source = 'C:\Users\DELL\Downloads\RUACH_DREDGING_Company_Profile_Enhanced_Hydraulic_Fill_REVISED.pptx',
  [string]$Destination = 'C:\Dev\ruach-terra-reality-site\artifacts\profile-review\slides'
)

$ErrorActionPreference = 'Stop'
$hadPowerPoint = @(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$openedHere = $false
$application = $null
$presentation = $null
New-Item -ItemType Directory -Path $Destination -Force | Out-Null
try {
  $application = New-Object -ComObject PowerPoint.Application
  foreach ($candidate in $application.Presentations) {
    if ($candidate.FullName -eq $Source) { $presentation = $candidate; break }
  }
  if (-not $presentation) {
    $presentation = $application.Presentations.Open($Source, -1, 0, 0)
    $openedHere = $true
  }
  $width = 1600
  $height = [int]($width * $presentation.PageSetup.SlideHeight / $presentation.PageSetup.SlideWidth)
  foreach ($slide in $presentation.Slides) {
    $target = Join-Path $Destination ('slide-{0:D2}.png' -f $slide.SlideIndex)
    if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite slide preview: $target" }
    $slide.Export($target, 'PNG', $width, $height)
    Write-Output "Rendered slide $($slide.SlideIndex)"
  }
} finally {
  if ($openedHere -and $presentation) { $presentation.Close() }
  if (-not $hadPowerPoint -and $application) { $application.Quit() }
  if ($presentation) { [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($presentation) }
  if ($application) { [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($application) }
}
