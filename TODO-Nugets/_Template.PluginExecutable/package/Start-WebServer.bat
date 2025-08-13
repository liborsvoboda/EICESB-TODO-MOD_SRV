@ECHO OFF
SET VALUE="/port:5000"

cd localSrv
WebDev.WebServer40 /port:9000 /path:%~dp0book

REM Open Browser http://127.0.0.1:9000/index.html
