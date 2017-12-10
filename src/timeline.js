import React from 'react';
import Draggable from 'react-draggable';

// FIXME: There is quite a bit of weird JavaScript-powered styling that needs
// to be ported/adapted from the original version.

const Timeline = ({
  timelineWrapperWidth,
  scrubberPosition,
  handleScrubberDrag,
  handleScrubberBarClick
}) => (
  <div className="fill timeline">
    <div className="timeline-wrapper" style={{ width: timelineWrapperWidth }}>

      <div className="scrubber">
        <div
          className="scrubber-wrapper"
          onClick={e => handleScrubberBarClick(e.nativeEvent.offsetX)}
        >
          <Draggable
            axis="x"
            position={{ x: scrubberPosition, y: 0 }}
            bounds=".scrubber-wrapper"
            onDrag={(e, { x }) => handleScrubberDrag(x) }
          >
            <div
              className="scrubber-handle"
            >
              <i className="glyphicon glyphicon-chevron-down scrubber-icon">&nbsp;</i>
              <figure className="scrubber-guide"></figure>
            </div>
          </Draggable>
        </div>
      </div>

    </div>
  </div>);

export default Timeline;
