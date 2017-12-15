// TODO: This code depends on some ES6 built-ins so document the need for this
// environment dependency: https://babeljs.io/docs/usage/polyfill/

import { Rekapi } from 'rekapi';
import { Tweenable } from 'shifty';
import React, { Component } from 'react';
import Details from './details';
import Timeline from './timeline';
import BottomFrame from './bottom-frame';

import {
  newPropertyMillisecondBuffer,
  defaultTimelineScale
} from './constants';

/**
 * @typedef RekapiTimeline.propertyCursor
 * @type {Object}
 * @property {string} property
 * @property {number} millisecond
 */

/**
 * @typedef RekapiTimeline.props
 * @type {Object}
 * @property {external:rekapi.Rekapi} rekapi
 */

/**
 * @typedef RekapiTimeline.state
 * @type {Object}
 * @property {external:rekapi.timelineData} rekapi
 * @property {RekapiTimeline.propertyCursor|{}} propertyCursor
 * @property {Array.<string>} easingCurves
 */

const rTokenStringChunks = /([^(-?\d)]+)/g;
const rTokenNumberChunks = /\d+(\.\d+)?/g;

/**
 * @param {string} numberString
 * @returns {string}
 */
const sanitizeDanglingDecimals =
  numberString => numberString.replace(/\d+\.(?=\D)/g,
    match => `${match}0`
  );

export class RekapiTimeline extends Component {
  /**
   * @param {RekapiTimeline.props} props
   * @constructs RekapiTimeline
   */
  constructor ({ rekapi = new Rekapi() }) {
    super(arguments[0]);

    this.bindMethods();

    const timeline = rekapi.exportTimeline();

    this.state = {
      rekapi: timeline,
      actor: timeline.actors[0],
      propertyCursor: {},
      easingCurves: Object.keys(Tweenable.formulas),
      isPlaying: rekapi.isPlaying(),
      timelineScale: defaultTimelineScale,
      animationLength: rekapi.getAnimationLength(),
      currentPosition: rekapi.getLastPositionUpdated()
    };

    rekapi
      .on('timelineModified', () => {
        const timeline = rekapi.exportTimeline();

        this.setState({
          rekapi: timeline,
          animationLength: timeline.duration,
          actor: timeline.actors[0]
        });

        rekapi.update();
      })
      .on('playStateChange', () => {
        this.setState({
          isPlaying: rekapi.isPlaying()
        });
      })
      .on('afterUpdate', () => {
        this.setState({
          currentPosition: rekapi.getLastPositionUpdated()
        });
      });
  }

  /**
   * @method RekapiTimeline#bindMethods
   * @returns {undefined}
   * @private
   */
  bindMethods () {
    [
      'handleAddKeyframeButtonClick',
      'handleDeleteKeyframeButtonClick',
      'handleEasingSelectChange',
      'handleMillisecondInputChange',
      'handleValueInputChange',
      'handlePlayButtonClick',
      'handlePauseButtonClick',
      'handleStopButtonClick',
      'handleTimelineScaleChange',
      'handleScrubberDrag',
      'handleScrubberBarClick'
    ].forEach(method => this[method] = this[method].bind(this));
  }

  /**
   * Method to be called after {@link external:shifty.setBezierFunction} and
   * {@link external:shifty.unsetBezierFunction} are called.  This is needed to
   * update the easing list after {@link external:shifty.Tweenable.formulas} is
   * modified which cannot be done automatically in a cross-browser compatible,
   * performant way.
   * @method RekapiTimeline#updateEasingList
   * @returns {undefined}
   */
  updateEasingList () {
    this.setState({
      easingCurves: Object.keys(Tweenable.formulas)
    });
  }

  /**
   * Returns the current {@link external:rekapi.Actor}.
   * @method RekapiTimeline#getActor
   * @returns {external:rekapi.Actor|undefined}
   * @private
   */
  getActor () {
    return this.props.rekapi.getAllActors()[0];
  }

  /**
   * @method RekapiTimeline#handleAddKeyframeButtonClick
   * @returns {undefined}
   */
  handleAddKeyframeButtonClick () {
    const { props, state } = this;
    const { propertyCursor } = state;

    if (!Object.keys(propertyCursor).length) {
      return;
    }

    const keyframeProperty = RekapiTimeline.computeHighlightedKeyframe(
      props.rekapi,
      propertyCursor
    );

    const newPropertyMillisecond =
      propertyCursor.millisecond + newPropertyMillisecondBuffer;

    this.getActor().keyframe(
      newPropertyMillisecond,
      {
        [propertyCursor.property]: keyframeProperty.value
      }
    );

    this.setState({
      propertyCursor: {
        property: propertyCursor.property,
        millisecond: newPropertyMillisecond
      }
    });
  }

