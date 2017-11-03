import React, { Component } from 'react';
import Details from './details';
import Timeline from './timeline';
import BottomFrame from './bottom-frame';

export default class RekapiTimeline extends Component {
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
