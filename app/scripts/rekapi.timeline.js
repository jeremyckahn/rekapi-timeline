define([

  'jquery'
  ,'rekapi'

], function (

  $
  ,Rekapi

) {
  'use strict';

  /**
   * @param {HTMLElement} el The element to contain the widget.
   * @constuctor
   */
  function RekapiTimeline (el) {
    this.$el = $(el);
  }
  Rekapi.Timeline = RekapiTimeline;

  return RekapiTimeline;
});
