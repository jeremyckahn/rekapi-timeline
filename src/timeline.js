import React from 'react';
import Draggable from 'react-draggable';

const Scrubber = ({
  timelineWrapperWidth,
  scrubberPosition,
  handleScrubberDrag,
  handleScrubberBarClick
}) =>
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

const Timeline = ({
  timelineWrapperWidth,
  scrubberPosition,
  handleScrubberDrag,
  handleScrubberBarClick,
  propertyTracks = {}
}) => (
  <div className="fill timeline">
    <div className="timeline-wrapper" style={{ width: timelineWrapperWidth }}>
      <Scrubber
        timelineWrapperWidth={timelineWrapperWidth}
        scrubberPosition={scrubberPosition}
        handleScrubberDrag={handleScrubberDrag}
        handleScrubberBarClick={handleScrubberBarClick}
      />

      <div className="animation-tracks">
        <div className="actor-tracks">
          {Object.keys(propertyTracks).map(trackName => (
            <div
              className="keyframe-property-track"
              key={trackName}
              data-track-name={trackName}
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>);

export default Timeline;
