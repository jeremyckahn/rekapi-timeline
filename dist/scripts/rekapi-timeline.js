(function () {define('rekapi-timeline/components/container/model',[

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

define('text!rekapi-timeline/components/container/template.mustache',[],function () { return '<div class="$details"></div>\n<div class="$timeline fill"></div>\n<div class="fill bottom-frame">\n  <div class="$controlBar"></div>\n  <div class="$scrubberDetail"></div>\n</div>\n';});

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

    ,DEFAULT_KEYFRAME_PROPERTY_VALUE: 0
    ,DEFAULT_KEYFRAME_PROPERTY_MILLISECOND: 0
  };

  return rekapiTimelineConstants;
});

define('rekapi-timeline/components/container/view',[

  'jquery'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

], function (

  $
  ,Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ContainerComponentView = Base.extend({
    template: template

    ,provide: {
      /**
       * Gets the Rekapi timeline millisecond value for a slider handle-like
       * element.  This is used for converting the position of keyframe DOM
       * elements and the timeline scrubber position into the value it
       * represents in the animation timeline.
       * @param {jQuery} $handle The handle element to retrieve the millisecond
       * value for.
       * @return {number}
       */
      timelineMillisecondForHandle: function ($handle) {
        var distanceFromLeft = parseInt($handle.css('left'), 10) -
          parseInt($handle.parent().css('border-left-width'), 10);
        var baseMillisecond = (
          distanceFromLeft / constant.PIXELS_PER_SECOND) * 1000;

        return baseMillisecond / this.lateralus.model.get('timelineScale');
      }

      /**
       * @param {number} xOffset Should be a pixel value
       * @return {number}
       */
      ,timelineMillisecondForXOffset: function (xOffset) {
        var baseMillisecond = (
          xOffset / constant.PIXELS_PER_SECOND) * 1000;

        return Math.floor(
          baseMillisecond / this.lateralus.model.get('timelineScale'));
      }
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {string} trackName
       */
      'rekapi:removeKeyframePropertyTrack': function (rekapi, trackName) {
        var currentActorModel = this.collectOne('currentActorModel');

        // Remove corresponding inline styles for the removed track
        $(currentActorModel.get('context')).css(trackName, '');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ContainerComponentView;
});

define('rekapi-timeline/components/details/model',[

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


define('text!rekapi-timeline/components/details/template.mustache',[],function () { return '<div class="$keyframePropertyDetail fill"></div>\n';});

define('rekapi-timeline/components/details/view',[

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

define('rekapi-timeline/components/keyframe-property-detail/model',[

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


define('text!rekapi-timeline/components/keyframe-property-detail/template.mustache',[],function () { return '<h1 class="$propertyName keyframe-property-name">Detail</h1>\n<div class="add-delete-wrapper">\n  <button class="icon-button add" title="Add a new keyframe to the current track">\n    <i class="glyphicon glyphicon-plus"></i>\n  </button>\n  <button class="icon-button delete" title="Remove the currently selected keyframe">\n    <i class="glyphicon glyphicon-minus"></i>\n  </button>\n</div>\n<label class="label-input-pair row keyframe-property-millisecond">\n  <p>Millisecond:</p>\n  <input class="$propertyMillisecond property-millisecond" type="number" value="" name="millisecond" min="0">\n</label>\n<label class="label-input-pair row keyframe-property-value">\n  <p>Value:</p>\n  <input class="$propertyValue property-value" type="text" value="" name="value">\n</label>\n<label class="label-input-pair row select-container keyframe-property-easing">\n  <p>Easing:</p>\n  <select class="$propertyEasing" name="easing"></select>\n</label>\n';});


define('text!aenima/components/curve-selector/template.mustache',[],function () { return '{{#curves}}\n<option>{{.}}</option>\n{{/curves}}\n';});

define('aenima/constant',[],function () {
  'use strict';

  return {
    CUSTOM_CURVE_PREFIX: 'customCurve'
    ,HIDABLE_VIEW_TRANSITION_DURATION: 450
    ,HIDABLE_VIEW_TRANSITION_QUICK_DURATION: 250
    ,NEW_KEYFRAME_MS_INCREASE: 1000
    ,NEW_KEYFRAME_X_INCREASE: 200
    ,UNDO_STACK_LIMIT: 50
    ,MODAL_OPACITY: 0.95
    ,CSS_DURATION_LIMIT: 1000 * 60 * 5
    ,INVALID_CLASS: 'invalid'
  };
});

define('aenima/components/curve-selector/view',[

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'aenima/constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,aenimaConstant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var CurveSelectorComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      tweenableCurveCreated: function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     * @param {boolean=} [options.onlyShowCustomCurves]
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,render: function () {
      var currentValue = this.$el.val();
      this.renderTemplate();
      this.$el.val(currentValue);
    }

    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        curves: this.getCurveList()
      });

      return renderData;
    }

    /**
     * @param {Array.<string>}
     */
    ,getCurveList: function () {
      var fullList = Object.keys(Tweenable.prototype.formula);
      return this.onlyShowCustomCurves ?
        fullList.filter(function (curve) {
          return curve.match(aenimaConstant.CUSTOM_CURVE_PREFIX);
        }) : fullList;
    }
  });

  return CurveSelectorComponentView;
});

define('aenima/components/curve-selector/main',[

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var CurveSelectorComponent = Base.extend({
    name: 'curve-selector'
    ,View: View
    ,template: template
  });

  return CurveSelectorComponent;
});

define('rekapi-timeline/components/keyframe-property-detail/view',[

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'aenima/components/curve-selector/main'

  ,'../../constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,CurveSelector

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var R_NUMBER_STRING = /-?\d*\.?\d*/g;

  var KeyframePropertyDetailComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      userFocusedKeyframeProperty: function (keyframePropertyView) {
        if (this.keyframePropertyModel) {
          this.stopListening(this.keyframePropertyModel);
        }

        this.keyframePropertyModel = keyframePropertyView.model;
        this.listenTo(this.keyframePropertyModel, 'change',
          this.render.bind(this));

        var inputs = [];
        _.each(Tweenable.prototype.formula, function (formula, name) {
          var option = document.createElement('option');
          option.innerHTML = name;
          inputs.push(option);
        }, this);

        this.render();
      }

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      ,'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.id === this.keyframePropertyModel.id) {
          this.keyframePropertyModel = null;
          this.reset();
        }
      }

      ,requestDeselectAllKeyframes: function () {
        this.$propertyName.text(this.propertyNameDefaultText);
        this.$propertyValue.val('');
        this.$propertyMillisecond.val('');
        this.$propertyEasing.val('linear');
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'change .property-value': function (evt) {
        var keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return;
        }

        this.emit('beforeUserUpdatesKeyframeValueInput');
        var $target = $(evt.target);
        var val = $target.val();
        var rawNumberStringValue = val.match(R_NUMBER_STRING)[0];
        var currentValue = keyframePropertyModel.get('value');
        var currentValueStructure =
          currentValue.toString().replace(R_NUMBER_STRING, '');
        var newValueStructure = val.replace(R_NUMBER_STRING, '');

        // Attempt to coerce the inputted value into the correct format
        if (!newValueStructure && currentValueStructure.length) {
          $target.val(val + currentValueStructure);
          $target.change();
          return;
        }

        if (
          $.trim(val) === '' ||
          $.trim(rawNumberStringValue) === '' ||
          currentValueStructure !== newValueStructure
        ) {
          this.$propertyValue.val(currentValue);
          return;
        }

        // If the inputted value string can be coerced into an equivalent
        // Number, do it.  Keyframe property values are initially set up as
        // numbers, and this cast prevents the user from inadvertently setting
        // inconsistently typed keyframe property values, thus breaking Rekapi.
        // jshint eqeqeq: false
        var coercedVal = val == +val ? +val : val;

        keyframePropertyModel.set($target.attr('name'), coercedVal);
        this.lateralus.update();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'change .property-millisecond': function (evt) {
        var keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return;
        }

        this.emit('beforeUserUpdatesKeyframeMillisecondInput');
        var $target = $(evt.target);
        var millisecond = +$target.val();

        if (millisecond < 0 ||
            keyframePropertyModel.get('actor').hasKeyframeAt(
              millisecond
              ,keyframePropertyModel.get('name')
            )
          ) {
          return;
        }

        keyframePropertyModel.set('millisecond', millisecond);
        this.lateralus.update();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'change select': function (evt) {
        var keyframePropertyModel = this.keyframePropertyModel;

        if (!keyframePropertyModel) {
          return;
        }

        this.emit('beforeUserUpdatesKeyframeCurveSelector');
        var $target = $(evt.target);
        keyframePropertyModel.set($target.attr('name'), $target.val());
        this.lateralus.update();
      }

      ,'click .add': function () {
        if (!this.keyframePropertyModel) {
          return;
        }

        var keyframePropertyModelJson = this.keyframePropertyModel.toJSON();

        var targetMillisecond =
          keyframePropertyModelJson.millisecond +
          constant.NEW_KEYFRAME_PROPERTY_BUFFER_MS;

        this.emit('requestNewKeyframeProperty', {
          name: keyframePropertyModelJson.name
          ,value: keyframePropertyModelJson.value
          ,easing: keyframePropertyModelJson.easing
          ,millisecond: targetMillisecond
        });
      }

      ,'click .delete': function () {
        if (!this.keyframePropertyModel) {
          return;
        }

        var keyframePropertyModel = this.keyframePropertyModel;
        keyframePropertyModel.getOwnerActor().removeKeyframeProperty(
          keyframePropertyModel.get('name')
          ,keyframePropertyModel.get('millisecond'));
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.propertyNameDefaultText = this.$propertyName.text();

      this.addSubview(CurveSelector.View, {
        el: this.$propertyEasing
      });
    }

    ,render: function () {
      var activeElement = document.activeElement;

      // TODO: It would be nice if the template could be declaratively bound to
      // the model, rather than having to make DOM updates imperatively here.
      this.$propertyName.text(this.keyframePropertyModel.get('name'));
      this.$propertyMillisecond.val(
        this.keyframePropertyModel.get('millisecond'));
      this.$propertyEasing.val(this.keyframePropertyModel.get('easing'));

      this.$propertyValue.val(this.keyframePropertyModel.get('value'));

      if (!this.lateralus.model.get('preventValueInputAutoSelect')) {
        this.$propertyValue.select();
      }

      // Prevent $propertyMillisecond from losing focus, thereby enabling
      // browser-standard keyup/keydown functionality to mostly work
      if (activeElement === this.$propertyMillisecond[0]) {
        this.$propertyMillisecond.focus();
      }
    }

    ,reset: function () {
      this.$propertyName.text(this.propertyNameDefaultText);
      this.$propertyMillisecond.val('');
      this.$propertyValue.val('');
    }
  });

  return KeyframePropertyDetailComponentView;
});

define('rekapi-timeline/components/keyframe-property-detail/main',[

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

define('rekapi-timeline/components/details/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'../keyframe-property-detail/main'

], function (

  Lateralus

  ,Model
  ,View
  ,template

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
      this.keyframePropertyDetailComponent =
        this.addComponent(KeyframePropertyDetailComponent, {
        el: this.view.$keyframePropertyDetail[0]
      });
    }
  });

  return DetailsComponent;
});

define('rekapi-timeline/components/control-bar/model',[

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


define('text!rekapi-timeline/components/control-bar/template.mustache',[],function () { return '<button class="icon-button play">\n  <i class="glyphicon glyphicon-play"></i>\n</button>\n<button class="icon-button pause">\n  <i class="glyphicon glyphicon-pause"></i>\n</button>\n<button class="icon-button stop">\n  <i class="glyphicon glyphicon-stop"></i>\n</button>\n';});

define('rekapi-timeline/components/control-bar/view',[

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

    ,lateralusEvents: {
      'rekapi:playStateChange': function () {
        if (this.lateralus.rekapi.isPlaying()) {
          this.$el.addClass('playing');
        } else {
          this.$el.removeClass('playing');
        }
      }
    }

    ,events: {
      'click .play': function () {
        this.play();
      }

      ,'click .pause': function () {
        this.pause();
      }

      ,'click .stop': function () {
        this.emit('stopAnimation');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      if (this.lateralus.isPlaying()) {
        this.$el.addClass('playing');
      }
    }

    ,play: function () {
      this.lateralus.playFromCurrent();
    }

    ,pause: function () {
      this.lateralus.pause();
    }
  });

  return ControlBarComponentView;
});

define('rekapi-timeline/components/control-bar/main',[

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

define('rekapi-timeline/components/timeline/model',[

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


define('text!rekapi-timeline/components/timeline/template.mustache',[],function () { return '<div class="$timelineWrapper timeline-wrapper">\n  <div class="$scrubber"></div>\n  <div class="$animationTracks"></div>\n  <div class="$newTrackNameInputWrapper new-track-name-input-wrapper">\n    <button class="icon-button add" title="Add a new property to animate">\n      <i class="glyphicon glyphicon-plus"></i>\n    </button>\n    {{#supportedPropertiesAreRestricted}}\n    <select class="$newTrackName new-track-name">\n      {{#supportedProperties}}\n      <option>{{name}}</option>\n      {{/supportedProperties}}\n    </select>\n    {{/supportedPropertiesAreRestricted}}\n    {{^supportedPropertiesAreRestricted}}\n    <input class="$newTrackName new-track-name" value="newProperty"></input>\n    {{/supportedPropertiesAreRestricted}}\n  </div>\n</div>\n';});

define('rekapi-timeline/components/timeline/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;
  var $win = $(window);

  var TimelineComponentView = Base.extend({
    template: template

    ,events: {
      'click .add': function () {
        this.addNewKeyframePropertyFromInput();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'keyup .new-track-name': function (evt) {
        if (evt.which === 13) { // enter key
          this.addNewKeyframePropertyFromInput();
        }
      }
    }

    ,lateralusEvents: {
      'change:timelineDuration': function () {
        this.updateWrapperWidth();
      }
    }

    ,provide: {
      timelineWrapperHeight: function () {
        return this.$timelineWrapper.height() -
          this.$newTrackNameInputWrapper.outerHeight();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.updateWrapperWidth();
      this.windowHandler = this.onWindowResize.bind(this);
      $win.on('resize', this.windowHandler);
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        supportedPropertiesAreRestricted:
          !!this.lateralus.model.get('supportedProperties').length
      });

      return renderData;
    }

    /**
     * @override
     */
    ,dispose: function () {
      $win.off('resize', this.windowHandler);
      baseProto.dispose.apply(this, arguments);
    }

    ,onWindowResize: function () {
      this.updateWrapperWidth();
    }

    /**
     * Determines how wide this View's element should be, in pixels.
     * @return {number}
     */
    ,getPixelWidthForTracks: function () {
      var animationLength = this.lateralus.model.get('timelineDuration');
      var animationSeconds = (animationLength / 1000);

      // The width of the tracks container should always be the pixel width of
      // the animation plus the width of the timeline element to allow for
      // lengthening of the animation tracks by the user.
      return (constant.PIXELS_PER_SECOND * animationSeconds) +
        this.$el.width();
    }

    ,updateWrapperWidth: function () {
      this.$timelineWrapper.css('width', this.getPixelWidthForTracks());
    }

    ,addNewKeyframePropertyFromInput: function () {
      var newTrackName = this.$newTrackName.val();
      var currentActorModel = this.collectOne('currentActorModel');
      var keyframeObject = {};
      var supportedProperties = this.lateralus.model.get('supportedProperties');

      var defaultValue = supportedProperties.length ?
        _.findWhere(supportedProperties, { name: newTrackName }).defaultValue
        : constant.DEFAULT_KEYFRAME_PROPERTY_VALUE;

      keyframeObject[newTrackName] = defaultValue;
      currentActorModel.keyframe(
        constant.DEFAULT_KEYFRAME_PROPERTY_MILLISECOND, keyframeObject);
    }
  });

  return TimelineComponentView;
});

define('rekapi-timeline/components/scrubber/model',[

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


define('text!rekapi-timeline/components/scrubber/template.mustache',[],function () { return '<div class="$scrubberWrapper scrubber-wrapper">\n  <div class="$scrubberHandle scrubber-handle">\n    <i class="glyphicon glyphicon-chevron-down scrubber-icon">&nbsp;</i>\n    <figure class="$scrubberGuide scrubber-guide"></figure>\n  </div>\n</div>\n';});

define('rekapi-timeline/components/scrubber/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,template

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ScrubberComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      'change:timelineScale': function () {
        this.render();
        this.syncContainerToTimelineLength();
      }

      ,'change:timelineDuration': function () {
        this.render();
      }

      ,requestResizeScrubberGuide: function () {
        this.resizeScrubberGuide();
      }

      ,'rekapi:afterUpdate': function () {
        this.render();
      }

      // resizeScrubberGuide calls that are called in response to a Rekapi
      // event must be deferred here so the DOM has a chance to finish building
      // itself
      ,'rekapi:addKeyframePropertyTrack': function () {
        _.defer(this.resizeScrubberGuide.bind(this));
      }

      ,'rekapi:removeKeyframePropertyTrack': function () {
        _.defer(this.resizeScrubberGuide.bind(this));
      }

      ,'rekapi:timelineModified': function () {
        this.syncContainerToTimelineLength();
      }
    }

    ,events: {
      'drag .scrubber-handle': function () {
        var millisecond =
          this.collectOne('timelineMillisecondForHandle', this.$scrubberHandle);
        this.lateralus.update(millisecond);
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'click .scrubber-wrapper': function (evt) {
        if (evt.target !== this.$scrubberWrapper[0]) {
          return;
        }

        var scaledMillisecond =
          this.collectOne('timelineMillisecondForXOffset', evt.offsetX);

        var lateralus = this.lateralus;
        lateralus.pause();
        lateralus.update(scaledMillisecond, true);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.syncContainerToTimelineLength();

      this.$scrubberHandle.dragon({
        within: this.$scrubberWrapper
      });
    }

    ,deferredInitialize: function () {
      this.resizeScrubberGuide();
    }

    ,render: function () {
      this.syncHandleToTimelineLength();
    }

    ,syncContainerToTimelineLength: function () {
      var scaledContainerWidth =
        this.lateralus.model.get('timelineDuration') *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

      this.$scrubberWrapper.width(
        scaledContainerWidth + this.$scrubberHandle.width());
    }

    ,syncHandleToTimelineLength: function () {
      var lastMillisecondUpdated =
        this.lateralus.getLastPositionUpdated() *
        this.lateralus.model.get('timelineDuration');

      var scaledLeftValue =
        lastMillisecondUpdated *
        (constant.PIXELS_PER_SECOND / 1000) *
        this.lateralus.model.get('timelineScale');

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

define('rekapi-timeline/components/scrubber/main',[

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

define('rekapi-timeline/components/animation-tracks/model',[

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


define('text!rekapi-timeline/components/animation-tracks/template.mustache',[],function () { return '';});

define('rekapi-timeline/components/actor-tracks/model',[

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


define('text!rekapi-timeline/components/actor-tracks/template.mustache',[],function () { return '';});

define('rekapi-timeline/components/keyframe-property-track/model',[

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


define('text!rekapi-timeline/components/keyframe-property-track/template.mustache',[],function () { return '';});


define('text!rekapi-timeline/components/keyframe-property/template.mustache',[],function () { return '<div class="$handle keyframe-property" data-name="{{keyframeProperty.name}}" >&nbsp;</div>\n';});

define('rekapi-timeline/components/keyframe-property/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'../../constant'

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
      'mousedown':  function () {
        this.activate();
      }

      ,drag: function () {
        this.updateKeyframeProperty();
      }

      ,dragEnd: function () {
        this.overwriteRedundantProperty();
        this.emit('keyframePropertyDragEnd');
      }

      ,dragStart: function () {
        this.emit('keyframePropertyDragStart');
      }
    }

    ,modelEvents: {
      change: function () {
        this.render();
      }

      ,destroy: function () {
        this.dispose();
      }

      /**
       * @param {KeyframePropertyComponentModel} model
       * @param {boolean} isActive
       */
      ,'change:isActive': function (model, isActive) {
        this.isActivating = isActive;

        if (isActive) {
          this.emit('userFocusedKeyframeProperty', this);
        }

        this.setActiveClass(isActive);
        this.isActivating = false;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        var nextProperty = this.model.get('nextProperty');
        if (nextProperty && nextProperty.id === keyframeProperty.id) {
          this.activate();
        }
      }

      ,'change:timelineScale': function () {
        this.render();
      }

      ,userFocusedKeyframeProperty: function () {
        if (this.isActivating) {
          return;
        }

        this.model.set('isActive', false);
      }

      /**
       * @param {{ name: string, millisecond: number}} nameAndMillisecondOb
       */
      ,activateKeyframePropertyByNameAndMillisecond:
          function (nameAndMillisecondOb) {
        var modelAttrs = this.model.toJSON();

        if (nameAndMillisecondOb.name === modelAttrs.name &&
            nameAndMillisecondOb.millisecond === modelAttrs.millisecond) {
          this.activate();
        }
      }
    }

    ,provide: {
      /**
       * @return {KeyframePropertyComponentView|undefined}
       */
      activeKeyframeProperties: function () {
        if (this.model.get('isActive')) {
          return this;
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {boolean=} doImmediatelyFocus
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.$el.css('visibility', 'hidden');
    }

    ,deferredInitialize: function () {
      this.$el.dragon({
        within: this.$el.parent()
      });

      if (this.doImmediatelyFocus) {
        this.activate();
      }

      this.render();
      this.$el.css('visibility', '');
    }

    ,render: function () {
      var elData = this.$el.data('dragon');
      if (elData && elData.isDragging) {
        return;
      }

      var scaledXCoordinate = (
        constant.PIXELS_PER_SECOND * this.model.get('millisecond')) /
        1000 * this.lateralus.model.get('timelineScale');

      this.$el.css({
        left: scaledXCoordinate
      });
    }

    ,activate: function () {
      this.model.set('isActive', true);
    }

    /**
     * @param {boolean} isActive
     */
    ,setActiveClass: function (isActive) {
      this.$el[isActive ? 'addClass' : 'removeClass']('active');
    }

    /**
     * Reads the state of the UI and persists that to the Rekapi animation.
     */
    ,updateKeyframeProperty: function () {
      var model = this.model;
      var millisecond = Math.round(
        this.collectOne('timelineMillisecondForHandle', this.$el)
      );

      if (
          // This will be true if the user drags the property vertically, which
          // would cause the drag event handler to be called but should not
          // cause any kind of a state change.
          millisecond === model.get('millisecond') ||

          this.doesPropertyAlreadyExistAt(millisecond)) {
        return;
      }

      model.set('millisecond', millisecond);
      this.lateralus.update();
    }

    ,overwriteRedundantProperty: function () {
      var model = this.model;
      var millisecond = Math.round(
        this.collectOne('timelineMillisecondForHandle', this.$el)
      );

      this.emit('beginTemporaryTimelineModifications');
      model.set('millisecond', 1e99);

      if (this.doesPropertyAlreadyExistAt(millisecond)) {
        var actor = model.get('actor');
        actor.removeKeyframeProperty(model.get('name'), millisecond);
      }

      model.set('millisecond', millisecond);
      this.emit('endTemporaryTimelineModifications');
      this.lateralus.update();
    }

    /**
     * @param {number} millisecond
     * @return {boolean}
     */
    ,doesPropertyAlreadyExistAt: function (millisecond) {
      return this.model.get('actor').hasKeyframeAt(
        millisecond, this.model.get('name')
      );
    }
  });

  return KeyframePropertyComponentView;
});

define('rekapi-timeline/components/keyframe-property/main',[

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var KeyframePropertyComponent = Base.extend({
    name: 'keyframe-property'
    ,View: View
    ,template: template
  });

  return KeyframePropertyComponent;
});

define('rekapi-timeline/components/keyframe-property-track/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../keyframe-property/main'

], function (

  _
  ,Lateralus

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
      keyframePropertyAdded: function (newKeyframeProperty) {
        if (newKeyframeProperty.get('name') === this.model.get('trackName')) {
          this.addKeyframePropertyComponent(newKeyframeProperty, true);
        }
      }

      /**
       * @param {KeyframePropertyComponentView} keyframePropertyView
       */
      ,userFocusedKeyframeProperty: function (keyframePropertyView) {
        this.setActiveClass(
          _.contains(
            this.component.components, keyframePropertyView.component
          )
        );
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      dblclick: function (evt) {
        if (evt.target !== this.el) {
          return;
        }

        var scaledMillisecond =
          this.collectOne('timelineMillisecondForXOffset', evt.offsetX);

        this.addNewKeyframeAtMillisecond(scaledMillisecond);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     *   @param {ActorModel} actorModel
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      var trackName = this.model.get('trackName');

      // Is displayed to the user with CSS
      this.$el.attr('data-track-name', trackName);

      // Backfill components for any preexisting keyframeProperties
      this.actorModel.keyframePropertyCollection
        .where({ name: trackName })
        .forEach(function (keyframePropertyModel) {
          this.addKeyframePropertyComponent(keyframePropertyModel, false);
        }.bind(this));
    }

    /**
     * @param {KeyframePropertyModel} keyframePropertyModel
     * @param {boolean} doImmediatelyFocus
     */
    ,addKeyframePropertyComponent:
      function (keyframePropertyModel, doImmediatelyFocus) {

      var keyframePropertyComponent = this.addComponent(
          KeyframePropertyComponent, {
        model: keyframePropertyModel
        ,doImmediatelyFocus: !!doImmediatelyFocus
      });

      this.$el.append(keyframePropertyComponent.view.$el);
    }

    /**
     * @param {boolean} isActive
     */
    ,setActiveClass: function (isActive) {
      this.$el[isActive ? 'addClass' : 'removeClass']('active');
    }

    /**
     * @param {number} millisecond
     */
    ,addNewKeyframeAtMillisecond: function (millisecond) {
      var keyframePropertyComponents = _.chain(this.component.components)
        .filter(function (component) {
          return component.toString() === 'keyframe-property';
        })
        .sortBy(function (component) {
          return component.view.model.get('millisecond');
        })
        .value();

      var previousKeyframePropertyComponent = keyframePropertyComponents[0];
      var i = 1, len = keyframePropertyComponents.length;
      for (i; i < len; i++) {
        if (keyframePropertyComponents[i].view.model.get('millisecond') >
            millisecond) {
          break;
        }

        previousKeyframePropertyComponent = keyframePropertyComponents[i];
      }

      var previousKeyframePropertyModelJson =
        previousKeyframePropertyComponent.view.model.toJSON();

      this.emit('requestNewKeyframeProperty', {
        name: previousKeyframePropertyModelJson.name
        ,value: previousKeyframePropertyModelJson.value
        ,easing: previousKeyframePropertyModelJson.easing
        ,millisecond: millisecond
      });
    }
  });

  return KeyframePropertyTrackComponentView;
});

define('rekapi-timeline/components/keyframe-property-track/main',[

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

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {string} trackName
       */
      'rekapi:removeKeyframePropertyTrack': function (rekapi, trackName) {
        if (trackName === this.model.get('trackName')) {
          this.dispose();
        }
      }
    }
  });

  return KeyframePropertyTrackComponent;
});

define('rekapi-timeline/components/actor-tracks/view',[

  'lateralus'

  ,'text!./template.mustache'

  ,'../keyframe-property-track/main'

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
      keyframePropertyTrackAdded: function (newTrackName) {
        this.addKeyframePropertyTrackComponent(newTrackName);
      }

      ,beforeDispose: function () {
        this.component.dispose();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.keyframePropertyTrackComponents = [];

      // Backfill any preexisting tracks
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

define('rekapi-timeline/components/actor-tracks/main',[

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

define('rekapi-timeline/components/animation-tracks/view',[

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'../actor-tracks/main'

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

    ,lateralusEvents: {
      /**
       * @param {RekapiTimelineActorModel} actorModel
       */
      actorAdded: function (actorModel) {
        this.addActorComponent(actorModel);
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.actorTracksComponents = [];

      // Backfill any preexisting ActorModels
      this.collectOne('actorCollection').each(this.addActorComponent, this);
    }

    /**
     * @param {RekapiTimelineActorModel} actorModel
     */
    ,addActorComponent: function (actorModel) {
      var actorTracksComponent = this.addComponent(ActorTracksComponent, {
        model: actorModel
      });

      this.actorTracksComponents.push(actorTracksComponent);
      this.$el.append(actorTracksComponent.view.$el);
    }
  });

  return AnimationTracksComponentView;
});

define('rekapi-timeline/components/animation-tracks/main',[

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

define('rekapi-timeline/components/timeline/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'../scrubber/main'
  ,'../animation-tracks/main'

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

define('rekapi-timeline/components/scrubber-detail/model',[

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


define('text!rekapi-timeline/components/scrubber-detail/template.mustache',[],function () { return '<label class="label-input-pair row scrubber-scale">\n  <p>Timeline zoom:</p>\n  <input type="number" class="$scrubberScale" value="{{initialZoom}}" min="0" step="10">\n</label>\n<p class="position-monitor">\n  <span class="$currentPosition"></span>ms / <span class="$animationLength"></span>ms\n</p>\n';});

define('rekapi-timeline/components/scrubber-detail/view',[

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

    ,lateralusEvents: {
      'change:timelineDuration': function () {
        this.renderAnimationLength();
      }

      ,'rekapi:afterUpdate': function () {
        this.renderCurrentPosition();
      }
    }

    ,events: {
      'change .scrubber-scale input': function () {
        if (this.$scrubberScale[0].validity.valid) {
          this.lateralus.model.set(
            'timelineScale', (this.$scrubberScale.val() / 100));
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.renderAnimationLength();
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        initialZoom: this.lateralus.model.get('timelineScale') * 100
      });

      return renderData;
    }

    ,renderAnimationLength: function () {
      this.$animationLength.text(this.lateralus.model.get('timelineDuration'));
    }

    ,renderCurrentPosition: function () {
      var lateralus = this.lateralus;
      var currentPosition =
        lateralus.getLastPositionUpdated() *
        lateralus.model.get('timelineDuration');

      // Default the rendered value to 0, as currentPosition may be NaN.
      this.$currentPosition.text(Math.floor(currentPosition) || 0);
    }
  });

  return ScrubberDetailComponentView;
});

define('rekapi-timeline/components/scrubber-detail/main',[

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

define('rekapi-timeline/components/container/main',[

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

  ,'../details/main'
  ,'../control-bar/main'
  ,'../timeline/main'
  ,'../scrubber-detail/main'

], function (

  Lateralus

  ,Model
  ,View
  ,template

  ,DetailsComponent
  ,ControlBarComponent
  ,TimelineComponent
  ,ScrubberDetailComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ContainerComponent = Base.extend({
    name: 'rekapi-timeline-container'
    ,Model: Model
    ,View: View
    ,template: template

    ,initialize: function () {
      this.detailsComponent = this.addComponent(DetailsComponent, {
        el: this.view.$details[0]
      });

      this.controlBar = this.addComponent(ControlBarComponent, {
        el: this.view.$controlBar[0]
      });

      this.timelineComponent = this.addComponent(TimelineComponent, {
        el: this.view.$timeline[0]
      });

      this.scrubberDetailComponent =
        this.addComponent(ScrubberDetailComponent, {
        el: this.view.$scrubberDetail[0]
      });
    }
  });

  return ContainerComponent;
});

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

  ,'./constant'

], function (

  _
  ,Lateralus

  ,constant

) {
  'use strict';

  var RekapiTimelineModel = Lateralus.Model.extend({
    defaults: {
      timelineScale: constant.DEFAULT_TIMELINE_SCALE
      ,timelineDuration: 0

      // @type {Array.<{name: string, defaultValue: string}>}
      ,supportedProperties: []

      ,preventValueInputAutoSelect: false
    }
  });

  return RekapiTimelineModel;
});

define('rekapi-timeline/models/keyframe-property',[

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'../utils'

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
      ,isActive: false
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.id === this.id) {
          this.destroy();
        }
      }
    }

    /**
     * @param {Object} attributes
     *   @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.KeyframeProperty instance.
      this.attributes = this.attributes.keyframeProperty;
      _.defaults(this.attributes,
        _.omit(KeyframePropertyModel.prototype.defaults, 'keyframeProperty'));

      this.id = this.attributes.id;
    }

    /**
     * @override
     */
    ,set: function (key, value) {
      if (typeof key === 'string') {
        var oldValue = this.get(key);

        if (key in this.attributes) {
          if (this.get(key) === value) {
            return;
          }

          // Modify the keyframeProperty via its actor so that the state of the
          // animation is updated.
          var obj = {};
          obj[key] = value;
          this.attributes.actor.modifyKeyframeProperty(
              this.attributes.name, this.attributes.millisecond, obj);
        }

        this.attributes[key] = oldValue;
      }

      Backbone.Model.prototype.set.apply(this, arguments);
    }

    /**
     * @return {RekapiTimelineActorModel}
     */
    ,getOwnerActor: function () {
      return this.collection.actorModel;
    }

    /**
     * Override the standard Backbone.Model#destroy behavior, as there is no
     * server data that this model is tied to.
     * @override
     */
    ,destroy: function () {
      this.trigger('destroy');
    }
  });

  utils.proxy(Rekapi.KeyframeProperty, KeyframePropertyModel, {
    subject: function () {
      return this.attributes;
    }
  });

  return KeyframePropertyModel;
});

define('rekapi-timeline/collections/keyframe-property',[

  'backbone'
  ,'lateralus'

  ,'../models/keyframe-property'

], function (

  Backbone
  ,Lateralus

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      'rekapi:addKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.actorModel.id) {
          this.addKeyframeProperty(keyframeProperty);
        }
      }

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      ,'rekapi:removeKeyframeProperty': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.actorModel.id) {
          this.removeKeyframeProperty(keyframeProperty);
        }
      }
    }

    /**
     * @param {null} models Should not contain anything.
     * @param {Object} opts
     *   @param {ActorModel} actorModel The actorModel that "owns" this
     *   collection.
     */
    ,initialize: function (models, opts) {
      this.actorModel = opts.actorModel;
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,addKeyframeProperty: function (keyframeProperty) {
      var keyframePropertyModel = this.initModel(KeyframePropertyModel, {
        keyframeProperty: keyframeProperty
      });

      this.emit('keyframePropertyAdded', this.add(keyframePropertyModel));
    }

    /**
     * @param {Rekapi.KeyframeProperty} keyframeProperty
     */
    ,removeKeyframeProperty: function (keyframeProperty) {
      this.remove(keyframeProperty.id);
    }
  });

  return KeyframePropertyCollection;
});

define('rekapi-timeline/models/actor',[

  'lateralus'
  ,'rekapi'

  ,'../collections/keyframe-property'

  ,'../utils'

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

    ,provide: {
      /**
       * NOTE: This won't work if rekapi-timeline ever supports multiple
       * actors.
       * @return {ActorModel}
       */
      currentActorModel: function () {
        return this;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {{
       *   name: string,
       *   value: number|string,
       *   millisecond: number,
       *   easing: string }} args
       */
      requestNewKeyframeProperty: function (args) {
        var stateObj = {};
        stateObj[args.name] = args.value;
        this.keyframe(args.millisecond, stateObj, args.easing);
      }

      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.KeyframeProperty} keyframeProperty
       */
      ,'rekapi:addKeyframePropertyTrack': function (rekapi, keyframeProperty) {
        if (keyframeProperty.actor.id === this.id) {
          this.addKeyframePropertyTrack(keyframeProperty.name);
        }
      }

      ,'rekapi:removeActor': function (rekapi, actor) {
        if (actor.id === this.id) {
          this.dispose();
        }
      }
    }

    /**
     * @param {Object} attrs
     *   @param {Rekapi.Actor} actor
     */
    ,initialize: function () {
      // Have all Backbone.Model.prototype methods act upon the
      // Rekapi.Actor instance.
      this.attributes = this.attributes.actor;

      this.id = this.attributes.id;
      this.getTrackNames().forEach(this.addKeyframePropertyTrack, this);

      var keyframePropertyCollection = this.initCollection(
        KeyframePropertyCollection
        ,null
        ,{ actorModel: this }
      );

      this.keyframePropertyCollection = keyframePropertyCollection;

      // Backfill the collection with any keyframeProperties the actor may
      // already have.
      this.getTrackNames().forEach(function (trackName) {
        this.getPropertiesInTrack(trackName).forEach(
          keyframePropertyCollection.addKeyframeProperty,
          keyframePropertyCollection);
      }, this);
    }

    /**
     * @param {string} trackName
     */
    ,addKeyframePropertyTrack: function (trackName) {
      this.emit('keyframePropertyTrackAdded', trackName);
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

  'underscore'
  ,'backbone'
  ,'lateralus'

  ,'../models/actor'

], function (

  _
  ,Backbone
  ,Lateralus

  ,ActorModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var ActorCollection = Base.extend({
    model: ActorModel

    ,provide: {
      /**
       * @return {ActorCollection}
       */
      actorCollection: function () {
        return this;
      }
    }

    ,lateralusEvents: {
      /**
       * @param {Rekapi} rekapi
       * @param {Rekapi.Actor} actor
       */
      'rekapi:addActor': function (rekapi, actor) {
        this.addActor(actor);
      }
    }

    ,initialize: function () {
      // Backfill any existing actors into the collection.
      _.each(this.lateralus.getAllActors(), this.addActor, this);
    }

    /**
     * @param {Rekapi.Actor} actor
     */
    ,addActor: function (actor) {
      var actorModel = this.initModel(ActorModel, { actor: actor });
      this.emit('actorAdded', this.add(actorModel));
    }
  });

  return ActorCollection;
});

define('rekapi-timeline/rekapi-timeline',[

  'underscore'
  ,'lateralus'
  ,'rekapi'

  ,'./components/container/main'

  ,'./utils'
  ,'./model'
  ,'./collections/actor'

  // Silent dependency
  ,'jquery-dragon'

], function (

  _
  ,Lateralus
  ,Rekapi

  ,ContainerComponent

  ,utils
  ,RekapiTimelineModel
  ,ActorCollection

) {
  'use strict';

  /**
   * @param {Element} el
   * @param {Rekapi} rekapi The Rekapi instance that this widget represents.
   * @param {Object} config
   * @param {Array.<string>=} [config.supportedProperties]
   * @param {boolean=} [config.preventValueInputAutoSelect]
   * @extends {Lateralus}
   * @constructor
   */
  var RekapiTimeline = Lateralus.beget(function (el, rekapi, config) {
    Lateralus.apply(this, arguments);
    this.rekapi = rekapi;
    this.model.set(config);

    // This must happen in the RekapiTimelineModel constructor, rather than in
    // RekapiTimelineModel's initialize method, as this.lateralus.rekapi is not
    // set up when that method executes.
    this.model.set('timelineDuration', this.getAnimationLength());

    this.globalRenderData = this.model.pick('supportedProperties');

    // Amplify all Rekapi events to "rekapi:" lateralusEvents.
    this.getEventNames().forEach(function (eventName) {
      this.rekapi.on(eventName, function () {
        this.emit.apply(
          this, ['rekapi:' + eventName].concat(_.toArray(arguments)));
      }.bind(this));
    }.bind(this));

    this.actorCollection = this.initCollection(ActorCollection);

    this.containerComponent = this.addComponent(ContainerComponent, {
      el: el
    });
  }, {
    Model: RekapiTimelineModel
  });

  _.extend(RekapiTimeline.prototype, {
    lateralusEvents: {
      stopAnimation: function () {
        this.stop().update(0);
      }

      ,'rekapi:removeKeyframePropertyComplete': function () {
        if (!this.isPlaying()) {
          // This operation needs to be deferred because Rekapi's
          // removeKeyframeProperty event is fired at point in the keyframe
          // removal process where calling update() would not reflect the new
          // state of the timeline.  However, this only needs to be done if the
          // animation is not already playing.
          var timelineDuration = this.model.get('timelineDuration');
          var lastMillisecondUpdated = this.getLastMillisecondUpdated();

          // Passing undefined to Rekapi#update causes a re-render of the
          // previously rendered frame.  If the previously rendered frame is
          // greater than the length of the timeline (possible in this case
          // because this executes within the rekapi:removeKeyframeProperty
          // event handler), update to the last frame in the timeline.
          var updateMillisecond = lastMillisecondUpdated > timelineDuration ?
              timelineDuration : undefined;

          this.update(updateMillisecond);
        }
      }

      ,'rekapi:timelineModified': function () {
        if (!this.isPlaying()) {
          var timelineDuration = this.model.get('timelineDuration');

          if (this.getLastMillisecondUpdated() > timelineDuration) {
            this.update(timelineDuration);
          }
        }

        this.model.set('timelineDuration', this.getAnimationLength());
      }
    }

    /**
     * @param {number=} opt_millisecond Same as Rekapi#update
     * @param {boolean=} opt_doResetLaterFnKeyframes Same as Rekapi#update
     * @return {Rekapi}
     */
    ,update: function () {
      var rekapi = this.rekapi;

      try {
        rekapi.update.apply(rekapi, arguments);
      } catch (e) {
        if (e.name === 'TypeError') {
          this.warn('Keyframe property format mismatch detected');
        } else {
          this.warn(e);
        }
      }

      return this.rekapi;
    }

    /**
     * @return {number}
     */
    ,getLastMillisecondUpdated: function () {
      return this.getLastPositionUpdated() * this.model.get('timelineDuration');
    }
  });

  // Decorate the Rekapi prototype with an init method.
  /**
   * @param {HTMLElement} el The element to contain the widget.
   * @param {Object=} [config]
   */
  Rekapi.prototype.createTimeline = function (el, config) {
    return new RekapiTimeline(el, this, config || {});
  };

  utils.proxy(Rekapi, RekapiTimeline, {
    blacklistedMethodNames: ['on', 'off', 'trigger', 'update']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiTimeline;
});

define('rekapi-timeline', ['rekapi-timeline/rekapi-timeline'], function (main) { return main; });

}());