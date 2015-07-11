(function () {define('rekapi-timeline.component.container/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ContainerComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ContainerComponentModel;
});

define('text',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('text!rekapi-timeline.component.container/template.mustache',[],function () { return '<div class="$controlBar"></div>\n<div class="$timeline"></div>\n<div class="$details"></div>\n';});

define('rekapi-timeline.component.container/view',[

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ContainerComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ContainerComponentView;
});

define('rekapi-timeline.component.control-bar/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ControlBarComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ControlBarComponentModel;
});


define('text!rekapi-timeline.component.control-bar/template.mustache',[],function () { return '<i class="glyphicon glyphicon-play play"></i>\n<i class="glyphicon glyphicon-pause pause"></i>\n<i class="glyphicon glyphicon-stop stop"></i>\n';});

define('rekapi-timeline.component.control-bar/view',[

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ControlBarComponentView = Base.extend({
    template: template

    ,events: {
      'click .play': function () {
        this.play();
      }

      ,'click .pause': function () {
        this.pause();
      }

      ,'click .stop': function () {
        // FIXME: This should be an emitted event, Rekapi should not be called
        // directly here.
        this.lateralus.rekapi
          .stop()
          .update(0);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      // FIXME: This value should be `collectOne`-ed.
      if (this.lateralus.rekapi.isPlaying()) {
        this.$el.addClass('playing');
      }

      // FIXME: This should be abstracted into a `lateralusEvent`.
      this.lateralus.rekapi.on(
          'playStateChange', this.onRekapiPlayStateChanged.bind(this));
    }

    ,onRekapiPlayStateChanged: function () {
      if (this.lateralus.rekapi.isPlaying()) {
        this.$el.addClass('playing');
      } else {
        this.$el.removeClass('playing');
      }
    }

    ,play: function () {
      // FIXME: This should be `emit`-ed.
      this.lateralus.rekapi.playFromCurrent();
    }

    ,pause: function () {
      // FIXME: This should be `emit`-ed.
      this.lateralus.rekapi.pause();
    }
  });

  return ControlBarComponentView;
});

define('rekapi-timeline.component.control-bar/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ControlBarComponent = Base.extend({
    name: 'control-bar'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ControlBarComponent;
});

define('rekapi-timeline.component.control-bar', ['rekapi-timeline.component.control-bar/main'], function (main) { return main; });

define('rekapi-timeline.component.timeline/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var TimelineComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return TimelineComponentModel;
});


define('text!rekapi-timeline.component.timeline/template.mustache',[],function () { return '<div class="$timelineWrapper timeline-wrapper">\n  <div class="$scrubber"></div>\n  <div class="$animationTracks"></div>\n</div>\n';});

define('rekapi-timeline/constant',[],function () {
  'use strict';

  var rekapiTimelineConstants = {
    // How many pixels wide the keyframe tracks should be for every second of
    // the animatiom.
    PIXELS_PER_SECOND: 300

    // How many milliseconds after the currently focused keyframe property to
    // add a new property when the user clicks the "add new property" button.
    ,NEW_KEYFRAME_PROPERTY_BUFFER_MS: 500

    ,DEFAULT_TIMELINE_SCALE: 1
  };

  return rekapiTimelineConstants;
});

define('rekapi-timeline.component.timeline/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var TimelineComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      timelineModified: function () {
        this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
      }
    }

    ,provide: {
      timelineWrapperHeight: function () {
        return this.$timelineWrapper.height();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * Determines how wide this View's element should be, in pixels.
     * @return {number}
     */
    ,getPixelWidthForTracks: function () {
      var animationLength = this.lateralus.rekapi.getAnimationLength();
      var animationSeconds = (animationLength / 1000);

      // The width of the tracks container should always be the pixel width of
      // the animation plus the width of the timeline element to allow for
      // lengthening of the animation tracks by the user.
      return (constant.PIXELS_PER_SECOND * animationSeconds) +
        this.$el.width();
    }
  });

  return TimelineComponentView;
});

define('rekapi-timeline.component.scrubber/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ScrubberComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ScrubberComponentModel;
});


