import React from 'react';

const Details = ({
  keyframeProperty = {},
  handleAddKeyframeButtonClick,
  handleDeleteKeyframeButtonClick,
  handleMillisecondInputChange
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
    </div>
  </div>
);

export default Details;
