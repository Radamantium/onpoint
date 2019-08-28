'use strict';

frameSectionsScrolling(
  'frame', 
  'content',
  {
    scrollTime: 1,
    parallaxed: [{
      id: 'ice-parallaxed',
      parallaxRatio: 0.5},
      {
      id: 'ice',
      parallaxRatio: 0.5},
      {
      id: 'scroll-down'}
      ],
    scrollLinks: {
      id: 'scroll-down',
      sectionNum: 1},
    customUpdateFunctions: function() {
      let linkElem = document.getElementById('scroll-down');
      if (content.style.transform == 'translateY(0px)') {
        linkElem.style.opacity = 1;
      } else {
        linkElem.style.opacity = 0;
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