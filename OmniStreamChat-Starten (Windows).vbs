Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
exePath = dir & "\dist\OmniStreamChat-win32-x64\OmniStreamChat.exe"
If fso.FileExists(exePath) Then
  WshShell.Run """" & exePath & """", 1, False
Else
  WshShell.Run "cmd /c cd /d """ & dir & """ && npx electron .", 0, False
End If
