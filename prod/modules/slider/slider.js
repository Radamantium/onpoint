'use strict';

function slider(slider_id, options = {}) {

  /* DEFAULT OPTIONS */
  if ( !('scrollTime' in options) || isNaN(options.scrollTime) )  {
    options.scrollTime = 1;
  }

  if ( !('currentSlide' in options) )  {
    options.currentSlide = 'last';
  }

  if ( !('lineWidth' in options) || isNaN(options.lineWidth) )  {
    options.lineWidth = 640;
  }


  /* BASE VARIABLES AND DEFENITIONS */
  let slider;
  let slides;
  let displayedSlideNum = 0;
  let currentSliderLeftPosition = 0;
  let slidesLeftPositions = [];
  let sliderLineRanges = [];
  let sliderCursorPosition;

  try {
    slider = document.getElementById(slider_id);
    slides = slider.getElementsByClassName('slide');
  
    if (slider == null || slides.length == 0) {
      throw new Error('function slider: Некорреткные входные данные');
    }

    if (slides.length == 1)  {
      return;
    }
  } catch (err) {
    console.log(err.message);
    return;
  }

  slider.style.display    = 'flex';
  slider.style.transition = `transform ${options.scrollTime}s ease`;
  slider.style.transform  = 'translateX(0px)';
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.flexShrink   = '0';
  }


  /* SLIDER NAVIGATION */
  let sliderNav;
  let sliderLine;
  let sliderProgress;
  let sliderCursor;
  let sliderCursorThumb;
  let sliderPositions;

  calcSliderLineRanges();
  calcSlidesLeftPositions();
  generateNavigation();
  setSliderStartPosition();

  function calcSliderLineRanges() {
    let width = options.lineWidth;
    let slidesNum = slides.length;
    let step = width / (slidesNum - 1);
    for (let left = 0, position = 0, rigth = step/2, i = 0; i < slides.length; i++) {
      sliderLineRanges[i] = {};
      sliderLineRanges[i].left     = left;
      sliderLineRanges[i].position = position;
      sliderLineRanges[i].rigth    = rigth;

      left = rigth + 1;
      position += step;
      rigth = (rigth + step) < width ?
              rigth + step :
              position;
    }
  }

  function calcSlidesLeftPositions() {
    for (let i = 0, leftPosition = 0; i < slides.length; i++) {
      slidesLeftPositions.push(leftPosition);
      leftPosition += slides[i].offsetWidth;
    }
  }

  function generateNavigation() {
    sliderNav = document.createElement('div');
    sliderNav.id = 'slider__nav';
    sliderNav.classList.add('slider__nav');
    sliderNav.style.transition = `transform ${options.scrollTime}s ease`;

    generateSliderLine();
    generateSliderProgress();
    generateSliderCursorAndSliderCursorThumb();
    generateSliderPositions();

    slider.appendChild(sliderNav);

    function generateSliderLine() {
      sliderLine = document.createElement('div');
      sliderLine.id = 'slider__line';
      sliderLine.classList.add('slider__line');
      sliderNav.appendChild(sliderLine);
    }
      
    function generateSliderProgress() {
      sliderProgress = document.createElement('div');
      sliderProgress.id = 'slider__progress';
      sliderProgress.classList.add('slider__progress');
      sliderProgress.style.transformOrigin = 'left center';
      sliderNav.appendChild(sliderProgress);
    }
  
    function generateSliderCursorAndSliderCursorThumb() {
      sliderCursor = document.createElement('div');
      sliderCursor.id = 'slider__cursor';
      sliderCursor.classList.add('slider__cursor');
      sliderCursor.style.transform = 'translateX(0)';
        sliderCursorThumb = document.createElement('div');
        sliderCursorThumb.classList.add('slider__cursor-thumb');
        sliderCursor.appendChild(sliderCursorThumb);
      sliderNav.appendChild(sliderCursor);
    }

    function generateSliderPositions() {
      sliderPositions = document.createElement('div');
      sliderPositions.id = 'slider__positions';
      sliderPositions.classList.add('slider__positions');

      for (let positionLabel, slideLabel, i = 0; i < slides.length; i++) {
        positionLabel = document.createElement('h4');

        slideLabel = slides[i].getElementsByClassName('slide__label')[0];
        if (slideLabel == undefined) {
          positionLabel.innerHTML = '•';
        } else {
          positionLabel.innerHTML = slideLabel.innerHTML;
        }

        positionLabel.classList.add('slider__positions-item');
        let labelWidth = options.lineWidth / slides.length;
        let position = sliderLineRanges[i].position;
        let shift = labelWidth/2;
        positionLabel.style.width = `${ labelWidth }px`;
        positionLabel.style.left = `${ position - shift }px`;

        sliderPositions.appendChild(positionLabel);
      }

      sliderNav.appendChild(sliderPositions);
    }
  }

  function setSliderStartPosition() {
    switch (options.currentSlide) {
      case 'first': 
        sliderCursorPosition = 0;
        displayedSlideNum = 0;
        updateSlider();
        break;

      case 'last': 
        sliderCursorPosition = options.lineWidth;
        displayedSlideNum = slides.length - 1;
        updateSlider();
        break;

      default: 
        if (
          isNaN(options.currentSlide) ||
          options.currentSlide < 0 ||
          options.currentSlide >= slides.length
        ) {
          break;
        }
        sliderCursorPosition = sliderLineRanges[options.currentSlide].position;
        displayedSlideNum = options.currentSlide;
        updateSlider();
        break;
    }
  }


  /* MOUSE POINTER SCROLLING */
  sliderCursor.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    let mouseBeginX = e.pageX;
    let mouseEndX;
    let mouseDelta;

    document.onmousemove = function(e) {
      mouseEndX   = e.pageX;
      mouseDelta  = mouseEndX - mouseBeginX;
      mouseBeginX = mouseEndX;
      updateSliderByCursorDelta(mouseDelta);
    }

    document.onmouseup = function(e) {
      setSliderCursorAndProgressToDisplayedSlidePosition();
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }


  /* TOUCH SCROLLING */
  {
    sliderCursor.addEventListener('touchstart',  sliderCursorTouchStart, false);
    sliderCursor.addEventListener('touchmove',   sliderCursorTouchMove,  false);
    sliderCursor.addEventListener('touchend',    sliderCursorTouchEnd,   false);
    sliderCursor.addEventListener('touchcancel', sliderCursorTouchEnd,   false);

    let touchBeginX;
    let touchEndX;
    let touchDelta;

    function sliderCursorTouchStart(e) {
      e.stopPropagation();
      e.preventDefault();
      let touches = e.changedTouches;
      touchBeginX = touches[0].pageX;
    }

    function sliderCursorTouchMove(e) {
      let touches = e.changedTouches;
      touchEndX   = touches[0].pageX;
      touchDelta  = touchEndX - touchBeginX;
      touchBeginX = touchEndX;
      updateSliderByCursorDelta(touchDelta);
    }

    function sliderCursorTouchEnd(e) {
    	e.stopPropagation();
      setSliderCursorAndProgressToDisplayedSlidePosition();
    };
  }
  

  /* SLIDER UPDATE FUNCTIONS */
  function updateSliderByCursorDelta(delta) {
    let newSliderCursorPosition = sliderCursorPosition + delta;

    if (
      newSliderCursorPosition >= 0 && 
      newSliderCursorPosition <= options.lineWidth
    ) {
      sliderCursorPosition = newSliderCursorPosition;
      updateDisplayedSlideNum();
      updateSlider();      
    }

    function updateDisplayedSlideNum() {
      for (let i = 0; i < slides.length; i++) {
        if (
          sliderCursorPosition <= sliderLineRanges[i].rigth &&
          sliderCursorPosition >= sliderLineRanges[i].left
        ) {
          displayedSlideNum = i;
          break;
        }
      }
    }
  }

  function setSliderCursorAndProgressToDisplayedSlidePosition() {
    let from  = sliderCursorPosition;
    let to    = sliderLineRanges[displayedSlideNum].position;
    let delta = to - from;

    animate({
      duration: 500,
      timing: makeEaseInOut(circ),
      draw: function(progress) {
        sliderCursorPosition = from + delta * progress;
        updateSliderCursorDisplay();
        updateSliderProgressDisplay();
      }
    });
  }

  function updateSlider() {
    updateSliderCursorDisplay();
    updateSliderProgressDisplay();
    updateSlidesDisplay();
  }

  function updateSliderCursorDisplay() {
    sliderCursor.style.transform = `translateX(${sliderCursorPosition}px)`;
  }

  function updateSliderProgressDisplay() {
    let scale = sliderCursorPosition / options.lineWidth;
    sliderProgress.style.transform = `scaleX(${scale})`;
  }

  function updateSlidesDisplay() {
    let leftPosition = slidesLeftPositions[displayedSlideNum];
    slider.style.transform = `translateX(-${leftPosition}px)`;
    sliderNav.style.transform = `translateX(${leftPosition}px)`;
  }

  // JS ANIMATION FUNCTOINS
  function animate(options) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1;

      let progress = options.timing(timeFraction);
      options.draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  function makeEaseInOut(timing) {
    return function(timeFraction) {
      if (timeFraction < .5) {
        return timing(2 * timeFraction) / 2;
      } else {
        return (2 - timing(2 * (1 - timeFraction))) / 2;
      }
    }
  }

  function circ(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction));
  }
}
