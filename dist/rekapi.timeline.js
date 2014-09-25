(function () {define('rekapi.timeline.constants',[],function () {
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


define('text!templates/control-bar.mustache',[],function () { return '<i class="glyphicon glyphicon-play rt-play"></i>\n<i class="glyphicon glyphicon-pause rt-pause"></i>\n<i class="glyphicon glyphicon-stop rt-stop"></i>\n';});

define('views/control-bar',[

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'text!../templates/control-bar.mustache'

  ], function (

  $
  ,_
  ,Backbone

  ,controlBarTemplate

  ) {
  'use strict';

  var ControlBarView = Backbone.View.extend({
    events: {
      'click .rt-play': 'onClickPlay'
      ,'click .rt-pause': 'onClickPause'
      ,'click .rt-stop': 'onClickStop'
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();

      if (this.rekapiTimeline.rekapi.isPlaying()) {
        this.$el.addClass('rt-playing');
      }

      // FIXME: Needs to be torn down.
      $(document.body).on('keydown', _.bind(this.onWindowKeydown, this));
    }

    ,render: function () {
      this.$el.html(controlBarTemplate);
    }

    ,onWindowKeydown: function (evt) {
      var keyCode = evt.keyCode;

      // This is true if the user is focused on an element such as an input or
      // a link.  RekapiTimeline keyboard shortcuts should be disabled, in that
      // case.
      if (evt.target !== evt.currentTarget) {
        return;
      }

      if (keyCode === 32) { // space
        if (this.rekapiTimeline.isPlaying()) {
          this.pause();
        } else {
          this.play();
        }
      }
    }

    ,onClickPlay: function () {
      this.play();
    }

    ,onClickPause: function () {
      this.pause();
    }

    ,onClickStop: function () {
      this.rekapiTimeline.rekapi
        .stop()
        .update(0);
      this.$el.removeClass('rt-playing');
    }

    ,play: function () {
      this.rekapiTimeline.rekapi.playFromCurrent();
      this.$el.addClass('rt-playing');
    }

    ,pause: function () {
      this.rekapiTimeline.rekapi.pause();
      this.$el.removeClass('rt-playing');
    }
  });

  return ControlBarView;
});


define('text!templates/scrubber.mustache',[],function () { return '<div class="rt-scrubber-container">\n  <div class="rt-scrubber-handle">\n    <i class="glyphicon glyphicon-chevron-down rt-scrubber-icon">&nbsp;</i>\n    <figure class="rt-scrubber-guide"></figure>\n  </div>\n</div>\n';});

define('views/scrubber',[

  'underscore'
  ,'backbone'

  ,'../rekapi.timeline.constants'

  ,'text!../templates/scrubber.mustache'

  ], function (

  _
  ,Backbone

  ,rekapiTimelineConstants

  ,scrubberTemplate

  ) {
  'use strict';

  var ScrubberView = Backbone.View.extend({
    events: {
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.initialRender();

      this.$scrubberContainer = this.$el.find('.rt-scrubber-container');
      this.$scrubberHandle =
          this.$scrubberContainer.find('.rt-scrubber-handle');
      this.$scrubberGuide = this.$el.find('.rt-scrubber-guide');
      this.listenToOnce(
          this.rekapiTimeline, 'initialDOMRender',
          _.bind(this.resizeScrubberGuide, this));

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberContainer
        ,drag: _.bind(this.onScrubberDrag, this)
      });

      this.rekapiTimeline.rekapi.on('afterUpdate',
          _.bind(this.onRekapiAfterUpdate, this));
      this.rekapiTimeline.rekapi.on('timelineModified',
          _.bind(this.onRekapiTimelineModified, this));

      this.listenTo(this.rekapiTimeline, 'change:timelineScale',
          _.bind(this.onChangeTimelineScale, this));
    }

    ,initialRender: function () {
      this.$el.html(scrubberTemplate);
    }

    ,render: function () {
      this.syncContainerToTimelineLength();
      this.syncHandleToTimelineLength();
    }

    ,onScrubberDrag: function () {
      var millisecond = this.rekapiTimeline.getTimelineMillisecondForHandle(
          this.$scrubberHandle) / this.rekapiTimeline.timelineScale;
      this.rekapiTimeline.rekapi.update(millisecond);
    }

    ,onRekapiAfterUpdate: function () {
      this.render();
    }

    ,onRekapiTimelineModified: function () {
      this.render();
    }

    ,onChangeTimelineScale: function () {
      this.render();
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
          this.rekapiTimeline.getAnimationLength() *
          (rekapiTimelineConstants.PIXELS_PER_SECOND / 1000) *
          this.rekapiTimeline.timelineScale;

      this.$scrubberContainer.width(
          scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
          this.rekapiTimeline.rekapi.getLastPositionUpdated() *
          this.rekapiTimeline.rekapi.getAnimationLength();
      var scaledLeftValue = lastMillisecondUpdated *
          (rekapiTimelineConstants.PIXELS_PER_SECOND / 1000) *
          this.rekapiTimeline.timelineScale;

      this.$scrubberHandle.css('left', scaledLeftValue);
    }

    ,resizeScrubberGuide: function () {
      var wrapperHeight =
          this.rekapiTimeline.containerView.$timelineWrapper.height();
      var scrubberBottomBorder =
          parseInt(this.$scrubberContainer.css('borderBottomWidth'), 10);
      this.$scrubberGuide.css('height',
          wrapperHeight - this.$el.height() + scrubberBottomBorder);
    }
  });

  return ScrubberView;
});


define('text!templates/keyframe-property.mustache',[],function () { return '<button class="rt-keyframe-property" data-name="{{name}}" data-value="{{value}}" data-millisecond="{{millisecond}}">&nbsp;</button>\n';});

define('views/keyframe-property',[

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'../rekapi.timeline.constants'

  ,'text!../templates/keyframe-property.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,rekapiTimelineConstants

  ,KeyframePropertyTemplate

) {
  'use strict';

  var KeyframePropertyView = Backbone.View.extend({
    events: {
      'focus button': 'onFocus'
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {KeyframePropertyTrackView} keyframePropertyTrackView
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.keyframePropertyTrackView = opts.keyframePropertyTrackView;
      this.$el.addClass('rt-keyframe-property-view');
      this.initialRender();
      this.$handle = this.$el.find('.rt-keyframe-property');

      if (this.rekapiTimeline.hasRendered) {
        this.onInitialTimelineDOMRender();
      } else {
        this.listenToOnce(this.rekapiTimeline, 'initialDOMRender',
            _.bind(this.onInitialTimelineDOMRender, this));
      }

      this.listenTo(this.rekapiTimeline,
          'change:timelineScale', _.bind(this.render, this));
      this.listenTo(this.model, 'change', _.bind(this.render, this));
      this.listenTo(this.model, 'destroy', _.bind(this.dispose, this));
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(
          KeyframePropertyTemplate, this.model.getKeyframeProperty()));
    }

    ,onInitialTimelineDOMRender: function () {
      this.$el.dragon({
        within: this.keyframePropertyTrackView.$el
        ,drag: _.bind(this.onDrag, this)
        ,dragEnd: _.bind(this.onDragEnd, this)
      });
    }

    ,render: function () {
      var elData = this.$el.data('dragon');
      if (elData && elData.isDragging) {
        return;
      }

      var scaledXCoordinate = (
          rekapiTimelineConstants.PIXELS_PER_SECOND *
            this.model.get('millisecond')) /
          1000 *
          this.rekapiTimeline.timelineScale;

      this.$el.css({
        left: scaledXCoordinate
      });

      var model = this.model;
      this.$handle
          .attr('data-millisecond', model.get('millisecond'))
          .attr('data-value', model.get('value'));
    }

    ,onFocus: function (evt) {
      evt.targetView = this;
      this.rekapiTimeline.trigger('focusKeyframeProperty', evt);
    }

    ,onDrag: function () {
      this.updateKeyframeProperty();
    }

    // In Firefox, completing a $.fn.dragon drag does not focus the element, so
    // it must be done explicity.
    ,onDragEnd: function () {
      this.$handle.focus();
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var scaledValue =
          this.rekapiTimeline.getTimelineMillisecondForHandle(this.$el) /
          this.rekapiTimeline.timelineScale;

      this.model.set('millisecond', Math.round(scaledValue));
      this.rekapiTimeline.update();
    }

    ,dispose: function () {
      this.rekapiTimeline.dispose(this);
    }
  });

  return KeyframePropertyView;
});

define('views/keyframe-property-track',[

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'./keyframe-property'

], function (

  $
  ,_
  ,Backbone

  ,KeyframePropertyView

) {
  'use strict';

  var KeyframePropertyTrackView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {string} trackName
     *   @param {RekapiTimelineActorModel} model
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.trackName = opts.trackName;
      this._keyframePropertyViews = [];
      this.$el
          .addClass('rt-keyframe-property-track-view')
          .attr('data-track-name', this.trackName);

      this.listenTo(this.model, 'addKeyframeProperty',
          _.bind(this.onAddKeyframeProperty, this));

      // Retroactively create views for any keyframeProperties that the actor
      // that hed before RekapiTimeline was initialized
      this.model.keyframePropertyCollection
          .where({ name: this.trackName })
          .forEach(this.createKeyframePropertyView, this);
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} keyframePropertyModel
     */
    ,onAddKeyframeProperty: function (newKeyframeProperty) {
      if (newKeyframeProperty.get('name') === this.trackName) {
        this.createKeyframePropertyView(newKeyframeProperty);
      }
    }

    /**
     * @param {RekapiTimelineKeyframePropertyModel} keyframePropertyModel
     */
    ,createKeyframePropertyView: function (keyframePropertyModel) {
      // It's important to build the DOM before initializing the View in this
      // case, the initialization logic in KeyframePropertyView is way easier
      // that way.
      var keyframePropertyEl = document.createElement('div');
      this.$el.append(keyframePropertyEl);

      var keyframePropertyView = new KeyframePropertyView({
        el: keyframePropertyEl
        ,rekapiTimeline: this.rekapiTimeline
        ,keyframePropertyTrackView: this
        ,model: keyframePropertyModel
      });

      this._keyframePropertyViews.push(keyframePropertyView);
      keyframePropertyView.render();
    }
  });

  return KeyframePropertyTrackView;
});

