import { Rekapi } from 'rekapi';
import { Tweenable } from 'shifty';
import React, { Component } from 'react';
import Details from './details';
import Timeline from './timeline';
import BottomFrame from './bottom-frame';

/**
 * @typedef RekapiTimeline.keyframeCursor
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
 * @property {RekapiTimeline.keyframeCursor|{}} keyframeCursor
 * @property {Array.<string>} easingCurves
 */

export default class RekapiTimeline extends Component {
  /**
   * @param {RekapiTimeline.props} props
   * @constructs RekapiTimeline
   */
  constructor ({ rekapi = new Rekapi() }) {
    super(arguments[0]);

    this.state = {
      rekapi: rekapi.exportTimeline(),
      keyframeCursor: {},
      easingCurves: Object.keys(Tweenable.formulas)
    };

    rekapi.on('timelineModified', () => {
      this.setState({
        rekapi: rekapi.exportTimeline()
      });
    });
  }

  render () {
    const { props, state } = this;

    const keyframeProperty = props.rekapi ?
      RekapiTimeline.computeHighlightedKeyframe(
        props.rekapi,
        state.keyframeCursor
      ) :
      {};

    return (
      <div className="rekapi-timeline">
        <Details
          easingCurves={state.easingCurves}
          keyframeProperty={keyframeProperty}
        />
        <Timeline />
        <BottomFrame />
      </div>
    );
  }
}

Object.assign(RekapiTimeline, {
  /**
   * Compute a {@link external:rekapi.propertyData} from a
   * {@link RekapiTimeline.keyframeCursor} and a
   * {@link external:rekapi.Rekapi}.
   * @returns {external:rekapi.propertyData|{}} Is `{}` if the
   * {@link external:rekapi.KeyframeProperty} referenced by `keyframeCursor`
   * cannot be found.
   * @method RekapiTimeline.computeHighlightedKeyframe
   * @param {external:rekapi.Rekapi} rekapi
   * @param {RekapiTimeline.keyframeCursor} keyframeCursor
   * @static
   */
  computeHighlightedKeyframe (rekapi, { property, millisecond }) {
    const [ actor ] = rekapi.getAllActors();

    if (!actor || property === undefined || millisecond === undefined) {
      return {};
    }

    const keyframeProperty = actor.getKeyframeProperty(property, millisecond);
    return keyframeProperty ? keyframeProperty.exportPropertyData() : {};
  }
});
