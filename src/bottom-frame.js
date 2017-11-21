import React from 'react';

const BottomFrame = props => (
  <div className="fill bottom-frame">
    <div className="control-bar">
      <button className="icon-button play">
        <i className="glyphicon glyphicon-play"></i>
      </button>
      <button className="icon-button pause">
        <i className="glyphicon glyphicon-pause"></i>
      </button>
      <button className="icon-button stop">
        <i className="glyphicon glyphicon-stop"></i>
      </button>
    </div>
    <div className="scrubber-detail"><label className="label-input-pair row scrubber-scale">
      <p>Timeline zoom:</p>
      <input type="number" value="100" min="0" step="10" />
      </label>
      <p className="position-monitor">
        <span>1000</span>ms / <span>1000</span>ms
      </p>
    </div>
  </div>
);

export default BottomFrame;