define('views/actor-tracks',[

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'./keyframe-property-track'

], function (

  $
  ,_
  ,Backbone

  ,KeyframePropertyTrackView

) {
  'use strict';

  var ActorTracksView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this._keyframePropertyTrackViews = [];
      this.$el.addClass('rt-actor-view');

      this.listenTo(this.model, 'addKeyframePropertyTrack',
          _.bind(this.onAddKeyframePropertyTrack, this));

      // Create views for any keyframes that were already defined
      this.model.getTrackNames().forEach(
          this.createKeyframePropertyTrackView, this);
    }

    /**
     * @param {string} newTrackName
     */
    ,onAddKeyframePropertyTrack: function (newTrackName) {
      this.createKeyframePropertyTrackView(newTrackName);
    }

    ,createKeyframePropertyTrackView: function (trackName) {
      var keyframePropertyTrackView = new KeyframePropertyTrackView({
        rekapiTimeline: this.rekapiTimeline
        ,model: this.model
        ,trackName: trackName
      });

      this._keyframePropertyTrackViews.push(keyframePropertyTrackView);
      this.$el.append(keyframePropertyTrackView.$el);
    }
  });

  return ActorTracksView;
});

define('views/animation-tracks',[

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'./actor-tracks'

], function (

  $
  ,_
  ,Backbone

  ,ActorTracksView

) {
  'use strict';

  var AnimationTracksView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this._actorTracksViews = [];

      this.listenTo(this.rekapiTimeline.actorCollection, 'add',
          _.bind(this.onActorCollectionAdd, this));

      this.createActorViews();
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,onActorCollectionAdd: function (actorModel) {
      this.createActorView(actorModel);
    }

    ,createActorViews: function () {
      // Creates views for any actors that were already in the animimation
      var actorCollection = this.rekapiTimeline.actorCollection;
      _.each(this.rekapiTimeline.getAllActors(),
          actorCollection.addActorToCollection, actorCollection);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,createActorView: function (actorModel) {
      var actorTracksView = new ActorTracksView({
          rekapiTimeline: this.rekapiTimeline
          ,model: actorModel
        });
      this._actorTracksViews.push(actorTracksView);
      this.$el.append(actorTracksView.$el);
    }
  });

  return AnimationTracksView;
});


