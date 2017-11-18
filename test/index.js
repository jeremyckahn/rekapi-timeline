import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import assert from 'assert';

import { Rekapi } from 'rekapi';
import {
  setBezierFunction,
  unsetBezierFunction
} from 'shifty';

import RekapiTimeline from '../src/rekapi-timeline';
import Details from '../src/details';
import Timeline from '../src/timeline';
import BottomFrame from '../src/bottom-frame';

import {
  newPropertyMillisecondBuffer
} from '../src/constants';

import { basicRekapiExport } from './fixtures/basic-rekapi-export'
import {
  decoupledRekapiStringExport
} from './fixtures/decoupled-rekapi-string-export'
import {
  decoupledRekapiNumberExport
} from './fixtures/decoupled-rekapi-number-export'

Enzyme.configure({ adapter: new Adapter() });

const [
  basicProperty1,
  basicProperty2
] = basicRekapiExport.actors[0].propertyTracks.transform;

const [
  translateXStringProperty1
] = decoupledRekapiStringExport.actors[0].propertyTracks.translateX;

const [
  translateXNumberProperty1
] = decoupledRekapiNumberExport.actors[0].propertyTracks.translateX;

let component;

describe('<RekapiTimeline />', () => {
  let rekapi;

  const getActor = () => rekapi.getAllActors()[0];

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
    describe('propertyCursor', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('is empty by default', () => {
        assert.deepEqual(component.state().propertyCursor, {});
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
      describe('when propertyCursor is empty', () => {
        it('returns empty object', () => {
          assert.deepEqual(
            RekapiTimeline.computeHighlightedKeyframe(rekapi, {}),
            {}
          );
        });
      });

      describe('when rekapi has an actor and propertyCursor is empty', () => {
        beforeEach(() => {
          rekapi.addActor();
        });

        it('returns empty object', () => {
          assert.deepEqual(
            RekapiTimeline.computeHighlightedKeyframe(rekapi, {}),
            {}
          );
        });
      });

      describe('when propertyCursor references a property track that does not exist', () => {
        beforeEach(() => {
          rekapi.addActor().keyframe(0, { x: 5 });
        });

        it('returns empty object', () => {
          assert.deepEqual(
            RekapiTimeline.computeHighlightedKeyframe(
              rekapi,
              { property: 'y', millisecond: 0 }
            ),
            {}
          );
        });
      });

      describe('when propertyCursor references a property that does not exist', () => {
        it('returns empty object', () => {
          assert.deepEqual(
            RekapiTimeline.computeHighlightedKeyframe(
              rekapi,
              { property: 'x', millisecond: 0 }
            ),
            {}
          );
        });
      });

      describe('when propertyCursor references a property that does exist', () => {
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

  describe('RekapiTimeline#updateEasingList', () => {
    beforeEach(() => {
      setBezierFunction('testCurve', 0, 0, 0, 0);
      component.instance().updateEasingList();
    });

    afterEach(() => {
      unsetBezierFunction('testCurve');
    });

    it('is a function', () => {
      assert(component.instance().updateEasingList instanceof Function);
    });

    it('reflects changes to Tweenable.formulas', () => {
      assert(component.state().easingCurves.indexOf('testCurve') > -1);
    });
  });

  describe('RekapiTimeline#handleAddKeyframeButtonClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
    });

    describe('with propertyCursor that does not reference a keyframeProperty', () => {
      beforeEach(() => {
        rekapi.importTimeline(basicRekapiExport);
        component.instance().handleAddKeyframeButtonClick();
      });

      it('does not add a new keyframe property', () => {
        assert.equal(
          getActor().getPropertiesInTrack('transform').length,
          2
        );
      });

      it('does not add an "undefined" keyframe property', () => {
        assert.equal(
          getActor().getPropertiesInTrack('undefined').length,
          0
        );
      });
    });

    describe('with propertyCursor that does reference a keyframeProperty', () => {
      let currentKeyframeProperty, newKeyframeProperty;
      beforeEach(() => {
        rekapi.importTimeline(basicRekapiExport);
        currentKeyframeProperty = getActor().getKeyframeProperty('transform', 0)
        component.setState({
          propertyCursor: { property: 'transform', millisecond: 0 }
        });

        component.instance().handleAddKeyframeButtonClick();

        newKeyframeProperty = getActor().getPropertiesInTrack('transform').find(
          property => property.millisecond === newPropertyMillisecondBuffer
        );
      });

      it('does add a new keyframe property', () => {
        assert.equal(
          getActor().getPropertiesInTrack('transform').length,
          3
        );
      });

      it('the new property is placed after the current property', () => {
        assert.equal(
          newKeyframeProperty.millisecond,
          currentKeyframeProperty.millisecond + newPropertyMillisecondBuffer
        );
      });

      it('the new property has the same value as the current property', () => {
        assert.equal(
          newKeyframeProperty.value,
          currentKeyframeProperty.value
        );
      });

      it('sets state.propertyCursor to the newly created property', () => {
        assert.deepEqual(
          component.state().propertyCursor,
          {
            property: 'transform',
            millisecond: newPropertyMillisecondBuffer
          }
        );
      });
    });
  });

  describe('RekapiTimeline#handleDeleteKeyframeButtonClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
    });

    describe('with propertyCursor that does not reference a keyframeProperty', () => {
      beforeEach(() => {
        rekapi.importTimeline(basicRekapiExport);
        component.instance().handleDeleteKeyframeButtonClick();
      });

      it('does not remove a new keyframe property', () => {
        assert.equal(
          getActor().getPropertiesInTrack('transform').length,
          2
        );
      });
    });

    describe('with propertyCursor that does reference a keyframeProperty', () => {
      beforeEach(() => {
        rekapi.importTimeline(basicRekapiExport);
        component.setState({
          propertyCursor: { property: 'transform', millisecond: 0 }
        });

        component.instance().handleDeleteKeyframeButtonClick();
      });

      it('does remove a new keyframe property', () => {
        assert.equal(
          getActor().getPropertiesInTrack('transform').length,
          1
        );
      });

      describe('updating state.propertyCursor', () => {
        describe('when there is not a property that comes before the removed property', () => {
          it('state.propertyCursor is set emptied', () => {
            assert.deepEqual(component.state().propertyCursor, {});
          });
        });

        describe('when there is a property that comes before the removed property', () => {
          beforeEach(() => {
            rekapi = new Rekapi();
            component = shallow(<RekapiTimeline rekapi={rekapi}/>);
            rekapi.importTimeline(basicRekapiExport);
            component.setState({
              propertyCursor: {
                property: 'transform',
                millisecond: basicProperty2.millisecond
              }
            });

            component.instance().handleDeleteKeyframeButtonClick();
          });

          it('state.propertyCursor is set to the prior property', () => {
            assert.deepEqual(
              component.state().propertyCursor,
              {
                property: 'transform',
                millisecond: 0
              }
            );
          });
        });
      });
    });
  });

  describe('RekapiTimeline#handleEasingSelectChange', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.importTimeline(basicRekapiExport);
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);

      component.setState({
        propertyCursor: { property: 'transform', millisecond: 0 }
      });

      component.instance().handleEasingSelectChange({
        target: { value: 'easeInQuad' }
      });
    });

    it('sets the new easing upon the highlighted property', () => {
      assert.equal(
        getActor().getKeyframeProperty('transform', 0).easing,
        'easeInQuad'
      );
    });
  });

  describe('RekapiTimeline#handleMillisecondInputChange', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
    });

    describe('with propertyCursor that does reference a keyframeProperty', () => {
      let keyframeProperty;
      beforeEach(() => {
        rekapi.importTimeline(basicRekapiExport);
        component.setState({
          propertyCursor: { property: 'transform', millisecond: 0 }
        });

        keyframeProperty = getActor().getKeyframeProperty('transform', 0);

        component.instance().handleMillisecondInputChange({
          target: { value: 5 }
        });
      });

      it('sets the current property millisecond to the indicated number', () => {
        assert.equal(keyframeProperty.millisecond, 5);
      });

      it('updates the propertyCursor', () => {
        assert.equal(component.state().propertyCursor.millisecond, 5);
      });
    });
  });

  describe('RekapiTimeline#handleValueInputChange', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
    });

    describe('with propertyCursor that does reference a keyframeProperty', () => {
      let keyframeProperty;

      describe('number values', () => {
        describe('valid values', () => {
          beforeEach(() => {
            rekapi.importTimeline(decoupledRekapiNumberExport);
            component.setState({
              propertyCursor: { property: 'translateX', millisecond: 0 }
            });

            keyframeProperty = getActor().getKeyframeProperty('translateX', 0);

            component.instance().handleValueInputChange({
              target: { value: 5 }
            });
          });

          it('sets the current property value to the indicated number', () => {
            assert.equal(keyframeProperty.value, 5);
          });
        });

        describe('invalid values', () => {
          describe('type mismatch', () => {
            beforeEach(() => {
              rekapi.importTimeline(decoupledRekapiNumberExport);
              component.setState({
                propertyCursor: { property: 'translateX', millisecond: 0 }
              });

              keyframeProperty = getActor().getKeyframeProperty('translateX', 0);

              component.instance().handleValueInputChange({
                target: { value: '5' }
              });
            });


            it('does not set the current property value to the indicated string', () => {
              assert.equal(keyframeProperty.value, translateXNumberProperty1.value);
            });
          });
        });
      });

      describe('string values', () => {
        describe('valid values', () => {
          beforeEach(() => {
            rekapi.importTimeline(decoupledRekapiStringExport);
            component.setState({
              propertyCursor: { property: 'translateX', millisecond: 0 }
            });

            keyframeProperty = getActor().getKeyframeProperty('translateX', 0);

            component.instance().handleValueInputChange({
              target: { value: '5px' }
            });
          });

          it('sets the current property value to the indicated string', () => {
            assert.equal(keyframeProperty.value, '5px');
          });

          xdescribe('negative numbers within strings', () => {});

          xdescribe('floating point numbers within strings', () => {});
        });

        describe('invalid values', () => {
          describe('type mismatch', () => {
            beforeEach(() => {
              rekapi.importTimeline(decoupledRekapiStringExport);
              component.setState({
                propertyCursor: { property: 'translateX', millisecond: 0 }
              });

              keyframeProperty = getActor().getKeyframeProperty('translateX', 0);

              component.instance().handleValueInputChange({
                target: { value: 5 }
              });
            });

            it('does not set the current property value to the indicated string', () => {
              assert.equal(keyframeProperty.value, translateXStringProperty1.value);
            });
          });

          describe('token mismatches', () => {
            beforeEach(() => {
              rekapi.importTimeline(decoupledRekapiStringExport);
              component.setState({
                propertyCursor: { property: 'translateX', millisecond: 0 }
              });

              keyframeProperty = getActor().getKeyframeProperty('translateX', 0);
            });

            describe('extra spaces', () => {
              describe('leading spaces', () => {
                beforeEach(() => {
                  component.instance().handleValueInputChange({
                    target: { value: ' 5px' }
                  });
                });

                it('does not set the current property value to the indicated string', () => {
                  assert.equal(keyframeProperty.value, translateXStringProperty1.value);
                });
              });

              describe('spaces in the middle', () => {
                beforeEach(() => {
                  component.instance().handleValueInputChange({
                    target: { value: '5 px' }
                  });
                });

                it('does not set the current property value to the indicated string', () => {
                  assert.equal(keyframeProperty.value, translateXStringProperty1.value);
                });
              });

              describe('trailing spaces', () => {
                beforeEach(() => {
                  component.instance().handleValueInputChange({
                    target: { value: '5px ' }
                  });
                });

                it('does not set the current property value to the indicated string', () => {
                  assert.equal(keyframeProperty.value, translateXStringProperty1.value);
                });
              });
            });

            describe('missing string components', () => {
              beforeEach(() => {
                component.instance().handleValueInputChange({
                  target: { value: '5x' }
                });
              });

              it('does not set the current property value to the indicated string', () => {
                assert.equal(keyframeProperty.value, translateXStringProperty1.value);
              });
            });

            describe('missing number components', () => {
              beforeEach(() => {
                component.instance().handleValueInputChange({
                  target: { value: 'px' }
                });
              });

              it('does not set the current property value to the indicated string', () => {
                assert.equal(keyframeProperty.value, translateXStringProperty1.value);
              });
            });
          });
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
        component = mount(<Details keyframeProperty={basicProperty1} />);
      });

      it('displays the property name', () => {
        title = component.find('.keyframe-property-name');
        assert.equal(title.text(), basicProperty1.name);
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
        component = mount(<Details keyframeProperty={basicProperty1} />);
      });

      it('displays the property millisecond', () => {
        millisecondInput = component.find('.property-millisecond');
        assert.strictEqual(millisecondInput.props().value, basicProperty1.millisecond);
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
        component = mount(<Details keyframeProperty={basicProperty1} />);
      });

      it('displays the property value', () => {
        valueInput = component.find('.property-value');
        assert.strictEqual(valueInput.props().value, basicProperty1.value);
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
    });


    describe('no keyframe property focused', () => {
      beforeEach(() => {
        component = mount(<Details
          easingCurves={easingCurves}
        />);
      });

      it('does not render a list of easings', () => {
        assert.equal(
          component.find('.keyframe-property-easing select option').length,
          0
        );
      });
    });

    describe('with keyframe property focused', () => {
      beforeEach(() => {
        component = mount(<Details
          keyframeProperty={basicProperty1}
          easingCurves={easingCurves}
        />);
      });

      it('renders a list of easings', () => {
        assert.equal(
          component.find('.keyframe-property-easing select option').length,
          easingCurves.length
        );
      });

      describe('property has non-default easing', () => {
        beforeEach(() => {
          component = mount(<Details
            keyframeProperty={{ easing: 'ease2' }}
            easingCurves={easingCurves}
          />);
        });

        it('matches the internal state', () => {
          assert.equal(
            component.find('.keyframe-property-easing select').prop('value'),
            'ease2'
          );
        });
      });
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
