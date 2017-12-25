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

import { RekapiTimeline } from '../src/rekapi-timeline';
import Details from '../src/details';
import Timeline from '../src/timeline';
import BottomFrame from '../src/bottom-frame';
import {
  computeHighlightedKeyframe,
  computeTimelineWidth,
  computeScrubberPixelPosition,
  computeScaledPixelPosition,
  computeDescaledPixelPosition,
} from '../src/utils';

import {
  newPropertyMillisecondBuffer,
  defaultTimelineScale,
  propertyTrackHeight
} from '../src/constants';

import { basicRekapiExport } from './fixtures/basic-rekapi-export'
import {
  decoupledRekapiStringExport
} from './fixtures/decoupled-rekapi-string-export'
import {
  decoupledRekapiNumberExport
} from './fixtures/decoupled-rekapi-number-export'

Enzyme.configure({ adapter: new Adapter() });

const exportTimelineOptions = { withId: true };

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

let rekapi;
let component;

const getActor = () => rekapi.getAllActors()[0];

const getPropertyTracks = () =>
  rekapi.exportTimeline(exportTimelineOptions).actors[0].propertyTracks;

describe('utils', () => {
  describe('computeHighlightedKeyframe', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
    });

    it('is a function', () => {
      assert(computeHighlightedKeyframe instanceof Function);
    });

    describe('return values', () => {
      describe('when propertyCursor is empty', () => {
        it('returns empty object', () => {
          assert.deepEqual(
            computeHighlightedKeyframe(rekapi, {}),
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
            computeHighlightedKeyframe(rekapi, {}),
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
            computeHighlightedKeyframe(
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
            computeHighlightedKeyframe(
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
            computeHighlightedKeyframe(
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

  describe('computeTimelineWidth', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.addActor().keyframe(0, { x: 1 }).keyframe(1000, { x: 1 });
    });

    it('is a function', () => {
      assert(computeTimelineWidth instanceof Function);
    });

    describe('return values', () => {
      it('applies timelineScale=.5 to animation length', () => {
        assert.equal(
          computeTimelineWidth(rekapi, .5),
          500
        );
      });

      it('applies timelineScale=1 to animation length', () => {
        assert.equal(
          computeTimelineWidth(rekapi, 1),
          1000
        );
      });

      it('applies timelineScale=2 to animation length', () => {
        assert.equal(
          computeTimelineWidth(rekapi, 2),
          2000
        );
      });
    });
  });

  describe('computeScrubberPixelPosition', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.addActor().keyframe(0, { x: 1 }).keyframe(1000, { x: 1 });
    });

    it('is a function', () => {
      assert(computeScrubberPixelPosition instanceof Function);
    });

    describe('return values', () => {
      describe('animation position === 0 (default)', () => {
        it('applies timelineScale=.5 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, .5),
            0
          );
        });

        it('applies timelineScale=1 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, 1),
            0
          );
        });

        it('applies timelineScale=2 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, 2),
            0
          );
        });
      });

      describe('animation position === 500', () => {
        beforeEach(() => {
          rekapi.update(500);
        });

        it('applies timelineScale=.5 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, .5),
            250
          );
        });

        it('applies timelineScale=1 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, 1),
            500
          );
        });

        it('applies timelineScale=2 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, 2),
            1000
          );
        });
      });

      describe('animation position === 1000', () => {
        beforeEach(() => {
          rekapi.update(1000);
        });

        it('applies timelineScale=.5 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, .5),
            500
          );
        });

        it('applies timelineScale=1 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, 1),
            1000
          );
        });

        it('applies timelineScale=2 to animation position', () => {
          assert.equal(
            computeScrubberPixelPosition(rekapi, 2),
            2000
          );
        });
      });
    });
  });

  describe('computeScaledPixelPosition', () => {
    it('scales a pixel value against a normalized value', () => {
      assert.equal(computeScaledPixelPosition(1.5, 10), 15);
    });
  });

  describe('computeDescaledPixelPosition', () => {
    it('de-scales a scaled pixel value against a normalized value', () => {
      assert.equal(computeDescaledPixelPosition(2, 10), 5);
    });

    it('rounds returned values down', () => {
      assert.equal(computeDescaledPixelPosition(1.9, 10), 5);
    });
  });
});

