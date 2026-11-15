@echo off
echo ==========================================================
echo Granting Permissions & Syncing to D:\massage...
echo ==========================================================
icacls "D:\massage" /grant Everyone:(OI)(CI)F /T
xcopy /E /I /Y "D:\coding\massage\*" "D:\massage\"
echo Done! Project files are now synced to D:\massage.
pause

