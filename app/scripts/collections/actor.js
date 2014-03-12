define([

  'underscore'
  ,'backbone'

  ,'models/actor'

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

      _.each(this.rekapiTimeline.rekapi.getAllActors(), function (actor) {
        this.add({}, {
          actor: actor
          ,rekapiTimeline: this.rekapiTimeline
        });
      }, this);
    }
  });

  return RekapiTimelineActorCollection;
});