define('text!rekapi-timeline.component.scrubber/template.mustache',[],function () { return '<div class="$scrubberWrapper scrubber-wrapper">\n  <div class="$scrubberHandle scrubber-handle">\n    <i class="glyphicon glyphicon-chevron-down scrubber-icon">&nbsp;</i>\n    <figure class="$scrubberGuide scrubber-guide"></figure>\n  </div>\n</div>\n';});

define('rekapi-timeline.component.scrubber/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      // FIXME: timelineScale is not currently a part of RekapiTimelineModel.
      'change:timelineScale': function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      // This may be problematic.  See
      // https://github.com/jeremyckahn/rekapi-timeline/blob/16cb67620dddef8bf89184d064b5c7200ff8a8aa/app/scripts/views/container.js#L79-L84
      this.listenTo(this.lateralus.rekapi, 'addKeyframePropertyTrack',
          this.resizeScrubberGuide.bind(this));

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberWrapper
        ,drag: this.onScrubberDrag.bind(this)
      });

      // FIXME: Refactor these to be lateralusEvents.
      this.lateralus.rekapi.on('afterUpdate',
          this.onRekapiAfterUpdate.bind(this));
      this.lateralus.rekapi.on('timelineModified',
          this.onRekapiTimelineModified.bind(this));
    }

    ,deferredInitialize: function () {
      this.resizeScrubberGuide();
    }

    ,render: function () {
      this.syncContainerToTimelineLength();
      this.syncHandleToTimelineLength();
    }

    ,onScrubberDrag: function () {
      var millisecond = this.lateralus.getTimelineMillisecondForHandle(
          this.$scrubberHandle) / this.lateralus.timelineScale;
      this.lateralus.rekapi.update(millisecond);
    }

    ,onRekapiAfterUpdate: function () {
      this.render();
    }

    ,onRekapiTimelineModified: function () {
      this.render();
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
        this.lateralus.getAnimationLength() *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.timelineScale;

      this.$scrubberWrapper.width(
        scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
        this.lateralus.rekapi.getLastPositionUpdated() *
        this.lateralus.rekapi.getAnimationLength();
      var scaledLeftValue = lastMillisecondUpdated *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.timelineScale;

      this.$scrubberHandle.css('left', scaledLeftValue);
    }

    ,resizeScrubberGuide: function () {
      var wrapperHeight = this.collectOne('timelineWrapperHeight');
      var scrubberBottomBorder =
        parseInt(this.$scrubberWrapper.css('borderBottomWidth'), 10);
      this.$scrubberGuide.css('height',
        wrapperHeight - this.$el.height() + scrubberBottomBorder);
    }
  });

  return ScrubberComponentView;
});

define('rekapi-timeline.component.scrubber/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ScrubberComponent = Base.extend({
    name: 'scrubber'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ScrubberComponent;
});

define('rekapi-timeline.component.scrubber', ['rekapi-timeline.component.scrubber/main'], function (main) { return main; });

define('rekapi-timeline.component.animation-tracks/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var AnimationTracksComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return AnimationTracksComponentModel;
});


define('text!rekapi-timeline.component.animation-tracks/template.mustache',[],function () { return '';});

define('rekapi-timeline.component.actor-tracks/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ActorTracksComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ActorTracksComponentModel;
});


define('text!rekapi-timeline.component.actor-tracks/template.mustache',[],function () { return '';});

define('rekapi-timeline.component.keyframe-property-track/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var KeyframePropertyTrackComponentModel = Base.extend({
    defaults: {
      trackName: ''
    }
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframePropertyTrackComponentModel;
});


define('text!rekapi-timeline.component.keyframe-property-track/template.mustache',[],function () { return '';});

define('rekapi-timeline.component.keyframe-property/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var KeyframePropertyComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframePropertyComponentModel;
});


define('text!rekapi-timeline.component.keyframe-property/template.mustache',[],function () { return '<button class="$handle keyframe-property" data-name="{{keyframeProperty.name}}" data-value="{{keyframeProperty.value}}" data-millisecond="{{keyframeProperty.millisecond}}">&nbsp;</button>\n';});

