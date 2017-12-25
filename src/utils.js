// TODO: The JSDoc namepaths are all off for this file.  The functions defined
// here should be namepath-ed under a "utils" module.

/**
 * @module utils
 */

/**
 * Compute a {@link external:rekapi.propertyData} from a
 * {@link RekapiTimeline.propertyCursor} and a
 * {@link external:rekapi.Rekapi}.
 * @method module:utils.computeHighlightedKeyframe
 * @param {external:rekapi.Rekapi} rekapi
 * @param {RekapiTimeline.propertyCursor} propertyCursor
 * @returns {external:rekapi.propertyData|{}} Is `{}` if the
 * {@link external:rekapi.KeyframeProperty} referenced by `propertyCursor`
 * cannot be found.
 * @static
 */
export const computeHighlightedKeyframe = (rekapi, { property, millisecond }) => {
  const [ actor ] = rekapi.getAllActors();

  if (!actor
    || property === undefined
    || millisecond === undefined
    || !actor.getPropertiesInTrack(property).length
  ) {
    return {};
  }

  const keyframeProperty = actor.getKeyframeProperty(property, millisecond);
  return keyframeProperty ? keyframeProperty.exportPropertyData() : {};
};

/**
 * @method module:utils.computeTimelineWidth
 * @param {external:rekapi.Rekapi} rekapi
 * @param {number} timelineScale A normalized scalar value
 * @returns {number}
 * @static
 */
export const computeTimelineWidth = (rekapi, timelineScale) =>
  rekapi.getAnimationLength() * timelineScale;

/**
 * @method module:utils.computeScrubberPixelPosition
 * @param {external:rekapi.Rekapi} rekapi
 * @param {number} timelineScale A normalized scalar value
 * @returns {number}
 * @static
 */
export const computeScrubberPixelPosition = (rekapi, timelineScale) =>
  computeScaledPixelPosition(
    timelineScale,
    rekapi.getLastPositionUpdated() * rekapi.getAnimationLength()
  );

/**
 * @method module:utils.computeScaledPixelPosition
 * @param {number} timelineScale A normalized scalar value
 * @param {number} rawPixel The pixel value to scale
 * @returns {number}
 * @static
 */
export const computeScaledPixelPosition =
  (timelineScale, rawPixel) => timelineScale * rawPixel;

/**
 * @method module:utils.computeDescaledPixelPosition
 * @param {number} timelineScale A normalized scalar value
 * @param {number} scaledPixel A pixel value that has already been scaled
 * @returns {number}
 * @static
 */
export const computeDescaledPixelPosition =
  (timelineScale, scaledPixel) => Math.floor(scaledPixel / timelineScale);
