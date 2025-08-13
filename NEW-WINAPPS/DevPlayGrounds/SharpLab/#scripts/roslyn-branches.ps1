Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

$MatricesPath = './!matrices.txt'

Push-Location "$PSScriptRoot/roslyn-branches"
try {
    npm run check
    
    if (Test-Path $MatricesPath) {
        Remove-Item $MatricesPath
    }
    $env:GITHUB_OUTPUT=$MatricesPath

    npm run generate-matrix
    $matrices = Get-Content $MatricesPath -Raw
    $matrices -match 'update=(.+)' | Out-Null; $update = (ConvertFrom-Json $matches[1]).include
    $matrices -match 'cleanup=(.+)' | Out-Null; $cleanup = (ConvertFrom-Json $matches[1]).include

    $update
    $cleanup

    # TODO: new processing

    <#
    $matrix.include | % {
        $row = $_
        try {
            npm run build-branch -- $row.branch
        }
        catch {
            if (!$row.required) {
                Write-Warning "Branch $($row.branch) failed: $_"
                return
            }
            Write-Error "Branch $($row.branch) failed: $_"
        }
    }#>
}
finally {
    Pop-Location
}