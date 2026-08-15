@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
set "PATH=C:\Program Files\Java\jdk-21.0.10\bin;%PATH%"
cd /d "%~dp0"
gradlew.bat bootRun
