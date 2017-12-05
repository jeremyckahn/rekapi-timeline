import React from 'react';

// FIXME: The .timeline-wrapper div will need the auto-resizing logic ported
// from the original verison, but that should wait until the nested components
// are implement as there may be better approaches to use than inline style
// updates.
//
// Additionally, there is quite a bit of weird JavaScript-powered styling that
// needs to be ported/adapted from the original version.

const Timeline = props => (
  <div className="fill timeline">
    <div className="timeline-wrapper">

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
