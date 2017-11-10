import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import assert from 'assert';

import { Rekapi } from 'rekapi';

import RekapiTimeline from '../src/rekapi-timeline';
import Details from '../src/details';
import Timeline from '../src/timeline';
import BottomFrame from '../src/bottom-frame';

import { basicRekapiExport } from './fixtures/basic-rekapi-export'

Enzyme.configure({ adapter: new Adapter() });

const basicKeyframe1 = basicRekapiExport.actors[0].propertyTracks.transform[0];

let component;

describe('<RekapiTimeline />', () => {
  let rekapi;
  beforeEach(() => {
    component = shallow(<RekapiTimeline />);
  });

  it('is a react component', () => {
    assert.equal(component.length, 1);
  });

  describe('props', () => {
    describe('rekapi', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('accepts and stores a rekapi', () => {
        assert(component.props().rekapi instanceof Rekapi);
      });

      describe('timeline modification', () => {
        beforeEach(() => {
          rekapi.addActor().keyframe(0, { x: 0 });
        });

        it('updates rekapi state when rekapi prop is modified', () => {
          assert.deepEqual(component.state().rekapi, rekapi.exportTimeline());
        });
      });
    });
  });

  describe('state', () => {
    describe('keyframeCursor', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('is empty by default', () => {
        assert.deepEqual(component.state().keyframeCursor, {});
      });
    });
  });

  describe('RekapiTimeline.computeHighlightedKeyframe', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
    });

    it('is a function', () => {
      assert(RekapiTimeline.computeHighlightedKeyframe instanceof Function);
    });

    describe('return values', () => {
      describe('when keyframeCursor is empty', () => {
        it('returns undefined', () => {
          assert.deepEqual(RekapiTimeline.computeHighlightedKeyframe(rekapi, {}), {});
        });
      });

      describe('when keyframeCursor references a keyframe that does not exist', () => {
        it('returns undefined', () => {
          assert.deepEqual(
            RekapiTimeline.computeHighlightedKeyframe(
              rekapi,
              { property: 'x', millisecond: 0 }
            ),
            {}
          );
        });
      });

      describe('when keyframeCursor references a keyframe that does exist', () => {
        beforeEach(() => {
          rekapi.addActor().keyframe(0, { x: 5 });
        });

        it('returns KeyframeProperty data', () => {
          assert.deepEqual(
            RekapiTimeline.computeHighlightedKeyframe(
              rekapi,
              { property: 'x', millisecond: 0 }
            ),
            {
              value: 5,
              name: 'x',
              easing: 'linear',
              millisecond: 0
            }
          );
        });
      });
    });
  });
});

describe('<Details />', () => {
  beforeEach(() => {
    component = mount(<Details />);
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
        component = mount(<Details keyframeProperty={basicKeyframe1} />);
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
      component = mount(
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
      component = mount(
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
        component = mount(<Details keyframeProperty={basicKeyframe1} />);
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

        component = mount(
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

  describe('value field', () => {
    let valueInput;
    describe('no keyframe property focused', () => {
      it('has default content', () => {
        valueInput = component.find('.property-value');
        assert.strictEqual(valueInput.props().value, '');
      });
    });

    describe('with keyframe property focused', () => {
      beforeEach(() => {
        component = mount(<Details keyframeProperty={basicKeyframe1} />);
      });

      it('displays the property value', () => {
        valueInput = component.find('.property-value');
        assert.strictEqual(valueInput.props().value, basicKeyframe1.value);
      });
    });

    describe('handleValueInputChange', () => {
      let handleValueInputChange;
      beforeEach(() => {
        handleValueInputChange = sinon.spy();

        component = mount(
          <Details handleValueInputChange={handleValueInputChange} />
        );

        valueInput = component.find('.property-value');
        valueInput.simulate('change', { target: { value: '5' } });
      });

      it('fires handleValueInputChange', () => {
        assert(handleValueInputChange.called);
      });
    });
  });

  describe('easing selector', () => {
    let easingCurves;

    beforeEach(() => {
      easingCurves = ['ease1', 'ease2', 'ease3'];

      component = mount(
        <Details easingCurves={easingCurves} />
      );
    });

    it('renders a list of easings', () => {
      assert(
        component.find('.keyframe-property-easing select option').length,
        easingCurves.length
      );
    });

    describe('handleEasingSelectChange', () => {
      let handleEasingSelectChange;

      beforeEach(() => {
        handleEasingSelectChange = sinon.spy();
        component = mount(
          <Details handleEasingSelectChange={handleEasingSelectChange} />
        );

        let select = component.find('.keyframe-property-easing select');
        select.simulate('change', { target: { value: 5 } });
      });

      it('fires handleEasingSelectChange', () => {
        assert(handleEasingSelectChange.called);
      });
    });
  });
});

describe('<Timeline />', () => {
  beforeEach(() => {
    component = shallow(<Timeline />);
  });

  it('is a react component', () => {
    assert.equal(component.length, 1);
  });
});

describe('<BottomFrame />', () => {
  beforeEach(() => {
    component = shallow(<BottomFrame />);
  });

  it('is a react component', () => {
    assert.equal(component.length, 1);
  });
});
