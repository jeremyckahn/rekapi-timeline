import React from 'react';

const Details = ({
  keyframeProperty = {},
  handleAddKeyframeButtonClick
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
    </div>
  </div>
);

export default Details;