define('rekapi-timeline.component.keyframe-property/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyComponentView = Base.extend({
    template: template

    ,events: {
      'focus button':  function (evt) {
        evt.targetView = this;
        this.emit('userFocusedKeyframeProperty', evt);
      }
    }

    ,modelEvents: {
      change: function () {
        this.render();
      }

      ,destroy: function () {
        this.dispose();
      }
    }

    ,lateralusEvents: {
      'change:timelineScale': function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {KeyframePropertyTrackComponentView}
     *   keyframePropertyTrackComponentView
     *   @param {boolean=} preventInitialFocus
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackComponentView.$el
        ,drag: this.onDrag.bind(this)
        ,dragEnd: this.onDragEnd.bind(this)
      });

      if (this.lateralus.model.get('hasBooted')) {
        this.$handle.focus();
      }
    }

    ,render: function () {
      var elData = this.$el.data('dragon');
      if (elData && elData.isDragging) {
        return;
      }

      var scaledXCoordinate = (
          constant.PIXELS_PER_SECOND * this.model.get('millisecond')) /
          1000 * this.lateralus.timelineScale;

      this.$el.css({
        left: scaledXCoordinate
      });

      var model = this.model;
      this.$handle
          .attr('data-millisecond', model.get('millisecond'))
          .attr('data-value', model.get('value'));
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    // In Firefox, completing a $.fn.dragon drag does not focus the element, so
    // it must be done explicitly.
    ,onDragEnd: function () {
      this.$handle.focus();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var scaledValue =
          this.lateralus.getTimelineMillisecondForHandle(this.$el) /
          this.lateralus.timelineScale;

      this.model.set('millisecond', Math.round(scaledValue));
      this.lateralus.update();
    }
  });

  return KeyframePropertyComponentView;
});

define('rekapi-timeline.component.keyframe-property/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyComponent = Base.extend({
    name: 'keyframe-property'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyComponent;
});

define('rekapi-timeline.component.keyframe-property', ['rekapi-timeline.component.keyframe-property/main'], function (main) { return main; });

define('rekapi-timeline.component.keyframe-property-track/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property'

], function (

  Lateralus

  ,template

  ,KeyframePropertyComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyTrackComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyModel} newKeyframeProperty
       */
      addKeyframeProperty: function (newKeyframeProperty) {
        if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
          this.addKeyframePropertyComponent(newKeyframeProperty);
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {ActorModel} actorModel
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyComponents = [];
      var trackName = this.model.get('trackName');
      this.$el.attr('data-track-name', trackName);

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.actorModel.keyframePropertyCollection
        .where({ name: trackName })
        .forEach(this.addKeyframePropertyComponent, this);
    }

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     */
    ,addKeyframePropertyComponent: function (keyframePropertyModel) {
      // It's important to build the DOM before initializing the View in this
      // case, the initialization logic in KeyframePropertyView is way easier
      // that way.
      var keyframePropertyEl = document.createElement('div');
      this.$el.append(keyframePropertyEl);

      var keyframePropertyComponent = this.addComponent(
          KeyframePropertyComponent, {
        el: keyframePropertyEl
        ,keyframePropertyTrackComponentView: this
        ,model: keyframePropertyModel
      });

      this.keyframePropertyComponents.push(keyframePropertyComponent);

      // FIXME: Is this line still necessary?
      keyframePropertyComponent.view.render();
    }
  });

  return KeyframePropertyTrackComponentView;
});

define('rekapi-timeline.component.keyframe-property-track/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyTrackComponent = Base.extend({
    name: 'keyframe-property-track'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyTrackComponent;
});

define('rekapi-timeline.component.keyframe-property-track', ['rekapi-timeline.component.keyframe-property-track/main'], function (main) { return main; });