  /**
   * @method RekapiTimeline#handleDeleteKeyframeButtonClick
   * @returns {undefined}
   */
  handleDeleteKeyframeButtonClick () {
    const { millisecond, property } = this.state.propertyCursor;

    const priorProperty = this.getActor().getPropertiesInTrack(property).find(
      ({ nextProperty }) =>
        nextProperty && nextProperty.millisecond === millisecond
    );

    this.getActor().removeKeyframeProperty(
      property,
      millisecond
    );

    this.setState({
      propertyCursor: (priorProperty ?
        {
          property: priorProperty.name,
          millisecond: priorProperty.millisecond
        } :
        {}
      )
    });
  }

  /**
   * @method RekapiTimeline#handleEasingSelectChange
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleEasingSelectChange (e) {
    const { value: easing } = e.target;
    const { propertyCursor: { property, millisecond } } = this.state;

    this.getActor().modifyKeyframeProperty(
      property,
      millisecond,
      { easing }
    );
  }

  /**
   * @method RekapiTimeline#handleMillisecondInputChange
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleMillisecondInputChange (e) {
    const { value } = e.target;
    const { property, millisecond } = this.state.propertyCursor;

    if (!this.getActor().getKeyframeProperty(property, millisecond)) {
      return;
    }

    // Modify the property through the actor so that actor-level cleanup is
    // performed
    this.getActor().modifyKeyframeProperty(
      property,
      millisecond,
      { millisecond: value }
    );

    this.setState({
      propertyCursor: {
        property,
        millisecond: value
      }
    });
  }

  /**
   * @method RekapiTimeline#handleValueInputChange
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleValueInputChange (e) {
    // TODO: A quirk of this logic is that invalid inputs reset the cursor
    // position, which is a pretty bad UX.  This can be addressed with
    // something like the sample provided here:
    // https://github.com/facebook/react/issues/955#issuecomment-160831548
    //
    // This may also be good solution:
    // https://github.com/text-mask/text-mask/tree/master/react#readme
    const { value } = e.target;
    const { property, millisecond } = this.state.propertyCursor;
    const currentProperty =
      this.getActor().getKeyframeProperty(property, millisecond);

    const sanitizedInput = typeof value === 'string' ?
      sanitizeDanglingDecimals(value) :
      value;

    if (!currentProperty
      || !this.isNewPropertyValueValid(currentProperty, sanitizedInput)
    ) {
      return;
    }

    // Modify the property through the actor so that actor-level cleanup is
    // performed
    this.getActor().modifyKeyframeProperty(
      property,
      millisecond,
      { value: sanitizedInput }
    );
  }

  /**
   * @method RekapiTimeline#handlePlayButtonClick
   * @returns {undefined}
   */
  handlePlayButtonClick () {
    this.props.rekapi.playFromCurrent();
  }

  /**
   * @method RekapiTimeline#handlePauseButtonClick
   * @returns {undefined}
   */
  handlePauseButtonClick () {
    this.props.rekapi.pause();
  }

  /**
   * @method RekapiTimeline#handleStopButtonClick
   * @returns {undefined}
   */
  handleStopButtonClick () {
    this.props.rekapi
      .stop()
      .update(0);
  }

  /**
   * @method RekapiTimeline#handleTimelineScaleChange
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleTimelineScaleChange (e) {
    const { value } = e.target;

    this.setState({
      timelineScale: Math.abs(Number(value) / 100)
    });
  }

  /**
   * @method RekapiTimeline#handleScrubberDrag
   * @param {number} x
   * @returns {undefined}
   */
  handleScrubberDrag (x) {
    this.updateToRawX(x);
  }

  /**
   * @method RekapiTimeline#handleScrubberDrag
   * @param {number} x
   * @returns {undefined}
   */
  handleScrubberBarClick (x) {
    this.props.rekapi.pause();
    this.updateToRawX(x);
  }

  /**
   * @method RekapiTimeline#updateToRawX
   * @param {number} rawX Raw pixel value to be scaled against
   * `this.state.timelineScale` before being passed to
   * {@link external:Rekapi.rekapi#update}.
   * @returns {undefined}
   */
  updateToRawX (rawX) {
    const {
      props: { rekapi },
      state: { timelineScale}
    } = this;

    rekapi.update(
      (rawX / rekapi.getAnimationLength()) * (1000 / timelineScale)
    );
  }

