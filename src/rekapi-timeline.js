// TODO: This code depends on some ES6 built-ins so document the need for this
// environment dependency: https://babeljs.io/docs/usage/polyfill/

import { Rekapi } from 'rekapi';
import { Tweenable } from 'shifty';
import React, { Component } from 'react';
import Details from './details';
import Timeline from './timeline';
import BottomFrame from './bottom-frame';
import eventHandlers from './event-handlers';
import {
  computeHighlightedKeyframe,
  computeTimelineWidth,
  computeScrubberPixelPosition,
  computeScaledPixelPosition,
  computeDescaledPixelPosition,
} from './utils';

import {
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

const exportTimelineOptions = { withId: true };

export class RekapiTimeline extends Component {
  /**
   * @param {RekapiTimeline.props} props
   * @constructs RekapiTimeline
   */
  constructor ({ rekapi = new Rekapi() }) {
    super(...arguments);

    this.bindMethods();

    const timeline = rekapi.exportTimeline(exportTimelineOptions);

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
      .on('timelineModified', this.onRekapiTimelineModified.bind(this))
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
    Object.keys(eventHandlers).forEach(
      method => this[method] = eventHandlers[method].bind(this)
    );
  }

  /**
   * @method RekapiTimeline#onRekapiTimelineModified
   * @returns {undefined}
   */
  onRekapiTimelineModified () {
    const { rekapi } = this.props;
    const timeline = rekapi.exportTimeline(exportTimelineOptions);

    const oldLength = this.state.animationLength;
    const animationLength = timeline.duration;

    this.setState({
      animationLength,
      rekapi: timeline,
      actor: timeline.actors[0]
    });

    if (!rekapi.isPlaying()) {
      if ((rekapi.getLastPositionUpdated() * oldLength) > animationLength) {
        rekapi.update(animationLength);
      } else {
        rekapi.update();
      }
    }
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
      computeDescaledPixelPosition(timelineScale, rawX)
    );
  }

  /**
   * @method RekapiTimeline#isNewPropertyValueValid
   * @param {external:rekapi.KeyframeProperty} keyframeProperty
   * @param {number|string} newValue
   * @returns {boolean}
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
      computeHighlightedKeyframe(rekapi, propertyCursor) :
      {};

    const isAnyKeyframeHighlighted = !!Object.keys(keyframeProperty).length;

    const timelineWrapperWidth = (rekapi && this.getActor()) ?
      computeTimelineWidth(rekapi, timelineScale) :
      1;

    const propertyTracks = actor ?
      actor.propertyTracks :
      {};

    const scrubberPosition = rekapi ?
      computeScrubberPixelPosition(rekapi, timelineScale) :
      0;

    const timelineScaleConverter =
      computeScaledPixelPosition.bind(null, timelineScale);

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
          handlePropertyDrag={this.handlePropertyDrag}
          handlePropertyClick={this.handlePropertyClick}
          propertyTracks={propertyTracks}
          timelineScaleConverter={timelineScaleConverter}
          handlePropertyTrackDoubleClick={this.handlePropertyTrackDoubleClick}
          propertyCursor={propertyCursor}
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
