# Superscore

Extensions to underscore.

## Getting Started
### On the server
Install the module with: `npm install superscore`

```javascript
var superscore = require('superscore');
superscore.awesome(); // "awesome"
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/DavidSouther/superscore/master/dist/superscore.min.js
[max]: https://raw.github.com/DavidSouther/superscore/master/dist/superscore.js

In your web page:

```html
<script src="dist/superscore.min.js"></script>
<script>
awesome(); // "awesome"
</script>
```

In your code, you can attach superscore's methods to any object.

```html
<script>
this.exports = Bocoup.utils;
</script>
<script src="dist/superscore.min.js"></script>
<script>
Bocoup.utils.awesome(); // "awesome"
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" or "lib" subdirectories as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 David Souther	
Licensed under the MIT license.
