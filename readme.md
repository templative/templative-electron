# Development

- `npm install`

## Running Production React Server

```
npm run react-build
npm install -g serve
serve -s build
```

## Launch React

- `npm react`

## Server

- `cd python`
- `pipenv install`
- `pipenv run python app.py`

## Launch All

- `npm run electron`

# Outputing

- `npm run exe`
- Check the `./out` folder
- Run `./out/templative-frontend-darwin-x64/templative-frontend.app/Contents/MacOS/templative-frontend`

# Clean dev env

- `npm ls -gp --depth=0 | awk -F/ '/node_modules/ && !/\/npm$/ {print $NF}' | sudo xargs npm -g rm`
- `pip freeze | cut -d "@" -f1 | xargs pip uninstall -y`

templative = {file = "file:///C:/Users/User/Documents/git/nextdaygames/templative"}