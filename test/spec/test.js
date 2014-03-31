/* global assert, describe, it */
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
  var expect = chai.expect;
  var should = chai.should();

  describe('The code loads', function () {
    it('Should define Rekapi.prototype.createTimeline', function () {
      assert.isFunction(Rekapi.prototype.createTimeline);
    });
  });

});
