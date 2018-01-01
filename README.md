# rekapi-timline

## A graphical control for [Rekapi](http://jeremyckahn.github.io/rekapi/doc/) animations

![rekapi-timeline screenshot](https://gist.githubusercontent.com/jeremyckahn/0b93cf96db45bf0722b82eef17e7c5a6/raw/3dbef48b78842cbdde9f47a2eb8862b25023890f/rekapi-timeline-screenshot.png)

rekapi-timeline is a general-purpose timeline-editing interface for [Rekapi](http://rekapi.com/) meant to be integrated into graphical applications.  It is designed to be feature-rich but flexible.  rekapi-timeline is not intended to be used as a standalone application.  A practical example of it in use is [Mantra](http://jeremyckahn.github.io/mantra/).

Version 0.7.x and above is built with React and is a ground-up rewrite from 0.6.x and earlier versions, which were built with Backbone.  The library dependencies are excluded from the production build artifacts, so you will need to manage that in your project.  Please see the `dependencies` field in `package.json` for an up-to-date-list of runtime dependencies.  For an example of how to load rekapi-timeline in a browser without any complex build infrastructure, please [see this CodePen](https://codepen.io/jeremyckahn/pen/NXjVOm).

## Usage

Install the package:

```
npm install rekapi-timeline
```

Minimal bootstrap:

```html
<div id="rekapi-timeline"></div>
<div>
  <div id="actor-1" class="actor" style="background: #bada55; height: 150px; width: 150px;"></div>
</div>
```

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Rekapi } from 'rekapi';
import { RekapiTimeline } from 'rekapi-timeline';

const rekapi = new Rekapi(document.body);
const actor = rekapi.addActor({
  context: document.getElementById('actor-1')
});

ReactDOM.render(
  <RekapiTimeline
    rekapi={rekapi}
  />,
  document.getElementById('rekapi-timeline')
);
```

## Running tests (written in Mocha)

```
# run tests in the CLI
npm test
```

```
# run tests in the CLI with a watcher that will re-run tests
# when you make a code change
npm run test:watch
```

## Debugging

This project configures Webpack to generate [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) so you can use your browser's dev tools to debug your ES6 code just as easily as you would with ES5.

```
# run the tests in your browser
npm start
```

From here, you can fire up your browser's dev tools and set breakpoints, step through code, etc.  You can run the demo app at <a href="http://localhost:9123">http://localhost:9123</a>, or run the tests at <a href="http://localhost:9123/test/">http://localhost:9123/test/</a>.

## Building

```
npm run build
```

Your compiled code will wind up in the `dist` directory.

## Documentation

You should make sure to update the [JSDoc](http://usejsdoc.org/) annotations as you work.  To view the formatted documentation in your browser:

```
npm run doc
npm run doc:view
```

This will generate the docs and run them in your browser.  If you would like this to update automatically as you work, run this task:

```
npm run doc:live
```

## Releasing

```
npm version patch # Or "minor," or "major"
```

## License

MIT.
