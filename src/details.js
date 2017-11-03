import React from 'react';

const Details = ({
  keyframeProperty = {}
}) => (
  <div className="details">
    <h1 className="keyframe-property-name">
      { keyframeProperty.name || 'Details' }
    </h1>
  </div>
);

export default Details;
