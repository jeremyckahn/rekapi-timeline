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
     * @param {Array.<string>} blacklistedMethodNames A list of method names
     * that should not be copied over from Source.prototype.
     */
    proxy: function (Source, Target, blacklistedMethodNames) {
      var whitelistedMethodNames =
        _.difference(Object.keys(Source.prototype), blacklistedMethodNames);
      var sourceProto = Source.prototype;
      var targetProto = Target.prototype;

      whitelistedMethodNames.forEach(function (methodName) {
        var method = sourceProto[methodName];
        targetProto[methodName] = function () {
          return method.apply(this, arguments);
        };
      }, this);
    }
  };
});
