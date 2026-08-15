@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
set "PATH=C:\Program Files\Java\jdk-21.0.10\bin;%PATH%"
cd /d "%~dp0backend"
echo Starting Spring Boot Backend on http://localhost:8080 ...
start "Speech-to-Text Backend" cmd /k "set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10" && set "PATH=C:\Program Files\Java\jdk-21.0.10\bin;%%PATH%%" && gradlew.bat bootRun"
timeout /t 8 /nobreak >nul
cd /d "%~dp0frontend"
echo Starting React Frontend on http://localhost:5173 ...
start "Speech-to-Text Frontend" cmd /k npm run dev
echo.
echo ========================================
echo  Speech to Text App is starting!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8080
echo  H2 Console: http://localhost:8080/h2-console
echo ========================================
