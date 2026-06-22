#!/bin/bash
export ASPNETCORE_ENVIRONMENT="Development"
export ASPNETCORE_URLS="http://localhost:5100"
cd /home/runner/workspace/AlberSchoolApi/AlbaApi/bin/Debug/net10.0
exec dotnet AlbaApi.dll