define('text!templates/scrubber-detail.mustache',[],function () { return '<label class="rt-label-input-pair rt-row">\n  <p>Zoom: </p>\n  <input type="text" class="rt-scrubber-scale" value="{{initialZoom}}%">\n</label>\n';});

define('views/scrubber-detail',[

  'underscore'
  ,'backbone'
  ,'mustache'

  ,'incrementer-field'

  ,'../rekapi.timeline.constants'

  ,'text!../templates/scrubber-detail.mustache'

  ], function (

  _
  ,Backbone
  ,Mustache

  ,IncrementerFieldView

  ,rekapiTimelineConstants

  ,scrubberDetailTemplate

  ) {
  'use strict';

  var ScrubberView = Backbone.View.extend({
    events: {
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.render();

      this.scrubberScaleView = new IncrementerFieldView({
        el: this.$el.find('.rt-scrubber-scale')[0]
      });

      _.extend(this.scrubberScaleView, {
        incrementer: 10
        ,mousewheelIncrement: 1
        ,lowerBound: 0
        ,onValReenter: _.bind(function (newScale) {
          this.rekapiTimeline.setTimelineScale(newScale / 100);
        }, this)
      });
    }

    ,render: function () {
      this.$el.html(Mustache.render(scrubberDetailTemplate, {
        initialZoom: this.rekapiTimeline.timelineScale * 100
      }));
    }
  });

  return ScrubberView;
});


