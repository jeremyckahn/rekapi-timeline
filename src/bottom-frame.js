import React from 'react';

const Button = ({ name, handleClick }) =>
  <button
    className={`icon-button ${name}`}
    onClick={handleClick}
  >
    <i className={`glyphicon glyphicon-${name}`}></i>
  </button>

const ControlBar = ({
  handlePlayButtonClick,
  handlePauseButtonClick
}) =>
  <div className="control-bar">
    <Button
      name="play"
      handleClick={handlePlayButtonClick}
    />
    <Button
      name="pause"
      handleClick={handlePauseButtonClick}
    />
    <Button name="stop" />
  </div>

const BottomFrame = ({
  handlePlayButtonClick,
  handlePauseButtonClick
}) => (
  <div className="fill bottom-frame">
    <ControlBar
      handlePlayButtonClick={handlePlayButtonClick}
      handlePauseButtonClick={handlePauseButtonClick}
    />
    <div className="scrubber-detail"><label className="label-input-pair row scrubber-scale">
      <p>Timeline zoom:</p>
      <input type="number" value="100" min="0" step="10" onChange={() => {}} />
      </label>
      <p className="position-monitor">
        <span>1000</span>ms / <span>1000</span>ms
      </p>
    </div>
  </div>
);

export default BottomFrame;
