import React from 'react';
import {
  defaultTimelineScale
} from './constants';

const Button = ({ name, handleClick }) =>
  <button
    className={`icon-button ${name}`}
    onClick={handleClick}
  >
    <i className={`glyphicon glyphicon-${name}`}></i>
  </button>

const ControlBar = ({
  handlePlayButtonClick,
  handlePauseButtonClick,
  handleStopButtonClick,
  isPlaying
}) =>
  <div className="control-bar">
    {isPlaying ?
      <Button
        name="pause"
        handleClick={handlePauseButtonClick}
      /> :
      <Button
        name="play"
        handleClick={handlePlayButtonClick}
      />
    }
    <Button
      name="stop"
      handleClick={handleStopButtonClick}
    />
  </div>

const ScrubberScale = ({
  timelineScale = 0,
  handleTimelineScaleChange = () => {}
}) =>
  <label className="label-input-pair row scrubber-scale">
    <p>Timeline zoom:</p>
    <input
      type="number"
      value={timelineScale * 100}
      min="0"
      step="10"
      onChange={handleTimelineScaleChange}
    />
  </label>

const BottomFrame = ({
  handlePlayButtonClick,
  handlePauseButtonClick,
  handleStopButtonClick,
  handleTimelineScaleChange,
  isPlaying,
  timelineScale,
  currentPosition
}) => (
  <div className="fill bottom-frame">
    <ControlBar
      handlePlayButtonClick={handlePlayButtonClick}
      handlePauseButtonClick={handlePauseButtonClick}
      handleStopButtonClick={handleStopButtonClick}
      isPlaying={isPlaying}
    />
    <div className="scrubber-detail">
      <ScrubberScale
        timelineScale={timelineScale}
        handleTimelineScaleChange={handleTimelineScaleChange}
      />
      <p className="position-monitor">
        <span className="current-position">{currentPosition}</span>ms
        {' / '}
        <span className="animation-length">1000</span>ms
      </p>
    </div>
  </div>
);

export default BottomFrame;