define('rekapi-timeline.component.actor-tracks/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.keyframe-property-track'

], function (

  Lateralus

  ,template

  ,KeyframePropertyTrackComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ActorTracksComponentView = Base.extend({
    template: template

    ,modelEvents: {
      /**
       * @param {string} newTrackName
       */
      addKeyframePropertyTrack: function (newTrackName) {
        this.addKeyframePropertyTrackComponent(newTrackName);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyTrackComponents = [];

      // Create views for any keyframes that were already defined
      this.model.getTrackNames().forEach(
          this.addKeyframePropertyTrackComponent, this);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrackComponent: function (trackName) {
      var keyframePropertyTrackComponent = this.addComponent(
          KeyframePropertyTrackComponent, {
        actorModel: this.model
      }, {
        modelAttributes: {
          trackName: trackName
        }
      });

      this.keyframePropertyTrackComponents.push(
        keyframePropertyTrackComponent);
      this.$el.append(keyframePropertyTrackComponent.view.$el);
    }
  });

  return ActorTracksComponentView;
});

define('rekapi-timeline.component.actor-tracks/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ActorTracksComponent = Base.extend({
    name: 'actor-tracks'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ActorTracksComponent;
});

define('rekapi-timeline.component.actor-tracks', ['rekapi-timeline.component.actor-tracks/main'], function (main) { return main; });

define('rekapi-timeline.component.animation-tracks/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'rekapi-timeline.component.actor-tracks'

], function (

  _
  ,Lateralus

  ,template

  ,ActorTracksComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var AnimationTracksComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.actorTracksComponents = [];

      // FIXME: This should be leveraging `lateralusEvents`.
      this.listenTo(
        this.lateralus.actorCollection
        ,'add'
        ,this.onActorCollectionAdd.bind(this)
      );

      this.createActorComponents();
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,onActorCollectionAdd: function (actorModel) {
      this.createActorComponent(actorModel);
    }

    ,createActorComponents: function () {
      // Creates views for any actors that were already in the animimation
      var actorCollection = this.lateralus.actorCollection;
      _.each(this.lateralus.getAllActors(),
          actorCollection.addActorToCollection, actorCollection);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,createActorComponent: function (actorModel) {
      var actorTracksComponent = this.addComponent(ActorTracksComponent, {
        model: actorModel
      });

      this.actorTracksComponents.push(actorTracksComponent);
      this.$el.append(actorTracksComponent.view.$el);
    }
  });

  return AnimationTracksComponentView;
});

define('rekapi-timeline.component.animation-tracks/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var AnimationTracksComponent = Base.extend({
    name: 'animation-tracks'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return AnimationTracksComponent;
});

define('rekapi-timeline.component.animation-tracks', ['rekapi-timeline.component.animation-tracks/main'], function (main) { return main; });

define('rekapi-timeline.component.timeline/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.scrubber'
  ,'rekapi-timeline.component.animation-tracks'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ScrubberComponent
  ,AnimationTracksComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var TimelineComponent = Base.extend({
    name: 'timeline'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.scrubberComponent = this.addComponent(ScrubberComponent, {
        el: this.view.$scrubber[0]
      });

      this.animationTracksComponent = this.addComponent(
          AnimationTracksComponent, {
        el: this.view.$animationTracks[0]
      });
    }
  });

  return TimelineComponent;
});

define('rekapi-timeline.component.timeline', ['rekapi-timeline.component.timeline/main'], function (main) { return main; });

define('rekapi-timeline.component.details/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var DetailsComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return DetailsComponentModel;
});


define('text!rekapi-timeline.component.details/template.mustache',[],function () { return '<div class="$scrubberDetail"></div>\n<div class="$keyframePropertyDetail fill"></div>\n';});

define('rekapi-timeline.component.details/view',[

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var DetailsComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return DetailsComponentView;
});

define('rekapi-timeline.component.scrubber-detail/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ScrubberDetailComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ScrubberDetailComponentModel;
});


define('text!rekapi-timeline.component.scrubber-detail/template.mustache',[],function () { return '<label class="label-input-pair row">\n  <p>Zoom:</p>\n  <input type="number" class="$scrubberScale scrubber-scale" value="{{initialZoom}}" min="0" step="10">\n</label>\n';});

define('rekapi-timeline.component.scrubber-detail/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberDetailComponentView = Base.extend({
    template: template

    ,events: {
      'change .scrubber-scale': function () {
        // FIXME: This should be emitted.
        // FIXME: Needs validation to prevent negative values.
        this.lateralus.setTimelineScale(this.$scrubberScale.val() / 100);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        initialZoom: this.lateralus.timelineScale * 100
      });

      return renderData;
    }
  });

  return ScrubberDetailComponentView;
});