define('text!templates/keyframe-property-detail.mustache',[],function () { return '<h1 class="rt-keyframe-property-name">Detail</h1>\n<label class="rt-label-input-pair rt-row rt-keyframe-property-millisecond">\n  <p>Millisecond:</p>\n  <input type="text" value="" name="millisecond">\n</label>\n<label class="rt-label-input-pair rt-row rt-keyframe-property-value">\n  <p>Value:</p>\n  <input type="text" value="" name="value">\n</label>\n<label class="rt-label-input-pair rt-row rt-select-container rt-keyframe-property-easing">\n  <p>Easing:</p>\n  <select name="easing"></select>\n</label>\n<button class="rt-field-button rt-add">Add a new keyframe</button>\n<button class="rt-field-button rt-delete">Remove this keyframe</button>\n';});

define('views/keyframe-property-detail',[

  'underscore'
  ,'backbone'
  ,'mustache'
  ,'shifty'

  ,'incrementer-field'

  ,'../rekapi.timeline.constants'

  ,'text!../templates/keyframe-property-detail.mustache'

], function (

  _
  ,Backbone
  ,Mustache
  ,Tweenable

  ,IncrementerFieldView

  ,rekapiTimelineConstants

  ,keyframePropertyDetailTemplate

) {
  'use strict';

  var KeyframePropertyDetailView = Backbone.View.extend({
    events: {
      'change input': 'onChangeInput'
      ,'change select': 'onChangeInput'
      ,'click .rt-add': 'onClickAdd'
      ,'click .rt-delete': 'onClickDelete'
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.initialRender();
      this.$propertyName = this.$el.find('.rt-keyframe-property-name');
      this.$propertyEasing =
          this.$el.find('.rt-keyframe-property-easing select');

      this.propertyMillisecondView = new IncrementerFieldView({
        el: this.$el.find('.rt-keyframe-property-millisecond input')[0]
      });

      this.propertyMillisecondView.onValReenter = _.bind(function () {
        if (this.activeKeyframePropertyModel) {
          this.propertyMillisecondView.$el.trigger('change');
        } else {
          this.propertyMillisecondView.$el.val('');
        }
      }, this);

      this.propertyValueView = new IncrementerFieldView({
        el: this.$el.find('.rt-keyframe-property-value input')[0]
      });

      this.propertyValueView.onValReenter = _.bind(function () {
        if (this.activeKeyframePropertyModel) {
          this.propertyValueView.$el.trigger('change');
        } else {
          this.propertyValueView.$el.val('');
        }
      }, this);

      this.listenTo(this.rekapiTimeline, 'focusKeyframeProperty',
          _.bind(this.onFocusKeyframeProperty, this));
    }

    ,initialRender: function () {
      this.$el.html(keyframePropertyDetailTemplate);
    }

    ,render: function () {
      this.$propertyName.text(this.activeKeyframePropertyModel.get('name'));
      this.propertyMillisecondView.$el.val(
          this.activeKeyframePropertyModel.get('millisecond'));
      this.propertyValueView.$el.val(
          this.activeKeyframePropertyModel.get('value'));
    }

    ,onChangeInput: function (evt) {
      var $target = $(evt.target);
      this.activeKeyframePropertyModel.set($target.attr('name'), $target.val());
      this.rekapiTimeline.update();
    }

    ,onClickAdd: function () {
      this.addNewKeyframeProperty();
    }

    ,onClickDelete: function () {
      this.deleteCurrentKeyframeProperty();
    }

    ,onFocusKeyframeProperty: function (evt) {
      if (this.activeKeyframePropertyModel) {
        this.stopListening(this.activeKeyframePropertyModel);
      }

      this.activeKeyframePropertyModel = evt.targetView.model;
      this.listenTo(this.activeKeyframePropertyModel, 'change',
          _.bind(this.render, this));

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

    ,addNewKeyframeProperty: function () {
      if (!this.activeKeyframePropertyModel) {
        return;
      }

      var activeKeyframePropertyModel = this.activeKeyframePropertyModel;
      var actorModel = activeKeyframePropertyModel.getActorModel();

      var targetMillisecond =
          activeKeyframePropertyModel.get('millisecond') +
          rekapiTimelineConstants.NEW_KEYFRAME_PROPERTY_BUFFER_MS;
      var keyframeObject = {};
      keyframeObject[activeKeyframePropertyModel.get('name')] =
          activeKeyframePropertyModel.get('value');

      actorModel.keyframe(
          targetMillisecond
          ,keyframeObject
          ,activeKeyframePropertyModel.get('easing'));

      // Locate the keyframe property's slider and focus it.  Accessing the
      // keyframe property through the DOM has the effect of focusing the
      // property as though the user clicked it manually.
      var selector = [
          '[data-track-name="', activeKeyframePropertyModel.get('name'),
          '"] [data-millisecond="', targetMillisecond, '"]'].join('');
      this.rekapiTimeline.containerView.animationTracksView.$el.find(selector)
          .focus();
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

  return KeyframePropertyDetailView;
});


define('text!templates/container.mustache',[],function () { return '<div class="rt-container-view">\n  <div class="rt-control-bar-view"></div>\n  <div class="rt-timeline">\n    <div class="rt-timeline-wrapper">\n      <div class="rt-scrubber-view"></div>\n      <div class="rt-animation-tracks-view"> </div>\n    </div>\n  </div>\n  <div class="rt-detail-views-container">\n    <div class="rt-scrubber-detail-view"></div>\n    <div class="rt-keyframe-property-detail-view rt-fill"></div>\n  </div>\n</div>\n\n';});

define('views/container',[

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'rekapi.timeline.constants'

  ,'./control-bar'
  ,'./scrubber'
  ,'./animation-tracks'
  ,'./scrubber-detail'
  ,'./keyframe-property-detail'

  ,'text!../templates/container.mustache'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,rekapiTimelineConstants

  ,ControlBarView
  ,ScrubberView
  ,AnimationTracksView
  ,ScrubberDetailView
  ,KeyframePropertyDetailView

  ,containerTemplate

) {
  'use strict';

  var ContainerView = Backbone.View.extend({
    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {HTMLElement} el
     */
    initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;

      this.initialRender();
      this.$timeline = this.$el.find('.rt-timeline');
      this.$timelineWrapper = this.$el.find('.rt-timeline-wrapper');

      this.controlBarView = new ControlBarView({
        el: this.$el.find('.rt-control-bar-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.scrubberView = new ScrubberView({
        el: this.$el.find('.rt-scrubber-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.animationTracksView = new AnimationTracksView({
        el: this.$el.find('.rt-animation-tracks-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.scrubberDetailView = new ScrubberDetailView({
        el: this.$el.find('.rt-scrubber-detail-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.keyframePropertyDetailView = new KeyframePropertyDetailView({
        el: this.$el.find('.rt-keyframe-property-detail-view')[0]
        ,rekapiTimeline: this.rekapiTimeline
      });

      this.listenTo(this.rekapiTimeline, 'update',
          _.bind(this.onRekapiTimelineUpdate, this));

      // This handler must be bound here (as opposed to within ScrubberView)
      // because the order that the addKeyframePropertyTrack handlers are
      // executed is significant.  This particular handler resizes the scrubber
      // guide line.  For that calculation, the DOM that represents the
      // property tracks must be updated.  Binding this handler here ensures
      // that the DOM update occurs before it is measured.
      this.listenTo(this.rekapiTimeline.rekapi, 'addKeyframePropertyTrack',
          _.bind(this.onRekapiAddKeyframePropertyTrack, this));
    }

    ,initialRender: function () {
      this.$el.html(Mustache.render(containerTemplate));
    }

    ,render: function () {
    }

    ,onRekapiTimelineUpdate: function () {
      this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
    }

    ,onRekapiAddKeyframePropertyTrack: function () {
      this.scrubberView.resizeScrubberGuide();
    }

    /**
     * Determines how wide this View's element should be, in pixels.
     * @return {number}
     */
    ,getPixelWidthForTracks: function () {
      var animationLength =
          this.rekapiTimeline.rekapi.getAnimationLength();
      var animationSeconds = (animationLength / 1000);

      // The width of the tracks container should always be the pixel width of
      // the animation plus the width of the timeline element to allow for
      // lengthening of the animation tracks by the user.
      return (rekapiTimelineConstants.PIXELS_PER_SECOND * animationSeconds)
          + this.$timeline.width();
    }
  });

  return ContainerView;
});

define('models/keyframe-property',[

  'underscore'
  ,'backbone'
  ,'rekapi'

], function (

  _
  ,Backbone
  ,Rekapi

  ) {
  'use strict';

  var RekapiTimelineKeyframePropertyModel = Backbone.Model.extend({
    /**
     * @param {Object} attrs Should not contain any properties.
     * @param {Object} opts
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (attrs, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.attributes = opts.keyframeProperty;

      this.rekapiTimeline.rekapi.on('removeKeyframeProperty',
          _.bind(this.onRekapiRemoveKeyframeProperty, this));
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

    ,set: function (key, value) {
      Backbone.Model.prototype.set.apply(this, arguments);

      if (key in this.attributes) {
        // Modify the keyframeProperty via its actor so that the state of the
        // animation is updated.
        var obj = {};
        obj[key] = value;
        this.getActor().modifyKeyframeProperty(
            this.get('name'), this.get('millisecond'), obj);
      }

    }

    /**
     * @return {Rekapi.KeyframeProperty}
     */
    ,getKeyframeProperty: function () {
      return this.attributes;
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes.actor;
    }

    /**
     * @return {RekapiTimelineActorModel}
     */
    ,getActorModel: function () {
      return this.collection.actorModel;
    }

    /**
     * Overrides the standard Backbone.Model#destroy behavior, as there is no
     * server data that thmodel is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  // Proxy all Rekapi.KeyframeProperty.prototype methods to
  // RekapiTimelineKeyframePropertyModel
  _.each(Rekapi.KeyframeProperty.prototype,
      function (keyframePropertyMethod, keyframePropertyMethodName) {
    RekapiTimelineKeyframePropertyModel.prototype[keyframePropertyMethodName] =
        function () {
      return keyframePropertyMethod.apply(this.attributes, arguments);
    };
  }, this);

  return RekapiTimelineKeyframePropertyModel;
});

define('collections/keyframe-property',[

  'underscore'
  ,'backbone'

  ,'../models/keyframe-property'

], function (

  _
  ,Backbone

  ,RekapiTimelineKeyframePropertyModel

  ) {
  'use strict';

  var RekapiTimelineKeyframePropertyCollection = Backbone.Collection.extend({
    model: RekapiTimelineKeyframePropertyModel

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {RekapiTimeline} rekapiTimeline
     *   @param {RekapiTimelineActorModel} actorModel
     */
    ,initialize: function (models, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.actorModel = opts.actorModel;

      this.rekapiTimeline.rekapi.on('addKeyframeProperty',
          _.bind(this.onAddKeyframeProperty, this));
      this.rekapiTimeline.rekapi.on('removeKeyframeProperty',
          _.bind(this.onRemoveKeyframeProperty, this));
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
     * @return {RekapiTimelineKeyframePropertyModel} The keyframe property
     * model that was added.
     */
    ,addKeyframePropertyToCollection: function (keyframeProperty) {
      this.add({}, {
        keyframeProperty: keyframeProperty
        ,rekapiTimeline: this.rekapiTimeline
      });

      return this.findWhere({ id: keyframeProperty.id });
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,removeKeyframePropertyFromCollection: function (keyframeProperty) {
      this.remove(this.findWhere({ id: keyframeProperty.id }));
    }
  });

  return RekapiTimelineKeyframePropertyCollection;
});

define('models/actor',[

  'underscore'
  ,'backbone'
  ,'rekapi'

  ,'../collections/keyframe-property'

], function (

  _
  ,Backbone
  ,Rekapi

  ,RekapiTimelineKeyframePropertyCollection

  ) {
  'use strict';

  var RekapiTimelineActorModel = Backbone.Model.extend({
    /**
     * @param {Object} attrs Should not contain any properties.
     * @param {Object} opts
     *   @param {Rekapi.Actor} actor
     *   @param {RekapiTimeline} rekapiTimeline
     */
    initialize: function (attrs, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.attributes = opts.actor;
      this.getTrackNames().forEach(this.addKeyframePropertyTrack, this);

      this.rekapiTimeline.rekapi.on('addKeyframePropertyTrack',
          _.bind(this.onRekapiAddKeyframePropertyTrack, this));

      this.keyframePropertyCollection =
          new RekapiTimelineKeyframePropertyCollection(null, {
        rekapiTimeline: this.rekapiTimeline
        ,actorModel: this
      });

      this.listenTo(this.keyframePropertyCollection, 'add',
          _.bind(this.onAddKeyframeProperty, this));

      // Backfill the collection with any keyframeProperties the actor may
      // already have
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
      this.trigger('addKeyframeProperty', model);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.trigger('addKeyframePropertyTrack', trackName);
    }

    /**
     * @return {Rekapi.Actor}
     */
    ,getActor: function () {
      return this.attributes;
    }
  });

  // Proxy all Rekapi.Actor.prototype methods to RekapiTimelineActorModel
  _.each(Rekapi.Actor.prototype, function (actorMethod, actorMethodName) {
    RekapiTimelineActorModel.prototype[actorMethodName] = function () {
      return actorMethod.apply(this.attributes, arguments);
    };
  }, this);

  return RekapiTimelineActorModel;
});

define('collections/actor',[

  'underscore'
  ,'backbone'

  ,'../models/actor'

], function (

  _
  ,Backbone

  ,RekapiTimelineActorModel

  ) {
  'use strict';

  var RekapiTimelineActorCollection = Backbone.Collection.extend({
    model: RekapiTimelineActorModel

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {RekapiTimeline} rekapiTimeline
     */
    ,initialize: function (models, opts) {
      this.rekapiTimeline = opts.rekapiTimeline;

      this.rekapiTimeline.rekapi.on('addActor',
          _.bind(this.onRekapiAddActor, this));
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
     * @return {RekapiTimelineActorModel}
     */
    ,addActorToCollection: function (actor) {
      this.add({}, {
        actor: actor
        ,rekapiTimeline: this.rekapiTimeline
      });

      var actorModel = this.findWhere({ id: actor.id });

      return actorModel;
    }
  });

  return RekapiTimelineActorCollection;
});

define('rekapi.timeline',[

  'rekapi'
  ,'underscore'
  ,'backbone'

  ,'./views/container'

  ,'./collections/actor'

  ,'./rekapi.timeline.constants'

  ,'jquery-dragon'

], function (

  Rekapi
  ,_
  ,Backbone

  ,ContainerView

  ,RekapiTimelineActorCollection

  ,rekapiTimelineConstants

) {
  'use strict';

  /**
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @param {HTMLElement} el The element to contain the widget.
   * @constuctor
   */
  function RekapiTimeline (rekapi, el) {
    this.rekapi = rekapi;
    this.timelineScale = rekapiTimelineConstants.DEFAULT_TIMELINE_SCALE;
    this.actorCollection = new RekapiTimelineActorCollection(null, {
      rekapiTimeline: this
    });

    this.containerView = new ContainerView({
      el: el
      ,rekapiTimeline: this
    });

    this.hasRendered = true;
    this.trigger('initialDOMRender');

    this.rekapi.on('timelineModified',
        _.bind(this.onRekapiTimelineModified, this));

    this.trigger('update');
  }

  RekapiTimeline.prototype.onRekapiTimelineModified = function () {
    this.trigger('update');
  };

  /**
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
        distanceFromLeft / rekapiTimelineConstants.PIXELS_PER_SECOND) * 1000;

    return baseMillisecond;
  };

  /**
   * @param {number} newScale
   */
  RekapiTimeline.prototype.setTimelineScale = function (newScale) {
    this.timelineScale = newScale;
    this.trigger('change:timelineScale', newScale);
  };

  /**
   * @param {Object} object
   */
  RekapiTimeline.prototype.dispose = function (object) {
    if (typeof object.stopListening === 'function') {
      object.stopListening();
    }

    _.each(object, function (value, key) {
      if (typeof value !== 'undefined') {
        if (value instanceof $) {
          value.off();
          value.remove();
        }

        delete object[key];
      }
    });
  };

  _.extend(RekapiTimeline.prototype, Backbone.Events);

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   */
  Rekapi.prototype.createTimeline = function (el) {
    return new RekapiTimeline(this, el);
  };

  // Proxy Rekapi.prototype method that do not conflict with Backbone APIs to
  // RekapiTimeline
  var whitelistedProtoMethods =
      _.difference(Object.keys(Rekapi.prototype), ['on', 'off']);
  _.each(whitelistedProtoMethods, function (rekapiMethodName) {
    RekapiTimeline.prototype[rekapiMethodName] = function () {
      return Rekapi.prototype[rekapiMethodName].apply(this.rekapi, arguments);
    };
  }, this);

  return RekapiTimeline;
});

}());