define([

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

      ,'change .property-millisecond': function () {
        // FIXME: Port code from propertyMillisecondView
      }

      ,'change .property-value': function () {
        // FIXME: Port code from propertyValueView
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
