import { Rekapi } from 'rekapi';
import React, { Component } from 'react';
import Details from './details';
import Timeline from './timeline';
import BottomFrame from './bottom-frame';

/**
 * @constructs RekapiTimeline
 * @extends {external:React.Component}
 */
export default class RekapiTimeline extends Component {
  /**
   * @param {Object} props
   * @param {rekapi} [props.rekapi]
   */
  constructor ({ rekapi = new Rekapi() }) {
    super(arguments[0]);

    this.state = {
      rekapi: rekapi.exportTimeline()
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