  /**
   * @method RekapiTimeline#isNewPropertyValueValid
   * @param {external:rekapi.KeyframeProperty} keyframeProperty
   * @param {number|string} newValue
   * @returns {undefined}
   */
  isNewPropertyValueValid (keyframeProperty, newValue) {
    const { value: currentValue } = keyframeProperty;
    const typeOfNewValue = typeof newValue;

    if (typeof currentValue !== typeOfNewValue) {
      return false;
    }

    if (typeOfNewValue === 'string') {
      const currentTokenChunks = currentValue.match(rTokenStringChunks);
      const newTokenChunks = newValue.match(rTokenStringChunks);

      if (currentTokenChunks.join('') !== newTokenChunks.join('')) {
        return false;
      }

      const currentNumberChunks = currentValue.match(rTokenNumberChunks);
      const newNumberChunks = newValue.match(rTokenNumberChunks);

      if (!currentNumberChunks
        || !newNumberChunks
        || currentNumberChunks.length !== newNumberChunks.length
      ) {
        return false;
      }
    }

    return true;
  }

  render () {
    const {
      props: { rekapi },
      state: {
        actor,
        animationLength,
        currentPosition,
        easingCurves,
        isPlaying,
        propertyCursor,
        timelineScale
      }
    } = this;

    const keyframeProperty = rekapi ?
      RekapiTimeline.computeHighlightedKeyframe(rekapi, propertyCursor) :
      {};

    const isAnyKeyframeHighlighted = !!Object.keys(keyframeProperty).length;

    const timelineWrapperWidth = (rekapi && this.getActor()) ?
      RekapiTimeline.computeTimelineWidth(rekapi, timelineScale) :
      1;

    const propertyTracks = actor ?
      actor.propertyTracks :
      {};

    const scrubberPosition = rekapi ?
      RekapiTimeline.computeScrubberPixelPosition(rekapi, timelineScale) :
      0;

    return (
      <div className="rekapi-timeline-container">
        <Details
          easingCurves={easingCurves}
          keyframeProperty={keyframeProperty}
          handleAddKeyframeButtonClick={this.handleAddKeyframeButtonClick}
          handleDeleteKeyframeButtonClick={this.handleDeleteKeyframeButtonClick}
          handleEasingSelectChange={this.handleEasingSelectChange}
          handleMillisecondInputChange={this.handleMillisecondInputChange}
          handleValueInputChange={this.handleValueInputChange}
        />
        <Timeline
          timelineWrapperWidth={timelineWrapperWidth}
          scrubberPosition={scrubberPosition}
          handleScrubberDrag={this.handleScrubberDrag}
          handleScrubberBarClick={this.handleScrubberBarClick}
          propertyTracks={propertyTracks}
          timelineScaleConverter={RekapiTimeline.computeScaledPixelPosition.bind(null, timelineScale)}
        />
        <BottomFrame
          isPlaying={isPlaying}
          animationLength={animationLength}
          currentPosition={currentPosition}
          timelineScale={timelineScale}
          handlePlayButtonClick={this.handlePlayButtonClick}
          handlePauseButtonClick={this.handlePauseButtonClick}
          handleStopButtonClick={this.handleStopButtonClick}
          handleTimelineScaleChange={this.handleTimelineScaleChange}
        />
      </div>
    );
  }
}

Object.assign(RekapiTimeline, {
  /**
   * Compute a {@link external:rekapi.propertyData} from a
   * {@link RekapiTimeline.propertyCursor} and a
   * {@link external:rekapi.Rekapi}.
   * @method RekapiTimeline.computeHighlightedKeyframe
   * @param {external:rekapi.Rekapi} rekapi
   * @param {RekapiTimeline.propertyCursor} propertyCursor
   * @returns {external:rekapi.propertyData|{}} Is `{}` if the
   * {@link external:rekapi.KeyframeProperty} referenced by `propertyCursor`
   * cannot be found.
   * @static
   */
  computeHighlightedKeyframe (rekapi, { property, millisecond }) {
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
  },

  /**
   * @method RekapiTimeline.computeTimelineWidth
   * @param {external:rekapi.Rekapi} rekapi
   * @param {number} timelineScale A normalized scalar value
   * @returns {number}
   * @static
   */
  computeTimelineWidth: (rekapi, timelineScale) =>
    rekapi.getAnimationLength() * timelineScale,

  /**
   * @method RekapiTimeline.computeScrubberPixelPosition
   * @param {external:rekapi.Rekapi} rekapi
   * @param {number} timelineScale A normalized scalar value
   * @returns {number}
   * @static
   */
  computeScrubberPixelPosition: (rekapi, timelineScale) =>
    RekapiTimeline.computeScaledPixelPosition(
      timelineScale,
      rekapi.getLastPositionUpdated() * rekapi.getAnimationLength()
    ),

  /**
   * @method RekapiTimeline.computeScaledPixelPosition
   * @param {number} timelineScale A normalized scalar value
   * @param {number} rawPixel The pixel value to scale
   * @returns {number}
   * @static
   */
  computeScaledPixelPosition:
    (timelineScale, rawPixel) => rawPixel * timelineScale
});
