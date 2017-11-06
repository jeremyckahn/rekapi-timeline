import React from 'react';

const Details = ({
  keyframeProperty = {},
  easingCurves = [],
  handleAddKeyframeButtonClick,
  handleDeleteKeyframeButtonClick,
  handleMillisecondInputChange,
  handleEasingSelectChange
}) => (
  <div className="details">
    <h1 className="keyframe-property-name">
      { keyframeProperty.name || 'Details' }
    </h1>
    <div className="add-delete-wrapper">
      <button
        className="icon-button add"
        title="Add a new keyframe to the current track"
        onClick={handleAddKeyframeButtonClick}
      >
        <i className="glyphicon glyphicon-plus"></i>
      </button>
      <button
        className="icon-button delete"
        title="Remove the currently selected keyframe"
        onClick={handleDeleteKeyframeButtonClick}
      >
        <i className="glyphicon glyphicon-minus"></i>
      </button>
      <label className="label-input-pair row keyframe-property-millisecond">
        <p>Millisecond:</p>
        <input
          className="property-millisecond"
          type="number"
          value={
            keyframeProperty.millisecond === undefined ?
              '' :
              keyframeProperty.millisecond
          }
          name="millisecond"
          min="0"
          onChange={handleMillisecondInputChange}
        />
      </label>
      <label className="label-input-pair row select-container keyframe-property-easing">
        <p>Easing:</p>
        <select
          name="easing"
          onChange={handleEasingSelectChange}
        >
          {easingCurves.map(
            easingCurve => <option key={easingCurve}>{easingCurve}</option>
          )}
        </select>
      </label>
    </div>
  </div>
);

export default Details;
