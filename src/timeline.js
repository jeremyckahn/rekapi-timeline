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
      onClick={handleScrubberBarClick}
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
  propertyCursor,
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
      className={'keyframe-property-wrapper' + (
        property.name === propertyCursor.property &&
          property.millisecond === propertyCursor.millisecond ?
        ' active' : ''
      )}
    >
      <div
        className="keyframe-property"
      >&nbsp;</div>
    </div>
  </Draggable>

const AnimationTracks = ({
  handlePropertyClick,
  handlePropertyDrag,
  handlePropertyTrackDoubleClick,
  propertyCursor,
  propertyTracks,
  timelineScaleConverter
}) =>
  <div className="animation-tracks">
    <div className="actor-tracks">
      {Object.keys(propertyTracks).map(trackName => (
        <div
          className={'keyframe-property-track' + (
            trackName === propertyCursor.property ? ' active' : ''
          )}
          key={trackName}
          data-track-name={trackName}
          onDoubleClick={e => handlePropertyTrackDoubleClick(e, trackName)}
        >
          {propertyTracks[trackName].map((property, i) =>
            <Property
              key={property.id}
              timelineScaleConverter={timelineScaleConverter}
              property={property}
              propertyCursor={propertyCursor}
              handlePropertyDrag={handlePropertyDrag}
              handlePropertyClick={handlePropertyClick}
            />
          )}
        </div>
      ))}
    </div>
  </div>

const Timeline = ({
  timelineWrapperWidth,
  scrubberPosition,
  handleScrubberDrag,
  handleScrubberBarClick,
  propertyTracks = {},
  timelineScaleConverter = () => {},
  handlePropertyDrag,
  handlePropertyClick,
  handlePropertyTrackDoubleClick,
  propertyCursor = {},

  // FIXME: These are unimplemented and untested
  newTrackName,
  handleChangeNewTrackName = () => {},
  handleKeyDownNewTrackName = () => {},
  handleClickNewTrackButton = () => {}
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
      <AnimationTracks
        handlePropertyClick={handlePropertyClick}
        handlePropertyDrag={handlePropertyDrag}
        handlePropertyTrackDoubleClick={handlePropertyTrackDoubleClick}
        propertyCursor={propertyCursor}
        propertyTracks={propertyTracks}
        timelineScaleConverter={timelineScaleConverter}
      />

      <div className="new-track-name-input-wrapper">
        <button
          className="icon-button add"
          title="Add a new property to animate"
          onClick={handleClickNewTrackButton}
        >
          <i className="glyphicon glyphicon-plus"></i>
        </button>
        <input
          className="new-track-name"
          value={newTrackName}
          onChange={handleChangeNewTrackName}
          onKeyDown={handleKeyDownNewTrackName}
        />
      </div>

    </div>
  </div>

export default Timeline;
