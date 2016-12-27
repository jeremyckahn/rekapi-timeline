# rekapi-timeline

![Screenshot of UI](img/basic-screenshot.png)

rekapi-timeline is a general-purpose timeline-editing interface for [Rekapi](http://rekapi.com/) meant to be integrated into graphical applications.  It is designed to be feature-rich but flexible.  rekapi-timeline is not intended to be used as a standalone application.

## Dependencies

* [Rekapi](http://rekapi.com/)
  * [Shifty](http://jeremyckahn.github.io/shifty/)
* [Lateralus](https://github.com/Jellyvision/lateralus)
  * [jQuery](http://jquery.com/)
  * [Backbone](http://backbonejs.org/)
  * [Underscore](http://underscorejs.org/)
  * [Mustache](https://github.com/janl/mustache.js/)
  * [Require](http://requirejs.org/)
* [jQuery Dragon](https://github.com/jeremyckahn/dragon)

## Installation

````
npm install rekapi-timeline
````

## Integration

To use rekapi-timeline in your app, just load `dist/scripts/rekapi-timeline.js` or `dist/scripts/rekapi-timeline.min.js` in your app.  These files do not include rekapi-timeline's dependencies.  You can load those via `dist/scripts/rekapi-timeline.full.js` or `dist/scripts/rekapi-timeline.full.min.js`.

You will also need to load the rekapi-timeline styles.  These can either be `@import`-ed as Sass (`app/styles/main.sass`) or as CSS (`dist/styles/main.css`).

Once loaded as an [AMD module](http://requirejs.org/docs/whyamd.html#amd), `Rekapi.prototype.createTimeline` will be automatically defined.  All you need is a DOM element to insert the timeline into:

````html
<div id="rekapi-timeline"></div>
<div id="animation">
  <div id="actor-1" class="actor" style="background: #bada55; height: 150px; width: 150px;"></div>
</div>
````

````javascript
var timelineEl = document.querySelector('#rekapi-timeline');
var rekapi = new Rekapi(document.querySelector('#animation'));

var actor = rekapi.addActor({
  context: document.querySelector('#actor-1')
});

var timeline = rekapi.createTimeline(timelineEl);
````

## License

MIT
