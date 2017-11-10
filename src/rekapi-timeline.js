import { Rekapi } from 'rekapi';
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

export default class RekapiTimeline extends Component {
  /**
   * @param {Object} props
   * @param {rekapi.Rekapi} [props.rekapi]
   * @constructs RekapiTimeline
   */
  constructor ({ rekapi = new Rekapi() }) {
    super(arguments[0]);

    /**
     * @member RekapiTimeline."props.rekapi"
     * @type {external:rekapi.Rekapi}
     */

    this.state = {
      /**
       * @member RekapiTimeline."state.rekapi"
       * @type {external:rekapi.Rekapi}
       */
      rekapi: rekapi.exportTimeline(),

      /**
       * @member RekapiTimeline."state.keyframeCursor"
       * @type {RekapiTimeline.keyframeCursor|{}}
       */
      keyframeCursor: {}
    };

    rekapi.on('timelineModified', () => {
      this.setState({
        rekapi: rekapi.exportTimeline()
      });
    });
  }

  render () {
    return (
      <div className="rekapi-timeline">
        <Details />
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
  computeHighlightedKeyframe (rekapi, keyframeCursor) {
    const [ actor ] = rekapi.getAllActors();

    if (!actor) {
      return {};
    }

    const { property, millisecond } = keyframeCursor;
    const keyframeProperty = actor.getKeyframeProperty(property, millisecond);
    return keyframeProperty ? keyframeProperty.exportPropertyData() : {};
  }
});
