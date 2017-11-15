import React from 'react';

const Header = ({ name }) =>
  <h1 className="keyframe-property-name">
    { name || 'Details' }
  </h1>;

const AddButton = ({ handleAddKeyframeButtonClick }) =>
  <button
    className="icon-button add"
    title="Add a new keyframe to the current track"
    onClick={handleAddKeyframeButtonClick}
  >
    <i className="glyphicon glyphicon-plus"></i>
  </button>

const DeleteButton = ({ handleDeleteKeyframeButtonClick }) =>
  <button
    className="icon-button delete"
    title="Remove the currently selected keyframe"
    onClick={handleDeleteKeyframeButtonClick}
  >
    <i className="glyphicon glyphicon-minus"></i>
  </button>

const MillisecondInput = ({
  handleMillisecondInputChange,
  millisecond = ''
}) =>
  <label className="label-input-pair row keyframe-property-millisecond">
    <p>Millisecond:</p>
    <input
      className="property-millisecond"
      type="number"
      value={millisecond}
      name="millisecond"
      min="0"
      onChange={handleMillisecondInputChange}
    />
  </label>

const ValueInput = ({
  handleValueInputChange = () => {},
  value = ''
}) =>
  <label className="label-input-pair row keyframe-property-value">
    <p>Value:</p>
    <input
      className="property-value"
      type="text"
      value={value}
      name="value"
      onChange={handleValueInputChange}
    />
  </label>

const EasingSelect = ({
  easing = '',
  easingCurves,
  handleEasingSelectChange
}) =>
  <label className="label-input-pair row select-container keyframe-property-easing">
    <p>Easing:</p>
    <select
      name="easing"
      onChange={handleEasingSelectChange}
      value={easing}
    >
      {easing && easingCurves.map(
        easingCurve => <option key={easingCurve}>{easingCurve}</option>
      )}
    </select>
  </label>

const Details = ({
  easingCurves = [],
  handleAddKeyframeButtonClick,
  handleDeleteKeyframeButtonClick,
  handleEasingSelectChange,
  handleMillisecondInputChange,
  handleValueInputChange,
  keyframeProperty = {}
}) => (
  <div className="details">
    <Header name={keyframeProperty.name} />
    <div className="add-delete-wrapper">
      <AddButton handleAddKeyframeButtonClick={handleAddKeyframeButtonClick} />
      <DeleteButton handleDeleteKeyframeButtonClick={handleDeleteKeyframeButtonClick} />
    </div>
    <MillisecondInput
      millisecond={keyframeProperty.millisecond}
      handleMillisecondInputChange={handleMillisecondInputChange}
    />
    <ValueInput
      value={keyframeProperty.value}
      handleValueInputChange={handleValueInputChange}
    />
    <EasingSelect
      easingCurves={easingCurves}
      easing={keyframeProperty.easing}
      handleEasingSelectChange={handleEasingSelectChange}
    />
  </div>
);

export default Details;
