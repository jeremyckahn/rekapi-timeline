import React from 'react';
import TestRenderer from 'react-test-renderer';
import assert from 'assert';

import RekapiTimeline from '../src/rekapi-timeline';
import Details from '../src/details';
import Timeline from '../src/timeline';
import BottomFrame from '../src/bottom-frame';

import { basicRekapiExport } from './fixtures/basic-rekapi-export'

const basicKeyframe1 = basicRekapiExport.actors[0].propertyTracks.transform[0];

let testRenderer, testInstance;

describe('RekapiTimeline', () => {
  beforeEach(() => {
    testRenderer = TestRenderer.create(<RekapiTimeline />);
    testInstance = testRenderer.root;
  });

  it('is a react component', () => {
    assert(
      testInstance.findByProps({ className: 'rekapi-timeline' })
    );
  });
});

describe('Details', () => {
  beforeEach(() => {
    testRenderer = TestRenderer.create(<Details />);
    testInstance = testRenderer.root;
  });

  it('is a react component', () => {
    assert(
      testInstance.findByProps({ className: 'details' })
    );
  });

  describe('title', () => {
    describe('no keyframe property focused', () => {
      it('has default content', () => {
        let title = testInstance.findByProps({ className: 'keyframe-property-name' })
        assert.deepEqual(title.children, ['Details']);
      });
    });

    describe('with keyframe property focused', () => {
      beforeEach(() => {
        testRenderer = TestRenderer.create(<Details keyframeProperty={basicKeyframe1} />);
        testInstance = testRenderer.root;
      });

      it('displays the property name', () => {
        let title = testInstance.findByProps({ className: 'keyframe-property-name' })
        assert.deepEqual(title.children, [basicKeyframe1.name]);
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