define('rekapi-timeline.component.scrubber-detail/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ScrubberDetailComponent = Base.extend({
    name: 'scrubber-detail'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return ScrubberDetailComponent;
});

define('rekapi-timeline.component.scrubber-detail', ['rekapi-timeline.component.scrubber-detail/main'], function (main) { return main; });

define('rekapi-timeline.component.keyframe-property-detail/model',[

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var KeyframePropertyDetailComponentModel = Base.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return KeyframePropertyDetailComponentModel;
});


define('text!rekapi-timeline.component.keyframe-property-detail/template.mustache',[],function () { return '<h1 class="$propertyName keyframe-property-name">Detail</h1>\n<label class="label-input-pair row keyframe-property-millisecond">\n  <p>Millisecond:</p>\n  <input class="$propertyMillisecond property-millisecond" type="number" value="" name="millisecond" step="10">\n</label>\n<label class="label-input-pair row keyframe-property-value">\n  <p>Value:</p>\n  <input class="$propertyValue property-value" type="text" value="" name="value">\n</label>\n<label class="label-input-pair row select-container keyframe-property-easing">\n  <p>Easing:</p>\n  <select class="$propertyEasing" name="easing"></select>\n</label>\n<button class="field-button add">Add a new keyframe</button>\n<button class="field-button delete">Remove this keyframe</button>\n';});

define('rekapi-timeline.component.keyframe-property-detail/view',[

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'rekapi-timeline/constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var KeyframePropertyDetailComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {jQuery.Event} evt
       */
      userFocusedKeyframeProperty: function (evt) {
        if (this.activeKeyframePropertyModel) {
          this.stopListening(this.activeKeyframePropertyModel);
        }

        this.activeKeyframePropertyModel = evt.targetView.model;
        this.listenTo(this.activeKeyframePropertyModel, 'change',
            this.render.bind(this));

        var inputs = [];
        _.each(Tweenable.prototype.formula, function (formula, name) {
          var option = document.createElement('option');
          option.innerHTML = name;
          inputs.push(option);
        }, this);

        this.$propertyEasing.children().remove();
        this.$propertyEasing.append(inputs).val(
            this.activeKeyframePropertyModel.get('easing'));

        this.render();
      }
    }

    ,events: {
      'change input': 'onChangeInput'
      ,'change select': 'onChangeInput'

      ,'click .add': function () {
        this.addNewKeyframeProperty();
      }

      ,'click .delete': function () {
        this.deleteCurrentKeyframeProperty();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,render: function () {
      this.$propertyName.text(this.activeKeyframePropertyModel.get('name'));
      this.$propertyMillisecond.val(
          this.activeKeyframePropertyModel.get('millisecond'));
      this.$propertyValue.val(
          this.activeKeyframePropertyModel.get('value'));
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onChangeInput: function (evt) {
      var $target = $(evt.target);
      var val = $target.val();

      // If the inputted value string can be coerced into an equivalent Number,
      // do it.  Keyframe property values are initially set up as numbers, and
      // this cast prevents the user from inadvertently setting inconsistently
      // typed keyframe property values, thus breaking Rekapi.
      // jshint eqeqeq: false
      var coercedVal = val == +val ? +val : val;

      this.activeKeyframePropertyModel.set($target.attr('name'), coercedVal);
      this.lateralus.update();
    }

    ,addNewKeyframeProperty: function () {
      if (!this.activeKeyframePropertyModel) {
        return;
      }

      var activeKeyframePropertyModel = this.activeKeyframePropertyModel;
      var actorModel = activeKeyframePropertyModel.getActorModel();

      var targetMillisecond =
          activeKeyframePropertyModel.get('millisecond') +
          constant.NEW_KEYFRAME_PROPERTY_BUFFER_MS;
      var keyframeObject = {};
      keyframeObject[activeKeyframePropertyModel.get('name')] =
          activeKeyframePropertyModel.get('value');

      actorModel.keyframe(
          targetMillisecond
          ,keyframeObject
          ,activeKeyframePropertyModel.get('easing'));
    }

    ,deleteCurrentKeyframeProperty: function () {
      if (!this.activeKeyframePropertyModel) {
        return;
      }

      var activeKeyframePropertyModel = this.activeKeyframePropertyModel;
      activeKeyframePropertyModel.getActorModel().removeKeyframeProperty(
          activeKeyframePropertyModel.get('name')
          ,activeKeyframePropertyModel.get('millisecond'));
    }
  });

  return KeyframePropertyDetailComponentView;
});

