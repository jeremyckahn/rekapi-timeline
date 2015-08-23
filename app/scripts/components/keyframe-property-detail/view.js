define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'aenima.component.curve-selector'

  ,'rekapi-timeline/constant'

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
    }

    ,events: {
      'change input': 'onChangeInput'
      ,'change select': 'onChangeInput'

      ,'click .add': function () {
        if (!this.keyframePropertyModel) {
          return;
        }

        var keyframePropertyModel = this.keyframePropertyModel;
        var actorModel = keyframePropertyModel.getOwnerActor();

        var targetMillisecond =
          keyframePropertyModel.get('millisecond') +
          constant.NEW_KEYFRAME_PROPERTY_BUFFER_MS;

        var keyframeObject = {};
        keyframeObject[keyframePropertyModel.get('name')] =
          keyframePropertyModel.get('value');

        actorModel.keyframe(
          targetMillisecond
          ,keyframeObject
          ,keyframePropertyModel.get('easing'));
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
      // TODO: It would be nice if the template could be declaratively bound to
      // the model, rather than having to make DOM updates imperatively here.
      this.$propertyName.text(this.keyframePropertyModel.get('name'));
      this.$propertyMillisecond.val(
        this.keyframePropertyModel.get('millisecond'));
      this.$propertyValue.val(this.keyframePropertyModel.get('value'));
      this.$propertyEasing.val(this.keyframePropertyModel.get('easing'));
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onChangeInput: function (evt) {
      if (!this.keyframePropertyModel) {
        return;
      }

      var $target = $(evt.target);
      var val = $target.val();

      // If the inputted value string can be coerced into an equivalent Number,
      // do it.  Keyframe property values are initially set up as numbers, and
      // this cast prevents the user from inadvertently setting inconsistently
      // typed keyframe property values, thus breaking Rekapi.
      // jshint eqeqeq: false
      var coercedVal = val == +val ? +val : val;

      this.keyframePropertyModel.set($target.attr('name'), coercedVal);
      this.lateralus.update();
    }

    ,reset: function () {
      this.$propertyName.text(this.propertyNameDefaultText);
      this.$propertyMillisecond.val('');
      this.$propertyValue.val('');
    }
  });

  return KeyframePropertyDetailComponentView;
});
