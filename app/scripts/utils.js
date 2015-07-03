define([

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
     */
    proxy: function (Source, Target) {
      _.each(Source.prototype,
          function (sourceMethod, sourceMethodName) {
        Target.prototype[sourceMethodName] = function () {
          return sourceMethod.apply(this.attributes, arguments);
        };
      }, this);
    }
  };
});