define('rekapi-timeline.component.keyframe-property-detail/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyDetailComponent = Base.extend({
    name: 'keyframe-property-detail'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return KeyframePropertyDetailComponent;
});

define('rekapi-timeline.component.keyframe-property-detail', ['rekapi-timeline.component.keyframe-property-detail/main'], function (main) { return main; });

define('rekapi-timeline.component.details/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.scrubber-detail'
  ,'rekapi-timeline.component.keyframe-property-detail'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ScrubberDetailComponent
  ,KeyframePropertyDetailComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var DetailsComponent = Base.extend({
    name: 'details'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.scrubberDetailComponent =
        this.addComponent(ScrubberDetailComponent, {
        el: this.view.$scrubberDetail[0]
      });

      this.keyframePropertyDetailComponent =
        this.addComponent(KeyframePropertyDetailComponent, {
        el: this.view.$keyframePropertyDetail[0]
      });
    }
  });

  return DetailsComponent;
});

define('rekapi-timeline.component.details', ['rekapi-timeline.component.details/main'], function (main) { return main; });

define('rekapi-timeline.component.container/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'rekapi-timeline.component.control-bar'
  ,'rekapi-timeline.component.timeline'
  ,'rekapi-timeline.component.details'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,ControlBarComponent
  ,TimelineComponent
  ,DetailsComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'container'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.controlBar = this.addComponent(ControlBarComponent, {
        el: this.view.$controlBar[0]
      });

      this.timelineComponent = this.addComponent(TimelineComponent, {
        el: this.view.$timeline[0]
      });

      this.detailsComponent = this.addComponent(DetailsComponent, {
        el: this.view.$details[0]
      });
    }
  });

  return ContainerComponent;
});

define('rekapi-timeline.component.container', ['rekapi-timeline.component.container/main'], function (main) { return main; });

define('rekapi-timeline/utils',[

  'underscore'

], function (

  _

) {
  'use strict';

  return  {
    /**
     * @param {Function} Source A constructor from which to steal prototype
     * methods.
     * @param {Function} Target A constructor whose instances Source's methods
     * should be .apply-ed to.
     * @param {Object} opts
     * @param {Array.<string>} [opts.blacklistedMethodNames] A list of method
     * names that should not be copied over from Source.prototype.
     * @param {function} [opts.subject] A function that returns the Object that
     * Source's methods should be applied to.
     */
    proxy: function (Source, Target, opts) {
      opts = opts || {};
      var blacklistedMethodNames = opts.blacklistedMethodNames || [];
      var subject = opts.subject;

      var whitelistedMethodNames =
        _.difference(Object.keys(Source.prototype), blacklistedMethodNames);
      var sourceProto = Source.prototype;
      var targetProto = Target.prototype;

      whitelistedMethodNames.forEach(function (methodName) {
        var method = sourceProto[methodName];
        targetProto[methodName] = function () {
          var target = subject ? subject.call(this) : this;
          return method.apply(target, arguments);
        };
      }, this);
    }
  };
});

define('rekapi-timeline/model',[

  'underscore'
  ,'lateralus'

], function (

  _
  ,Lateralus

) {
  'use strict';

  var RekapiTimelineModel = Lateralus.Model.extend({
    defaults: {
      hasRendered: false
      ,hasBooted: false
    }
  });

  return RekapiTimelineModel;
});

