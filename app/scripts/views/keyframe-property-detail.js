define([

  'underscore'
  ,'backbone'
  ,'mustache'
  ,'shifty'

  ,'text!templates/keyframe-property-detail.mustache'

], function (

  _
  ,Backbone
  ,Mustache
  ,Tweenable

  ,keyframePropertyDetailTemplate

) {
  'use strict';

  var KeyframePropertyDetailView = Backbone.View.extend({
    events: {
      'change input': 'onChangeInput'
      ,'change select': 'onChangeInput'
    }

    /**
     * @param {Object}
     *   @param {RekapiTimeline} rekapiTimeline
     */
    ,initialize: function (opts) {
      this.rekapiTimeline = opts.rekapiTimeline;
      this.initialRender();
      this.$propertyName = this.$el.find('.rt-keyframe-property-name');
      this.$propertyValue = this.$el.find('.rt-keyframe-property-value input');
      this.$propertyMillisecond =
          this.$el.find('.rt-keyframe-property-millisecond input');
      this.$propertyEasing =
          this.$el.find('.rt-keyframe-property-easing select');

      this.listenTo(this.rekapiTimeline, 'focusKeyframeProperty',
          _.bind(this.onFocusKeyframeProperty, this));
    }

    ,initialRender: function () {
      this.$el.html(keyframePropertyDetailTemplate);
    }

    ,render: function () {
      this.$propertyName.text(this.activeKeyframePropertyModel.get('name'));
      this.$propertyMillisecond.val(
          this.activeKeyframePropertyModel.get('millisecond'));
      this.$propertyValue.val(this.activeKeyframePropertyModel.get('value'));
    }

    ,onChangeInput: function (evt) {
      var $target = $(evt.target);
      this.activeKeyframePropertyModel.set($target.attr('name'), $target.val());
      this.rekapiTimeline.update();
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
        option.innerText = name;
        inputs.push(option);
      }, this);

      this.$propertyEasing.children().remove();
      this.$propertyEasing.append(inputs).val(
          this.activeKeyframePropertyModel.get('easing'));

      this.render();
    }
  });

  return KeyframePropertyDetailView;
});