describe('<RekapiTimeline />', () => {
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
          assert.deepEqual(component.state().rekapi, rekapi.exportTimeline(exportTimelineOptions));
        });
      });
    });
  });

  describe('state', () => {
    describe('rekapi', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('is a basic rekapi export by default', () => {
        assert.deepEqual(component.state().rekapi, rekapi.exportTimeline(exportTimelineOptions));
      });
    });

    describe('actor', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        rekapi.addActor();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('is a basic actor export by default', () => {
        assert.deepEqual(component.state().actor, getActor().exportTimeline(exportTimelineOptions));
      });
    });

    describe('propertyCursor', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('is empty by default', () => {
        assert.deepEqual(component.state().propertyCursor, {});
      });
    });

    describe('isPlaying', () => {
      describe('when animation is not playing', () => {
        it('reflects Rekapi#isPlaying', () => {
          assert.equal(component.state().isPlaying, false);
        });
      });

      describe('when animation is playing', () => {
        beforeEach(() => {
          rekapi = new Rekapi();
          component = mount(<RekapiTimeline rekapi={rekapi}/>);

          rekapi.play();
        });

        afterEach(() => {
          rekapi.stop();
        });

        it('reflects Rekapi#isPlaying', () => {
          assert.equal(component.state().isPlaying, true);
        });
      });
    });

    describe('timelineScale', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);
      });

      it('gets a default value', () => {
        assert.equal(component.state().timelineScale, defaultTimelineScale);
      });
    });

    describe('currentPosition', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);

        rekapi.addActor().keyframe(1000, { x: 1 });
      });

      it('reflects the current animation position', () => {
        assert.equal(component.state().currentPosition, 0);
      });

      describe('position changes', () => {
        beforeEach(() => {
          rekapi.update(500);
        });

        it('reflects the animation position changed', () => {
          assert.equal(component.state().currentPosition, .5);
        });
      });
    });

    describe('animationLength', () => {
      let actor;
      beforeEach(() => {
        rekapi = new Rekapi();
        component = mount(<RekapiTimeline rekapi={rekapi}/>);

        actor = rekapi.addActor().keyframe(1000, { x: 1 });
      });

      it('reflects the animation length', () => {
        assert.equal(component.state().animationLength, 1000);
      });

      describe('timeline changes', () => {
        beforeEach(() => {
          actor.keyframe(2000, { x: 2 });
        });

        it('reflects animation length changes', () => {
          assert.equal(component.state().animationLength, 2000);
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
          describe('straight token match', () => {
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
          });

          describe('negative numbers within strings', () => {
            beforeEach(() => {
              rekapi.importTimeline(decoupledRekapiStringExport);
              component.setState({
                propertyCursor: { property: 'translateX', millisecond: 0 }
              });

              keyframeProperty = getActor().getKeyframeProperty('translateX', 0);

              component.instance().handleValueInputChange({
                target: { value: '-5px' }
              });
            });

            it('sets the current property value to the indicated string', () => {
              assert.equal(keyframeProperty.value, '-5px');
            });
          });

          describe('floating point numbers within strings', () => {
            beforeEach(() => {
              rekapi.importTimeline(decoupledRekapiStringExport);
              component.setState({
                propertyCursor: { property: 'translateX', millisecond: 0 }
              });

              keyframeProperty = getActor().getKeyframeProperty('translateX', 0);

              component.instance().handleValueInputChange({
                target: { value: '5.px' }
              });
            });

            it('sets the current property value to the indicated string', () => {
              assert.equal(keyframeProperty.value, '5.0px');
            });
          });
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

  describe('RekapiTimeline#handlePlayButtonClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      sinon.spy(rekapi, 'play');
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);

      component.instance().handlePlayButtonClick();
    });

    it('plays the animation', () => {
      assert(rekapi.play.called);
    });
  });

  describe('RekapiTimeline#handlePauseButtonClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      sinon.spy(rekapi, 'pause');
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);

      component.instance().handlePauseButtonClick();
    });

    it('pauses the animation', () => {
      assert(rekapi.pause.called);
    });
  });

  describe('RekapiTimeline#handleStopButtonClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      sinon.spy(rekapi, 'stop');
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);

      rekapi.addActor().keyframe(1000, { x: 1 });
      rekapi.update(500);

      component.instance().handleStopButtonClick();
    });

    it('stop the animation', () => {
      assert(rekapi.stop.called);
    });

    it('resets the animation', () => {
      assert.equal(rekapi.getLastPositionUpdated(), 0);
    });
  });

  describe('RekapiTimeline#handleTimelineScaleChange', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);

      component.instance().handleTimelineScaleChange(
        { target: { value: '50' } }
      );
    });

    it('updates timelineScale state', () => {
      assert.equal(component.state().timelineScale, .5);
    });

    describe('invalid inputs', () => {
      describe('negative numbers', () => {
        beforeEach(() => {
          rekapi = new Rekapi();
          component = shallow(<RekapiTimeline rekapi={rekapi}/>);

          component.instance().handleTimelineScaleChange(
            { target: { value: '-50' } }
          );
        });

        it('converts number to positive value', () => {
          assert.equal(component.state().timelineScale, .5);
        });
      });
    });
  });

  describe('RekapiTimeline#handleScrubberDrag', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
      rekapi.addActor().keyframe(0, { x: 0 }).keyframe(1000, { x: 1 });
    });

    describe('timelineScale === .5', () => {
      beforeEach(() => {
        component.setState({ timelineScale: .5 });
        component.instance().handleScrubberDrag(100);
      });

      it('sets the scaled timeline position', () => {
        assert.equal(rekapi.getLastPositionUpdated(), .2);
      });
    });

    describe('timelineScale === 1 (default)', () => {
      beforeEach(() => {
        component.instance().handleScrubberDrag(100);
      });

      it('sets the scaled timeline position', () => {
        assert.equal(rekapi.getLastPositionUpdated(), .1);
      });
    });

    describe('timelineScale === 2', () => {
      beforeEach(() => {
        component.setState({ timelineScale: 2 });
        component.instance().handleScrubberDrag(100);
      });

      it('sets the scaled timeline position', () => {
        assert.equal(rekapi.getLastPositionUpdated(), .05);
      });
    });
  });

  describe('RekapiTimeline#handleScrubberBarClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
      rekapi.addActor().keyframe(0, { x: 0 }).keyframe(1000, { x: 1 });
    });

    describe('timelineScale === .5', () => {
      beforeEach(() => {
        component.setState({ timelineScale: .5 });
        component.instance().handleScrubberBarClick(100);
      });

      it('sets the scaled timeline position', () => {
        assert.equal(rekapi.getLastPositionUpdated(), .2);
      });
    });

    describe('timelineScale === 1 (default)', () => {
      beforeEach(() => {
        component.instance().handleScrubberBarClick(100);
      });

      it('sets the scaled timeline position', () => {
        assert.equal(rekapi.getLastPositionUpdated(), .1);
      });
    });

    describe('timelineScale === 2', () => {
      beforeEach(() => {
        component.setState({ timelineScale: 2 });
        component.instance().handleScrubberBarClick(100);
      });

      it('sets the scaled timeline position', () => {
        assert.equal(rekapi.getLastPositionUpdated(), .05);
      });
    });
  });

  describe('RekapiTimeline#handlePropertyDrag', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.addActor()
        .keyframe(0, { x: 0 })
        .keyframe(1000, { x: 1 })
        .keyframe(1500, { x: 1500 });

      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
    });

    describe('timelineScale === 1 (default)', () => {
      describe('basic usage', () => {
        beforeEach(() => {
          component.instance().handlePropertyDrag(500, 'x', 1000);
        });

        it('updates the specified property to have the new millisecond value', () => {
          assert(getActor().hasKeyframeAt(500, 'x'));
        });
      });

      describe('property millisecond collisons', () => {
        beforeEach(() => {
          component.instance().handlePropertyDrag(1000, 'x', 1500);
        });

        it('does not update the dragged property', () => {
          assert(getActor().hasKeyframeAt(1500, 'x'));
        });
      });
    });

    describe('timelineScale === 0.5', () => {
      beforeEach(() => {
        component.setState({ timelineScale: 0.5 });
      });

      describe('basic usage', () => {
        beforeEach(() => {
          component.instance().handlePropertyDrag(250, 'x', 1000);
        });

        it('updates the specified property to have the new scaled millisecond value', () => {
          assert(getActor().hasKeyframeAt(500, 'x'));
        });
      });

      describe('property millisecond collisons', () => {
        beforeEach(() => {
          component.instance().handlePropertyDrag(500, 'x', 750);
        });

        it('does not update the dragged property', () => {
          assert(getActor().hasKeyframeAt(1500, 'x'));
        });
      });
    });

    describe('timelineScale === 2', () => {
      beforeEach(() => {
        component.setState({ timelineScale: 2 });
      });

      describe('basic usage', () => {
        beforeEach(() => {
          component.instance().handlePropertyDrag(1000, 'x', 1000);
        });

        it('updates the specified property to have the new scaled millisecond value', () => {
          assert(getActor().hasKeyframeAt(500, 'x'));
        });
      });

      describe('property millisecond collisons', () => {
        beforeEach(() => {
          component.instance().handlePropertyDrag(2000, 'x', 3000);
        });

        it('does not update the dragged property', () => {
          assert(getActor().hasKeyframeAt(1500, 'x'));
        });
      });
    });

    describe('propertyCursor updating', () => {
      beforeEach(() => {
        component.instance().handlePropertyDrag(500, 'x', 1000);
      });

      it('updates propertyCursor', () => {
        assert.deepEqual(
          component.state().propertyCursor,
          { property: 'x', millisecond: 500 }
        );
      });
    });
  });

  describe('RekapiTimeline#handlePropertyClick', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.addActor().keyframe(0, { x: 0 }).keyframe(1000, { x: 1 });
      component = shallow(<RekapiTimeline rekapi={rekapi}/>);
      component.instance().handlePropertyClick(getPropertyTracks().x[1]);
    });

    it('updates propertyCursor', () => {
      assert.deepEqual(
        component.state().propertyCursor,
        { property: 'x', millisecond: 1000 }
      );
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

  describe('timeline wrapper', () => {
    beforeEach(() => {
      component = shallow(<Timeline timelineWrapperWidth={1000} />);
    });

    describe('width', () => {
      it('is determined by timelineWrapperWidth prop', () => {
        assert.equal(
          component.find('.timeline-wrapper').props().style.width,
          'calc(100% + 1000px)'
        );
      });
    });
  });

  describe('scrubber wrapper', () => {
    beforeEach(() => {
      component = mount(<Timeline timelineWrapperWidth={1000} />);
    });

    describe('width', () => {
      it('is determined by timelineWrapperWidth prop', () => {
        assert.equal(
          component.find('.scrubber-wrapper').props().style.width,
          1000
        );
      });
    });
  });

  describe('scrubber position', () => {
    beforeEach(() => {
      component = mount(<Timeline scrubberPosition={500} />);
    });

    describe('draggable position', () => {
      it('is determined by scrubberPosition prop', () => {
        assert.equal(
          component.find('Draggable').props().position.x,
          500
        );
      });
    });
  });

  describe('scrubber guide', () => {
    describe('dynamic styling', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        rekapi.addActor().keyframe(0, { x: 0, y: 0, z: 0});
        component = mount(<Timeline
          propertyTracks={rekapi.exportTimeline(exportTimelineOptions).actors[0].propertyTracks}
        />);
      });

      it('has the correct height', () => {
        assert.equal(
          component.find('.scrubber-guide').props().style.height,
          propertyTrackHeight * 3
        );
      });
    });
  });

  describe('property tracks', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.addActor().keyframe(0, { x: 0, y: 0 });
      component = shallow(
        <Timeline
          propertyTracks={getPropertyTracks()}
        />
      );
    });

    it('renders all keyframe tracks', () => {
      assert.equal(component.find('.keyframe-property-track').length, 2);
    });
  });

  describe('keyframe properties', () => {
    describe('property wrapper', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        rekapi.addActor().keyframe(0, { x: 0 }).keyframe(1000, { x: 1 });
        component = mount(
          <Timeline
            propertyTracks={getPropertyTracks()}
          />
        );
      });

      it('renders all .keyframe-property-wrapper elements', () => {
        assert.equal(component.find('.keyframe-property-wrapper').length, 2);
      });
    });

    describe('property element', () => {
      beforeEach(() => {
        rekapi = new Rekapi();
        rekapi.addActor().keyframe(0, { x: 0 }).keyframe(1000, { x: 1 });
        component = mount(
          <Timeline
            propertyTracks={getPropertyTracks()}
          />
        );
      });

      it('renders all .keyframe-property elements', () => {
        assert.equal(
          component.find('.keyframe-property-wrapper .keyframe-property').length,
          2
        );
      });
    });
  });

  describe('active classes', () => {
    beforeEach(() => {
      rekapi = new Rekapi();
      rekapi.addActor()
        .keyframe(0, { x: 0, y: 1 })
        .keyframe(1000, { x: 2, y: 3 });

      component = mount(
        <Timeline
          propertyTracks={getPropertyTracks()}
          propertyCursor={{ property: 'y', millisecond: 1000 }}
        />
      );
    });

    describe('active property track', () => {
      it('gives active class to active property track', () => {
        assert(
          component.find(
            '.keyframe-property-track'
          ).get(1).props.className.includes('active')
        );
      });

      it('does not give active class to inactive property track', () => {
        assert(
          !component.find(
            '.keyframe-property-track'
          ).get(0).props.className.includes('active')
        );
      });
    });

    describe('active property', () => {
      it('gives active class to active property', () => {
        assert(
          component.find(
            '[data-track-name="y"] .keyframe-property-wrapper'
          ).get(1).props.className.includes('active')
        );
      });

      it('does not give active class to inactive property track', () => {
        assert(
          !component.find(
            '[data-track-name="y"] .keyframe-property-wrapper'
          ).get(0).props.className.includes('active')
        );
      });
    });
  });
});

