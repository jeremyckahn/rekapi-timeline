# A Modern JavaScript Project

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

From here, you can fire up your browser's dev tools and set breakpoints, step through code, etc.  You can run the app at <a href="http://localhost:9123">http://localhost:9123</a>, or run the tests at <a href="http://localhost:9123/test.html">http://localhost:9123/test.html</a>.

## A build process

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
