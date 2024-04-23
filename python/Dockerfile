# Use a base image with Windows Server Core and pre-installed Python
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install Python
ADD https://www.python.org/ftp/python/3.11.6/python-3.11.6-amd64.exe C:/python3.exe
RUN powershell -Command \
  $ErrorActionPreference = 'Stop'; \
  Start-Process c:\python3.exe -ArgumentList '/quiet InstallAllUsers=1 PrependPath=1' -Wait ; \
  Remove-Item c:\python3.exe -Force

# Upgrade pip and set the work directory
RUN python -m pip install --upgrade pip && pip install pipenv

COPY . /app/
WORKDIR /app

RUN pipenv install
RUN pipenv install pyinstaller
CMD ["pipenv", "run", "pyinstaller", "--onefile", "./templative/__main__.py"]
