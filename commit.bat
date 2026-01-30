@echo off
cd /d "d:\Desktop\Jumbotail_Task"
echo Committing Phase 3-6 changes...
git add -A
git commit -m "Phase 3-6: Product generation, APIs, and search implementation"
git push origin main
echo Done!
pause
