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
  constructor (props) {
    super(props);
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
