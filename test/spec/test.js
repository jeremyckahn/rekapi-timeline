/* global describe, it */
define([

  'chai'
  ,'rekapi'

  ,'rekapi.timeline'

], function (

  chai
  ,Rekapi

) {
  'use strict';

  var assert = chai.assert;

  describe('The code loads', function () {
    it('Should define Rekapi.prototype.createTimeline', function () {
      assert.isFunction(Rekapi.prototype.createTimeline);
    });
  });

  describe('Adding an actor is represented on the DOM', function () {
    it('Should create a container for the actor', function () {
      var timelineEl = document.createElement('div');
      var rekapi = new Rekapi(document.body);

      rekapi.addActor();
      rekapi.createTimeline(timelineEl);

      // FIXME: This test is correct, but the behavior is wrong.  There should
      // be a container for each actor, .actor-tracks-view represents all
      // actors.
      assert.equal(
          timelineEl.querySelectorAll('.actor-tracks-view').length, 1);
    });
  });

  describe('Adding a keyframe is represented on the DOM', function () {
    it('Should create an element for a single keyframe', function () {
      var timelineEl = document.createElement('div');
      var rekapi = new Rekapi(document.body);

      rekapi.addActor().keyframe(0, {x: 0});
      rekapi.createTimeline(timelineEl);

      assert.equal(
          timelineEl.querySelectorAll('.keyframe-property-view').length, 1);
    });
  });

  describe('Adding multiple keyframes is represented on the DOM', function () {
    it('Should create elements for a multiple keyframe', function () {
      var timelineEl = document.createElement('div');
      var rekapi = new Rekapi(document.body);

      rekapi.addActor().keyframe(0, {x: 0}).keyframe(1, {x: 1});
      rekapi.createTimeline(timelineEl);

      assert.equal(
          timelineEl.querySelectorAll('.keyframe-property-view').length, 2);
    });
  });

});
