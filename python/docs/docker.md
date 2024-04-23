Building it locally
```
docker build -t templativeimage .
docker run --name templativebuild templativeimage
docker cp templativebuild:/app/dist/__main__.exe ./templative.exe
"C:\Users\User\Documents\git\templative-frontend\python\templative.exe"
```