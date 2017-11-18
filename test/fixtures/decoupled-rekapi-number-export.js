export const decoupledRekapiNumberExport = {
  "duration": 1000,
  "actors": [
    {
      "start": 0,
      "end": 1000,
      "trackNames": [
        "translateX",
        "translateY",
        "rotateZ"
      ],
      "propertyTracks": {
        "translateX": [
          {
            "millisecond": 0,
            "name": "translateX",
            "value": 100,
            "easing": "linear"
          },
          {
            "millisecond": 1000,
            "name": "translateX",
            "value": 400,
            "easing": "linear"
          }
        ],
        "translateY": [
          {
            "millisecond": 0,
            "name": "translateY",
            "value": 100,
            "easing": "linear"
          },
          {
            "millisecond": 1000,
            "name": "translateY",
            "value": 100,
            "easing": "linear"
          }
        ],
        "rotateZ": [
          {
            "millisecond": 0,
            "name": "rotateZ",
            "value": "0deg",
            "easing": "linear"
          },
          {
            "millisecond": 1000,
            "name": "rotateZ",
            "value": "0deg",
            "easing": "linear"
          }
        ]
      }
    }
  ],
  "curves": {
    "customCurve1": {
      "displayName": "customCurve1",
      "x1": 0.25,
      "y1": 0.5,
      "x2": 0.75,
      "y2": 0.5
    },
    "customCurve2": {
      "displayName": "customCurve2",
      "x1": 0.25,
      "y1": 0.5,
      "x2": 0.75,
      "y2": 0.5
    }
  }
};
