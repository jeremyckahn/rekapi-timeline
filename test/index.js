import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TestRenderer from 'react-test-renderer';
import sinon from 'sinon';
import assert from 'assert';

import RekapiTimeline from '../src/rekapi-timeline';
import Details from '../src/details';
import Timeline from '../src/timeline';
import BottomFrame from '../src/bottom-frame';

import { basicRekapiExport } from './fixtures/basic-rekapi-export'

Enzyme.configure({ adapter: new Adapter() });

const basicKeyframe1 = basicRekapiExport.actors[0].propertyTracks.transform[0];

let component, testRenderer, testInstance;

describe('RekapiTimeline', () => {
  beforeEach(() => {
    component = shallow(<RekapiTimeline />);
  });

  it('is a react component', () => {
    assert.equal(component.length, 1);
  });
});

describe('Details', () => {
  beforeEach(() => {
    component = shallow(<Details />);
  });

  it('is a react component', () => {
    assert.equal(component.length, 1);
  });

  describe('title', () => {
    let title;
    describe('no keyframe property focused', () => {
      it('has default content', () => {
        title = component.find('.keyframe-property-name');
        assert.equal(title.text(), 'Details');
      });
    });

    describe('with keyframe property focused', () => {
      beforeEach(() => {
        component = shallow(<Details keyframeProperty={basicKeyframe1} />);
      });

      it('displays the property name', () => {
        title = component.find('.keyframe-property-name');
        assert.equal(title.text(), basicKeyframe1.name);
      });
    });
  });

  describe('add button', () => {
    let handleAddKeyframeButtonClick;

    beforeEach(() => {
      handleAddKeyframeButtonClick = sinon.spy();
      component = shallow(
        <Details handleAddKeyframeButtonClick={handleAddKeyframeButtonClick} />
      );

      component.find('.icon-button.add').simulate('click');
    });

    it('fires handleAddKeyframeButtonClick', () => {
      assert(handleAddKeyframeButtonClick.called);
    });
  });

  describe('delete button', () => {
    let handleDeleteKeyframeButtonClick;

    beforeEach(() => {
      handleDeleteKeyframeButtonClick = sinon.spy();
      component = shallow(
        <Details handleDeleteKeyframeButtonClick={handleDeleteKeyframeButtonClick} />
      );

      component.find('.icon-button.delete').simulate('click');
    });

    it('fires handleDeleteKeyframeButtonClick', () => {
      assert(handleDeleteKeyframeButtonClick.called);
    });
  });

  describe('millisecond field', () => {
    let millisecondInput;
    describe('no keyframe property focused', () => {
      it('has default content', () => {
        millisecondInput = component.find('.property-millisecond');
        assert.strictEqual(millisecondInput.props().value, '');
      });
    });

    describe('with keyframe property focused', () => {
      beforeEach(() => {
        component = shallow(<Details keyframeProperty={basicKeyframe1} />);
      });

      it('displays the property millisecond', () => {
        millisecondInput = component.find('.property-millisecond');
        assert.strictEqual(millisecondInput.props().value, basicKeyframe1.millisecond);
      });
    });

    describe('handleMillisecondInputChange', () => {
      let handleMillisecondInputChange;
      beforeEach(() => {
        handleMillisecondInputChange = sinon.spy();

        component = shallow(
          <Details handleMillisecondInputChange={handleMillisecondInputChange} />
        );

        millisecondInput = component.find('.property-millisecond');
        millisecondInput.simulate('change', { target: { value: 5 } });
      });

      it('fires handleMillisecondInputChange', () => {
        assert(handleMillisecondInputChange.called);
      });
    });
  });
});

describe('Timeline', () => {
  beforeEach(() => {
    testRenderer = TestRenderer.create(<Timeline />);
    testInstance = testRenderer.root;
  });

  it('is a react component', () => {
    assert(
      testInstance.findByProps({ className: 'timeline' })
    );
  });
});

describe('BottomFrame', () => {
  beforeEach(() => {
    testRenderer = TestRenderer.create(<BottomFrame />);
    testInstance = testRenderer.root;
  });

  it('is a react component', () => {
    assert(
      testInstance.findByProps({ className: 'bottom-frame' })
    );
  });
});
