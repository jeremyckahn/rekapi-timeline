import React from 'react';
import Draggable from 'react-draggable';

import { propertyTrackHeight } from './constants';

const Scrubber = ({
  timelineWrapperWidth,
  scrubberPosition,
  handleScrubberDrag,
  handleScrubberBarClick,
  propertyTracks
}) =>
  <div className="scrubber">
    <div
      className="scrubber-wrapper"
      onClick={e => handleScrubberBarClick(e.nativeEvent.offsetX)}
      style={{ width: timelineWrapperWidth }}
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
          <i className="glyphicon glyphicon-chevron-down scrubber-icon">
            &nbsp;
          </i>
          <figure
            className="scrubber-guide"
            style={{
              height: propertyTrackHeight * Object.keys(propertyTracks).length
            }}
          ></figure>
        </div>
      </Draggable>
    </div>
  </div>

const Property = ({
  timelineScaleConverter,
  property,
  handlePropertyDrag,
  handlePropertyClick
}) =>
  <Draggable
    axis="x"
    position={{ x: timelineScaleConverter(property.millisecond), y: 0 }}
    bounds=".keyframe-property-track"
    onDrag={(e, { x }) => handlePropertyDrag(x, property.name, property.millisecond)}
    onStart={() => handlePropertyClick(property)}
  >
    <div
      className="keyframe-property-wrapper"
    >
      <div className="keyframe-property">&nbsp;</div>
    </div>
  </Draggable>

const Timeline = ({
  timelineWrapperWidth,
  scrubberPosition,
  handleScrubberDrag,
  handleScrubberBarClick,
  propertyTracks = {},
  timelineScaleConverter = () => {},
  handlePropertyDrag,
  handlePropertyClick
}) =>
  <div className="fill timeline">
    <div
      className="timeline-wrapper"
      style={{ width: `calc(100% + ${timelineWrapperWidth}px)`}}
    >
      <Scrubber
        timelineWrapperWidth={timelineWrapperWidth}
        scrubberPosition={scrubberPosition}
        handleScrubberDrag={handleScrubberDrag}
        handleScrubberBarClick={handleScrubberBarClick}
        propertyTracks={propertyTracks}
      />

      <div className="animation-tracks">
        <div className="actor-tracks">
          {Object.keys(propertyTracks).map(trackName => (
            <div
              className="keyframe-property-track"
              key={trackName}
              data-track-name={trackName}
            >
              {propertyTracks[trackName].map((property, i) =>
                <Property
                  key={property.id}
                  timelineScaleConverter={timelineScaleConverter}
                  property={property}
                  handlePropertyDrag={handlePropertyDrag}
                  handlePropertyClick={handlePropertyClick}
                />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>

export default Timeline;
