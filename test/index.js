import React from 'react';
import TestRenderer from 'react-test-renderer';
import RekapiTimeline from '../src/rekapi-timeline';
import assert from 'assert';

describe('RekapiTimeline', () => {
  describe('render', () => {
    let testRenderer, testInstance;

    beforeEach(() => {
      testRenderer = TestRenderer.create(<RekapiTimeline />);
      testInstance = testRenderer.root;
    });

    it('returns a react component', () => {
      assert(
        testInstance.findByProps({ className: 'rekapi-timeline' })
      );
    });
  });
});
