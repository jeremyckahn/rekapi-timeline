require(['./rekapi-timeline'], function (rekapiTimeline) {
  'use strict'

  const { Rekapi } = rekapiTimeline

  const timelineEl = document.querySelector('#rekapi-timeline');
  const rekapi = new Rekapi(document.body);

  const actor = rekapi.addActor({
    context: document.querySelector('#actor-1'),
  });

  actor
    .keyframe(0, {
      translateX: '0px',
      translateY: '0px',
      rotate: '0deg',
      scaleX: 1,
      scaleY: 1,
    })
    .keyframe(1000, {
      translateX: '150px',
      translateY: '100px',
    })

  const timeline = rekapi.createTimeline(timelineEl);
  rekapi.play(1)

  console.log((window.rekapi = rekapi))
  console.log((window.timeline = timeline))
})
