# importmap

[import map](https://github.com/WICG/import-maps) util


## usage
```sh
npm install jquery
npx importmap # prints {"imports":{"jquery":"/node_modules/jquery/dist/jquery.js"}}
```


## run http server
```sh
npx importmap serve -p 3000
# open http://localhost:3000/import-map.json
```
