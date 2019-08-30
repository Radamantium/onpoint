'use strict';

frameSectionsScrolling(
  'frame', 
  'content',
  {
    scrollTime: 1,
    parallaxed: [{
      id: 'ice-keel__parallaxed',
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