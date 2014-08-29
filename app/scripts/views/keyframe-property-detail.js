define([

  'underscore'
  ,'backbone'
  ,'mustache'
  ,'shifty'

  ,'incrementer-field'

  ,'rekapi.timeline.constants'

  ,'text!templates/keyframe-property-detail.mustache'

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
        option.innerText = name;
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
