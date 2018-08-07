# How to deploy EveryMundo bsmart-cm-ibe-redemption -> Booksmart CopaAir Web Check in flow.

## Getting started 

### Clone bsmart-cm-ibe-redemption and switch to the folder.

```sh
$ git clone https://yourusername@bitbucket.org/everymundoteam/bsmart-cm-ibe-redemption.git
$ cd bsmart-cm-ibe-redemption
```


### Install Dependencies.
```sh
$ npm install
```


### Go to the folder config and replace in Dev the host with your ip.
```yaml
dev:
 host: yourlocalip:4443
 backend_host: 45.55.73.28:4445
```

### Run grunt.
```sh
$ grunt prod
```

### Start the local server.
```sh
$ npm start
```
### Open your web browser (Chrome) then go to this url in mobile.
http://200.77.229.92:8080/web/check-in?execution=e1s1

### Run Farenet script into the browser console.
```javascript
(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  // This script gonna variate between pages
  s.src = 'https://yourlocalip:4443/app/modules/bsmart-cm-ibe-redemption/lib/farenet/copa/Core.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();
// BooksMart Script
(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://yourlocalip:4443/app/modules/bsmart-cm-ibe-redemption/x-start/bs.dist.js';var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();
```
## Prerequisites.
You need GIT to clone the bsmart-cm-ibe-redemption repository. Also you must have NODE JS and its package manager NPM installed. 


## Troubleshooting

### Check the NPM version.
```sh
$ npm -v
```

### If NPM version >= 3.0.0, run this into the terminal.
```sh
$ cd node_modules/@everymundo/bsmart-tasks/ && npm in
fo . peerDependencies | sed -n 's/^{\{0,1\}[[:space:]]*'\''\{0,1\}\([^:'\'']*\)'\''\{0,1\}:[[:space:]]'\''
\([^'\'']*\).*$/\1@\2/p' | xargs npm i && cd ../../../
```