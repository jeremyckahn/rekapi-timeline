import React from 'react';
import TestRenderer from 'react-test-renderer';
import assert from 'assert';

import RekapiTimeline from '../src/rekapi-timeline';
import Details from '../src/details';
import Timeline from '../src/timeline';

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
