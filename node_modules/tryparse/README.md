TryParse
========

TryParse allows you to test if a value is an integer, a float

Installation
```bash
npm install tryparse
```

Usage
```node
var tryparse = require('tryparse')

// Good values, as good as using parseInt or parseFloat
var myInt = tryparse.int(4)
> 4
var myFloat = tryparse.float(4.5)
> 4.5

// Bad values, return null
var notInt = tryParse.int('fhjdsk')
> null
var notFloat = tryParse.float('dhgjsjkg')
> null

// Good values as strings
var myIntString = tryparse.int("4")
> 4
var myFloatString = tryparse.float("4.5")
> 4.5

```

Run Tests (requires tap: https://npmjs.org/package/tap)
```bash
npm test
```
