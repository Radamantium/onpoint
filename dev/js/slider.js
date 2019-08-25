'use strict';

function slider(slider_id, options = {}) {
	// * DEFAULT OPTIONS *
	if ( !('scrollTime' in options) || isNaN(options['scrollTime']) )  {
		options['scrollTime'] = 1;
	}

	if ( !('currentSlide' in options) )  {
		options['currentSlide'] = 'last';
	}

	if ( !('lineWidth' in options) || isNaN(options['lineWidth']) )  {
		options['lineWidth'] = 640;
	}

	// * BASE VARIABLES AND DEFENITIONS *
	//Base defenitions & input data check

	var slider,
		slides;

	try {
		slider 	= document.getElementById(slider_id);
		// var slides 	= slider.childNodes.getElementsByTagName('div');
		// console.log(slides);
		slides 	= slider.getElementsByClassName('slide');
	
		if (slider == null || slides.length == 0) {
			throw new Error('function slider: Некорреткные входные данные');
		}
	} catch (err) {
		console.log(err.message);
		return;
	}

	

	// ПРОВЕРКА НА КОЛИЧЕСТВО СЛАЙДОВ!!!
	if (slides.length == 1)  {
		return;
	}


	//Base styles
	// slider.style.overflow 	= 'hidden';
	slider.style.display 	= 'flex';
	slider.style.transition = 'transform ' + options['scrollTime'] + 's ease';
	slider.style.transform = 'translateX(0px)';


	for (var i = 0; i < slides.length; i++) {
		slides[i].style.flexShrink 	= '0';
		slides[i].classList.add('slide');
	}

	//Content scrolling variables
	var sliderLineRanges = [];
	var displayedSlideNum = 0;
	var currentSliderLeftPosition = 0;
	var slidesLeftPositions = [];
	var sliderCursorPosition;

	// * SLIDER PROGRESS LINE *
	//Creating navigation
	var sliderNav = document.createElement('div');
	sliderNav.id = 'slider__nav';
	sliderNav.classList.add('slider__nav');
	sliderNav.style.transition = 'transform ' + options['scrollTime'] + 's ease';

	var sliderLine = document.createElement('div');
	sliderLine.id = 'slider__line';
	sliderLine.classList.add('slider__line');
	sliderNav.appendChild(sliderLine);

	var sliderProgress = document.createElement('div');
	sliderProgress.id = 'slider__progress';
	sliderProgress.classList.add('slider__progress');
	sliderNav.appendChild(sliderProgress);

	var sliderCursor = document.createElement('div');
	sliderCursor.id = 'slider__cursor';
	sliderCursor.classList.add('slider__cursor');
	sliderCursor.style.transform = 'translateX(0)';
	var sliderCursorThumb = document.createElement('div');
	sliderCursorThumb.classList.add('slider__cursor-thumb');
	sliderCursor.appendChild(sliderCursorThumb);
	sliderNav.appendChild(sliderCursor);

	var sliderPositions = document.createElement('div');
	sliderPositions.id = 'slider__positions';
	sliderPositions.classList.add('slider__positions');
	for (var elem, label, i = 0; i < slides.length; i++) {
		label = document.getElementsByClassName('slide__label')[i].innerHTML;
		elem = document.createElement('h4');
		elem.innerHTML = label;
		sliderPositions.appendChild(elem);
	}
	// console.log(sliderPositions);
	sliderNav.appendChild(sliderPositions);

	//Add navigation to document
	slider.appendChild(sliderNav);

	//sliderLineRanges
	var width = options.lineWidth;
	var slidesNum = slides.length;
	var step = width / (slidesNum - 1);
	for (var left = 0, positoin = 0, rigth = step/2, i = 0; i < slides.length; i++) {
		sliderLineRanges[i] = {};
		sliderLineRanges[i].left 	 = left;
		sliderLineRanges[i].position = positoin;
		sliderLineRanges[i].rigth 	 = rigth;
		// console.log(sliderLineRanges[i]);
		left = rigth + 1;
		positoin += step;
		rigth = (rigth + step) < width ?
				rigth + step :
				positoin;
	}

	//slidesLeftPositions
	for (var i = 0, leftPosition = 0; i < slides.length; i++) {
		slidesLeftPositions.push(leftPosition);
		leftPosition += slides[i].offsetWidth;
	}

	//Set start position
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
			console.log(options.currentSlide);
			console.log(sliderLineRanges[options.currentSlide].position);
			updateSlider();
			break;
	}
	



	// * MOUSE POINTER SCROLLING *

	sliderCursor.onmousedown = function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// console.log("onmousedown");
		var mouseBeginX = e.pageX,
			mouseEndX,
			mouseDelta;

		slider.onmousemove = function(e) {
			// console.log("onmousemove");
			e.preventDefault();
			mouseEndX = e.pageX;
			mouseDelta = mouseEndX - mouseBeginX;
			mouseBeginX = mouseEndX;
			var newSliderCursorPosition = sliderCursorPosition + mouseDelta;
			if (
				newSliderCursorPosition >= 0 && 
				newSliderCursorPosition <= options.lineWidth
			) {
				sliderCursorPosition = newSliderCursorPosition;
				updateSlider();
				updateSliderCursorPosition();
			}
		}

		slider.onmouseup = function(e) {
			e.preventDefault();
			// console.log("onmouseup");
			updateSliderCursorDisplay();
			slider.onmousemove = null;
			slider.onmouseup = null;
		}
	}


	
	// Slider update functions
	
	function updateSlider() {
		updateSliderCursorPosition();
		updateSliderCursorDisplay();
		updateSliderProgressDisplay();
		updateSliderDisplay();
	}

	function updateSliderCursorDisplay() {
		sliderCursor.style.transform = 'translateX(' + sliderCursorPosition + 'px)';
	}

	function updateSliderProgressDisplay() {
		sliderProgress.style.width = sliderCursorPosition + 'px';
	}

	function updateSliderCursorPosition() {
		for (var i = 0; i < slides.length; i++) {
			if (
				sliderCursorPosition <= sliderLineRanges[i].rigth &&
				sliderCursorPosition >= sliderLineRanges[i].left
			) {
				displayedSlideNum = i;
				updateSliderDisplay();	
				// console.log('updateSliderDisplay');
				break;
			}
		}
	}

	function updateSliderDisplay() {
		var leftPosition = slidesLeftPositions[displayedSlideNum];
		slider.style.transform = 'translateX(-' + leftPosition + 'px)';
		sliderNav.style.transform = 'translateX(' + leftPosition + 'px)';
		// console.log(slider.style.transform);
	}

}
