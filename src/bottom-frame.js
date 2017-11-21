import React from 'react';

const Button = ({ name }) =>
  <button className={`icon-button ${name}`}>
    <i className={`glyphicon glyphicon-${name}`}></i>
  </button>

const ControlBar = () =>
  <div className="control-bar">
    <Button name="play" />
    <Button name="pause" />
    <Button name="stop" />
  </div>

const BottomFrame = props => (
  <div className="fill bottom-frame">
    <ControlBar />
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