define('rekapi-timeline/models/keyframe-property',[

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline/utils'

], function (

  _
  ,Backbone
  ,Lateralus
  ,Rekapi

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var KeyframePropertyModel = Base.extend({
    defaults: {
      keyframeProperty: Rekapi.KeyframeProperty
    }

    /**
     * @param {Object} attributes
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.KeyframeProperty instance.
      this.attributes = this.attributes.keyframeProperty;

      // FIXME: Abstract this to be `lateralusEvents` event.
      this.lateralus.rekapi.on('removeKeyframeProperty',
        this.onRekapiRemoveKeyframeProperty.bind(this));

      this.id = this.attributes.id;
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRekapiRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty === this.attributes) {
        this.destroy();
      }
    }

    /**
     * @override
     */
    ,set: function (key, value) {
      Backbone.Model.prototype.set.apply(this, arguments);

      if (key in this.attributes) {
        // Modify the keyframeProperty via its actor so that the state of the
        // animation is updated.
        var obj = {};
        obj[key] = value;
        this.attributes.actor.modifyKeyframeProperty(
            this.attributes.name, this.attributes.millisecond, obj);
      }
    }

    /**
     * FIXME: Try to obviate this.
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes.actor;
    }

    /**
     * FIXME: Try to obviate this.
     * @return {RekapiTimelineActorModel}
     */
    ,getActorModel: function () {
      return this.collection.actorModel;
    }

    /**
     * Overrides the standard Backbone.Model#destroy behavior, as there is no
     * server data that this model is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  utils.proxy(Rekapi.KeyframeProperty, KeyframePropertyModel);

  return KeyframePropertyModel;
});

define('rekapi-timeline/collections/keyframe-property',[

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/keyframe-property'

], function (

  Backbone
  ,Lateralus

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {ActorModel} actorModel The actorModel that "owns" this
     *   collection.
     */
    ,initialize: function (models, opts) {
      this.actorModel = opts.actorModel;

      // FIXME: This should be leveraging `lateralusEvents`.
      this.lateralus.rekapi.on('addKeyframeProperty',
          this.onAddKeyframeProperty.bind(this));
      this.lateralus.rekapi.on('removeKeyframeProperty',
          this.onRemoveKeyframeProperty.bind(this));
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onAddKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.actorModel.getActor()) {
        this.addKeyframePropertyToCollection(keyframeProperty);
      }
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRemoveKeyframeProperty: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.actorModel.getActor()) {
        this.removeKeyframePropertyFromCollection(keyframeProperty);
      }
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     * @return {KeyframePropertyModel} The keyframe property model that was
     * added.
     */
    ,addKeyframePropertyToCollection: function (keyframeProperty) {
      var keyframePropertyModel = this.initModel(KeyframePropertyModel, {
        keyframeProperty: keyframeProperty
      });

      return this.add(keyframePropertyModel);
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,removeKeyframePropertyFromCollection: function (keyframeProperty) {
      this.remove(keyframeProperty.id);
    }
  });

  return KeyframePropertyCollection;
});

define('rekapi-timeline/models/actor',[

  'lateralus'
  ,'rekapi'

  ,'rekapi-timeline/collections/keyframe-property'

  ,'rekapi-timeline/utils'

], function (

  Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var ActorModel = Base.extend({
    defaults: {
      actor: Rekapi.Actor
    }

    /**
     * @param {Object} attrs
     *   @param {Rekapi.Actor} actor
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.Actor instance.
      this.attributes = this.attributes.actor;

      this.getTrackNames().forEach(this.addKeyframePropertyTrack, this);

      // FIXME: This should be leveraging `lateralusEvents`.
      this.lateralus.rekapi.on('addKeyframePropertyTrack',
        this.onRekapiAddKeyframePropertyTrack.bind(this));

      this.keyframePropertyCollection = this.initCollection(
        KeyframePropertyCollection
        ,null
        ,{ actorModel: this }
      );

      // FIXME: This should be leveraging `lateralusEvents`.
      this.listenTo(this.keyframePropertyCollection, 'add',
        this.onAddKeyframeProperty.bind(this));

      // Backfill the collection with any keyframeProperties the actor may
      // already have.
      this.getTrackNames().forEach(function (trackName) {
        this.getPropertiesInTrack(trackName).forEach(
          this.keyframePropertyCollection.addKeyframePropertyToCollection,
          this.keyframePropertyCollection);
      }, this);
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,onRekapiAddKeyframePropertyTrack: function (rekapi, keyframeProperty) {
      if (keyframeProperty.actor === this.attributes) {
        this.addKeyframePropertyTrack(keyframeProperty.name);
      }
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} model
     */
    ,onAddKeyframeProperty: function (model) {
      this.emit('addKeyframeProperty', model);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.emit('addKeyframePropertyTrack', trackName);
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes;
    }
  });

  utils.proxy(Rekapi.Actor, ActorModel, {
    subject: function () {
      return this.attributes;
    }
  });

  return ActorModel;
});

