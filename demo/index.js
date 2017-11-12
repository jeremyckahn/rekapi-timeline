import React from 'react';
import ReactDOM from 'react-dom';
import { Rekapi } from 'rekapi';

import RekapiTimeline from '../src/rekapi-timeline.js';

const rekapi = new Rekapi(document.body);

const actor = rekapi.addActor({
  context: document.querySelector('#actor-1')
});

actor
  .keyframe(0, {
    translateX: '0px',
    translateY: '0px',
    rotate: '0deg',
    scaleX: 1,
    scaleY: 1
  })
  .keyframe(1000, {
    translateX: '150px',
    translateY: '100px'
  });

ReactDOM.render(
  <RekapiTimeline
    rekapi={rekapi}
  />,
  document.getElementById('rekapi-timeline')
);

rekapi.play(1);
