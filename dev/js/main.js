'use strict';

import frameSectionsScrolling from '../modules/frame-sections-scrolling/frame-sections-scrolling.js';
import slider from '../modules/slider/slider.js';
import alert from '../modules/alert/alert.js';

frameSectionsScrolling(
  'frame', 
  'content',
  {
    scrollTime: 1,
    parallaxed: {
      id: 'ice-keel__parallaxed',
      parallaxRatio: 0.5
    },
    scrollLinks: {
      id: 'scroll-down',
      sectionNum: 1
    },
    customUpdateFunctions: function() {
      let shownElem = document.getElementById('scroll-down');
      if (content.style.transform == 'translateY(0px)') {
        shownElem.style.opacity = 1;
        shownElem.style.display = 'block';
      } else {
        shownElem.style.opacity = 0;
        shownElem.style.display = 'none';
      }
    }
  }
);

slider(
  'slider',
  {
    scrollTime: 1,
    currentSlide: 'last'
  }
);

alert();