describe('<BottomFrame />', () => {
  beforeEach(() => {
    component = mount(<BottomFrame />);
  });

  it('is a react component', () => {
    assert.equal(component.length, 1);
  });

  describe('control bar', () => {
    it('is a react component', () => {
      assert(component.find('.control-bar').length);
    });

    describe('play button', () => {
      it('is a react component', () => {
        assert(component.find('.control-bar .play').length);
      });

      describe('handlePlayButtonClick', () => {
        let handlePlayButtonClick;

        beforeEach(() => {
          handlePlayButtonClick = sinon.spy();
          component = mount(
            <BottomFrame handlePlayButtonClick={handlePlayButtonClick} />
          );

          component.find('.control-bar .play').simulate('click');
        });

        it('fires', () => {
          assert(handlePlayButtonClick.called);
        });
      });

      describe('when animation is not playing', () => {
        beforeEach(() => {
          component = mount(
            <BottomFrame isPlaying={false} />
          );
        });

        it('is shown', () => {
          assert.equal(component.find('.control-bar .play').length, 1);
        });
      });

      describe('when animation is playing', () => {
        beforeEach(() => {
          component = mount(
            <BottomFrame isPlaying={true} />
          );
        });

        it('is not shown', () => {
          assert.equal(component.find('.control-bar .play').length, 0);
        });
      });
    });

    describe('pause button', () => {
      describe('handlePauseButtonClick', () => {
        let handlePauseButtonClick;

        beforeEach(() => {
          handlePauseButtonClick = sinon.spy();
          component = mount(
            <BottomFrame
              handlePauseButtonClick={handlePauseButtonClick}
              isPlaying={true}
            />
          );

          component.find('.control-bar .pause').simulate('click');
        });

        it('fires', () => {
          assert(handlePauseButtonClick.called);
        });
      });

      describe('when animation is not playing', () => {
        beforeEach(() => {
          component = mount(
            <BottomFrame isPlaying={false} />
          );
        });

        it('is not shown', () => {
          assert.equal(component.find('.control-bar .pause').length, 0);
        });
      });

      describe('when animation is playing', () => {
        beforeEach(() => {
          component = mount(
            <BottomFrame isPlaying={true} />
          );
        });

        it('is shown', () => {
          assert.equal(component.find('.control-bar .pause').length, 1);
        });
      });
    });

    describe('stop button', () => {
      it('is a react component', () => {
        assert(component.find('.control-bar .stop').length);
      });

      describe('handleStopButtonClick', () => {
        let handleStopButtonClick;

        beforeEach(() => {
          handleStopButtonClick = sinon.spy();
          component = mount(
            <BottomFrame handleStopButtonClick={handleStopButtonClick} />
          );

          component.find('.control-bar .stop').simulate('click');
        });

        it('fires', () => {
          assert(handleStopButtonClick.called);
        });
      });
    });
  });

  describe('scrubber detail', () => {
    describe('scrubber scale', () => {
      beforeEach(() => {
        component = mount(<BottomFrame timelineScale={defaultTimelineScale}/>);
      });

      it('reflects timelineScale prop', () => {
        assert.equal(
          component.find('.scrubber-scale input').props().value,
          String(defaultTimelineScale * 100)
        );
      });

      describe('handleTimelineScaleChange', () => {
        let handleTimelineScaleChange;
        beforeEach(() => {
          handleTimelineScaleChange = sinon.spy();
          component = mount(
            <BottomFrame handleTimelineScaleChange={handleTimelineScaleChange}/>
          );

          component.find('.scrubber-scale input')
            .simulate('change', { target: { value: '5' } });
        });

        it('fires', () => {
          assert(handleTimelineScaleChange.called);
        });
      });
    });

    describe('position monitor', () => {
      describe('currentPosition', () => {
        beforeEach(() => {
          component = mount(<BottomFrame
            currentPosition={.5}
            animationLength={1000}
            />
          );
        });

        it('displays the current millisecond', () => {
          assert.equal(component.find('.current-position').text(), '500');
        });
      });

      describe('animationLength', () => {
        beforeEach(() => {
          component = mount(<BottomFrame animationLength={100}/>);
        });

        it('displays the animationLength', () => {
          assert.equal(component.find('.animation-length').text(), '100');
        });
      });
    });
  });
});
