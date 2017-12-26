import {
  newPropertyMillisecondBuffer
} from './constants';

import {
  computeHighlightedKeyframe,
  computeDescaledPixelPosition
} from './utils';

/**
 * @module eventHandlers
 */

/**
 * @param {string} numberString
 * @returns {string}
 */
const sanitizeDanglingDecimals =
  numberString => numberString.replace(/\d+\.(?=\D)/g,
    match => `${match}0`
  );

export default {
  /**
   * @method module:eventHandlers.handleAddKeyframeButtonClick
   * @returns {undefined}
   */
  handleAddKeyframeButtonClick () {
    const { props, state } = this;
    const { propertyCursor } = state;

    if (!Object.keys(propertyCursor).length) {
      return;
    }

    const keyframeProperty = computeHighlightedKeyframe(
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
  },

  /**
   * @method module:eventHandlers.handleDeleteKeyframeButtonClick
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
  },

  /**
   * @method module:eventHandlers.handleEasingSelectChange
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
  },

  /**
   * @method module:eventHandlers.handleMillisecondInputChange
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
  },

  /**
   * @method module:eventHandlers.handleValueInputChange
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
  },

  /**
   * @method module:eventHandlers.handlePlayButtonClick
   * @returns {undefined}
   */
  handlePlayButtonClick () {
    this.props.rekapi.playFromCurrent();
  },

  /**
   * @method module:eventHandlers.handlePauseButtonClick
   * @returns {undefined}
   */
  handlePauseButtonClick () {
    this.props.rekapi.pause();
  },

  /**
   * @method module:eventHandlers.handleStopButtonClick
   * @returns {undefined}
   */
  handleStopButtonClick () {
    this.props.rekapi
      .stop()
      .update(0);
  },

  /**
   * @method module:eventHandlers.handleTimelineScaleChange
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleTimelineScaleChange (e) {
    const { value } = e.target;

    this.setState({
      timelineScale: Math.abs(Number(value) / 100)
    });
  },

  /**
   * @method module:eventHandlers.handleScrubberDrag
   * @param {number} x
   * @returns {undefined}
   */
  handleScrubberDrag (x) {
    this.updateToRawX(x);
  },

  /**
   * @method module:eventHandlers.handleScrubberBarClick
   * @param {external:React.SyntheticEvent} e
   * @returns {undefined}
   */
  handleScrubberBarClick (e) {
    // Some child elements' drag events propagate through as click events to
    // this handler, so check for that and bail out early if the user actually
    // clicked on the scrubber and not the scrubber bar.
    if (e.target !== e.currentTarget) {
      return;
    }

    const x = e.nativeEvent.offsetX;

    this.props.rekapi.pause();
    this.updateToRawX(x);
  },

  /**
   * @method module:eventHandlers.handlePropertyDrag
   * @param {number} x Target raw, unscaled target x value
   * @param {string} propertyName
   * @param {number} propertyMillisecond Current property millisecond
   * @returns {undefined}
   */
  handlePropertyDrag (x, propertyName, propertyMillisecond) {
    const millisecond = computeDescaledPixelPosition(
        this.state.timelineScale,
        x
      );

    const actor = this.getActor();

    if (actor.hasKeyframeAt(millisecond, propertyName)) {
      // This early return is necessary because react-draggable will fire the
      // onDrag handler for mouse movement along the Y axis (even when
      // configured to be restricted to the X axis).  This would effectively
      // cause the property to moved onto itself, which causes a Rekapi error.
      return;
    }

    actor.modifyKeyframeProperty(propertyName, propertyMillisecond, {
      millisecond
    });

    this.setState({
      propertyCursor: {
        property: propertyName,
        millisecond
      }
    });
  },

  /**
   * @param {external:Rekapi.KeyframeProperty} property
   */
  handlePropertyClick (property) {
    const { millisecond, name } = property;

    this.setState({ propertyCursor: { millisecond, property: name } });
  },

  /**
   * @method module:eventHandlers.handlePropertyTrackDoubleClick
   * @param {external:React.SyntheticEvent} e
   * @param {string} trackName
   * @returns {undefined}
   */
  handlePropertyTrackDoubleClick (e, trackName) {
    const targetMillisecond = computeDescaledPixelPosition(
        this.state.timelineScale,
        e.nativeEvent.offsetX
      );

    const properties = this.getActor().getPropertiesInTrack(trackName);
    const priorProperty = properties.slice().reverse().find(
      property => property.millisecond < targetMillisecond
    ) || properties[0];

    this.getActor().keyframe(
      targetMillisecond,
      { [trackName]: priorProperty.value }
    );

    this.setState({
      propertyCursor: {
        millisecond: targetMillisecond,
        property: trackName
      }
    });
  }
};

