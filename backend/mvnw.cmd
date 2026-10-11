@echo off
set "DIR=%~dp0"
if exist "%DIR%maven\bin\mvn.cmd" (
    "%DIR%maven\bin\mvn.cmd" %*
) else (
    mvn %*
)
