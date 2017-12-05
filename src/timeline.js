import React from 'react';

// FIXME: There is quite a bit of weird JavaScript-powered styling that needs
// to be ported/adapted from the original version.

const Timeline = ({
  timelineWrapperWidth
}) => (
  <div className="fill timeline">
    <div className="timeline-wrapper" style={{ width: timelineWrapperWidth }}>

      <div className="scrubber">
        <div className="scrubber-wrapper">
          <div
            className="scrubber-handle"
            draggable="false"
          >
            <i className="glyphicon glyphicon-chevron-down scrubber-icon">&nbsp;</i>
            <figure className="scrubber-guide"></figure>
          </div>
        </div>
      </div>

    </div>
  </div>);

export default Timeline;
