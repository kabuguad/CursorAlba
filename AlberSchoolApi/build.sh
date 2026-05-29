#!/bin/bash
cd /home/runner/workspace/AlberSchoolApi
dotnet build src/AlberSchoolApi/AlberSchoolApi.csproj --no-restore -p:RunAnalyzers=false --verbosity minimal > /home/runner/workspace/build_output.txt 2>&1
echo "BUILD_EXIT:$?" >> /home/runner/workspace/build_output.txt
