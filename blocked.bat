@echo off
set historyFile="%USERPROFILE%\AppData\Local\Google\Chrome\User Data\Default\History"
set sqlitePath=sqlite3.exe
set sqliteDownloadURL=https://www.sqlite.org/2024/sqlite-tools-win-x64-3470200.zip
set tempZipFile=sqlite-tools.zip

if not exist %historyFile% (
    echo Chrome history file not found! Ensure Chrome is installed and close it if running.
    pause
    exit /b
)

if not exist %sqlitePath% (
    echo SQLite3 is not found in the current directory.
    echo Downloading SQLite3...

    curl -o %tempZipFile% %sqliteDownloadURL%
    if not exist %tempZipFile% (
        echo Failed to download SQLite3. Please check your internet connection.
        pause
        exit /b
    )
    
    echo Download complete. Extracting SQLite3...
    powershell -Command "Expand-Archive -Path '%tempZipFile%' -DestinationPath . -Force"
    
    for /r %%f in (sqlite3.exe) do (
        copy "%%f" .
        goto :sqlite_found
    )
    echo SQLite3.exe not found in the extracted files. Please extract manually.
    pause
    exit /b
    
    :sqlite_found
    echo SQLite3 successfully downloaded and extracted.
)

echo Checking if Google Chrome is running...
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I "chrome.exe" >NUL

if %ERRORLEVEL%==0 (
    echo Google Chrome is running. Closing Chrome...
    taskkill /f /im chrome.exe
    timeout /t 3 /nobreak
) else (
    echo Google Chrome is not running. No need to close it.
)

echo Extracting Chrome history...
%sqlitePath% %historyFile% "SELECT url, title, last_visit_time FROM urls ORDER BY last_visit_time DESC LIMIT 100;" > ChromeHistory.txt

if exist ChromeHistory.txt (
    echo Chrome history extracted successfully!
    echo Close notepad to quit.
    notepad ChromeHistory.txt
) else (
    echo Failed to extract Chrome history.
)
