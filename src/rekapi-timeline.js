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

  /**
   * Compute a {@link external:rekapi.propertyData} from
   * {@link RekapiTimeline."state.keyframeCursor"} and
   * {@link RekapiTimeline."props.rekapi"} or an empty object if none is found.
   * @return {external:rekapi.propertyData|{}}
   * @method RekapiTimeline#computeHighlightedKeyframe
   */
  computeHighlightedKeyframe () {
    const { rekapi } = this.props;
    const [ actor ] = rekapi.getAllActors();

    if (!actor) {
      return {};
    }

    const { property, millisecond } = this.state.keyframeCursor;
    const keyframeProperty = actor.getKeyframeProperty(property, millisecond);
    return keyframeProperty ? keyframeProperty.exportPropertyData() : {};
  }
}