define('rekapi-timeline/collections/actor',[

  'backbone'
  ,'lateralus'

  ,'rekapi-timeline/models/actor'

], function (

  Backbone
  ,Lateralus

  ,ActorModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var ActorCollection = Base.extend({
    model: ActorModel

    ,initialize: function () {
      // FIXME: This should be leveraging `lateralusEvents`.
      this.lateralus.rekapi.on('addActor', this.onRekapiAddActor.bind(this));
    }

    /**
     * @param {Rekapi} rekapi
     * @param {Rekapi.Actor} actor
     */
    ,onRekapiAddActor: function (rekapi, actor) {
      this.addActorToCollection(actor);
    }

    /**
     * @param {Rekapi.Actor} actor
     * @return {ActorModel}
     */
    ,addActorToCollection: function (actor) {
      var actorModel = this.initModel(ActorModel, { actor: actor });
      return this.add(actorModel);
    }
  });

  return ActorCollection;
});

define('rekapi-timeline/rekapi-timeline',[

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'rekapi-timeline.component.container'

  ,'rekapi-timeline/utils'
  ,'rekapi-timeline/model'
  ,'rekapi-timeline/constant'
  ,'rekapi-timeline/collections/actor'

  // Silent dependency
  ,'jquery-dragon'

], function (

  _
  ,Lateralus
  ,Rekapi

  ,ContainerComponent

  ,utils
  ,RekapiTimelineModel
  ,constant
  ,ActorCollection

) {
  'use strict';

  /**
   * @param {Element} el
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @extends {Lateralus}
   * @constuctor
   */
  var RekapiTimeline = Lateralus.beget(function (el, rekapi) {
    Lateralus.apply(this, arguments);
    this.rekapi = rekapi;

    // FIXME: This should be on the Lateralus.Model.
    this.timelineScale = constant.DEFAULT_TIMELINE_SCALE;

    this.actorCollection = this.initCollection(ActorCollection);

    this.containerComponent = this.addComponent(ContainerComponent, {
      el: el
    });

    this.model.set('hasRendered', true);
    this.emit('initialDOMRender');
    this.rekapi.on(
      'timelineModified', this.emit.bind(this, 'timelineModified'));
    this.emit('timelineModified');

    _.defer(this.deferredInitialize.bind(this));
  }, {
    Model: RekapiTimelineModel
  });

  RekapiTimeline.prototype.deferredInitialize = function () {
    this.model.set('hasBooted', true);
  };

  /**
   * FIXME: Legacy code.  Change this to be a `provide`-ed method.
   * Gets the Rekapi timeline millisecond value for a slider handle-like
   * element.  This is used for converting the position of keyframe DOM
   * elements and the timeline scrubber position into the value it represents
   * in the animation.
   * @param {jQuery} $handle The handle element to retrieve the millisecond
   * value for.
   * @return {number}
   */
  RekapiTimeline.prototype.getTimelineMillisecondForHandle =
      function ($handle) {
    var distanceFromLeft = parseInt($handle.css('left'), 10) -
        parseInt($handle.parent().css('border-left-width'), 10);
    var baseMillisecond = (
        distanceFromLeft / constant.PIXELS_PER_SECOND) * 1000;

    return baseMillisecond;
  };

  /**
   * FIXME: Legacy code.  Change this to be a `lateralusEvents` event.
   * @param {number} newScale
   */
  RekapiTimeline.prototype.setTimelineScale = function (newScale) {
    this.timelineScale = newScale;
    this.trigger('change:timelineScale', newScale);
  };

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   */
  Rekapi.prototype.createTimeline = function (el) {
    return new RekapiTimeline(el, this);
  };

  utils.proxy(Rekapi, RekapiTimeline, {
    blacklistedMethodNames: ['on', 'off']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiTimeline;
});

define('rekapi-timeline', ['rekapi-timeline/rekapi-timeline'], function (main) { return main; });

}());