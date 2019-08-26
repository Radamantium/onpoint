'use strict';

frameSectionsScrolling(
	'frame', 
	'content',
	{
		scrollTime: 1,
		parallaxed: {
			id: 'ice-parallaxed',
			parallaxRatio: 0.5},
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
	});

slider('slider',
		{
			scrollTime: 1,
			currentSlide: 'last'
		});




















//BACK
// -- Touch Slider Line --

// var thumbElem = document.getElementById('slider-thumb');
// thumbElem.addEventListener('touchstart', touchStart, false);
// thumbElem.addEventListener('touchend', touchEnd, false);
// thumbElem.addEventListener('touchcancel', touchCancel, false);
// thumbElem.addEventListener('touchmove', touchMove, false);

// function touchStart(e) {
// 	e.preventDefault();
// }

// function touchMove(e) {
// 	e.preventDefault();
// 	var touches = e.changedTouches;
// 	var sliderElem = document.getElementById('slider-line');
// 	var thumbElem = document.getElementById('slider-thumb');
// 	var progressElem = document.getElementById('slider-progress');
// 	var shiftX = sliderElem.getBoundingClientRect().left;

// 	var newLeft = touches[0].pageX - shiftX;
// 	if (newLeft < 0) {
// 		newLeft = 0;
// 	}
// 	var rightEdge = sliderElem.offsetWidth - thumbElem.offsetWidth;
// 	if (newLeft > rightEdge) {
// 		newLeft = rightEdge;
// 	}

// 	var breakPointOne = sliderElem.offsetWidth * 0.25;
// 	var breakPointTwo = sliderElem.offsetWidth * 0.75;
// 	if (newLeft < breakPointOne) {
// 		slider.classList.add('slider_slide-one');
// 		slider.classList.remove('slider_slide-two');
// 		slider.classList.remove('slider_slide-three');
// 	}
// 	if (newLeft > breakPointOne) {
// 		slider.classList.remove('slider_slide-one');
// 		slider.classList.add('slider_slide-two');
// 		slider.classList.remove('slider_slide-three');
// 	}
// 	if (newLeft > breakPointTwo) {
// 		slider.classList.remove('slider_slide-one');
// 		slider.classList.remove('slider_slide-two');
// 		slider.classList.add('slider_slide-three');
// 	}
// 	thumbElem.style.left = newLeft + 'px';
// 	progressElem.style.width = newLeft + 'px';
// }

// function touchEnd(e) {
// 	e.preventDefault();
// 	var sliderElem = document.getElementById('slider-line');
// 	var progressElem = document.getElementById('slider-progress');
// 	var breakPointOne = sliderElem.offsetWidth * 0.25;
// 	var breakPointTwo = sliderElem.offsetWidth * 0.75;
// 	var positionOne = sliderElem.offsetWidth * 0;
// 	var positionTwo = sliderElem.offsetWidth * 0.5;
// 	var positionThree = sliderElem.offsetWidth * 1;
// 	var animationTime = 300;
// 	var framesCount = 20;
	
// 	if(progressElem.offsetWidth > breakPointTwo) {
// 		var coord = positionThree - progressElem.offsetWidth;
// 		var scrollStep = coord / framesCount;
// 		var scroller = setInterval(function() {
// 			if(Math.abs(scrollStep) < Math.abs(sliderElem.offsetWidth - progressElem.offsetWidth)) {
// 				var newLeft = progressElem.offsetWidth + scrollStep;
// 				thumbElem.style.left = newLeft + 'px';
// 				progressElem.style.width = newLeft + 'px';
// 			} else {
// 				thumbElem.style.left = sliderElem.offsetWidth + 'px';
// 				progressElem.style.width = sliderElem.offsetWidth + 'px';
// 				clearInterval(scroller);
// 			}
// 		}, animationTime / framesCount);

// 	} else if (progressElem.offsetWidth > breakPointOne) {
// 		var coord = positionTwo - progressElem.offsetWidth;
// 		var scrollStep = coord / framesCount;
// 		var scroller = setInterval(function() {
// 			if(Math.abs(scrollStep) < Math.abs(positionTwo - progressElem.offsetWidth)) {
// 				var newLeft = progressElem.offsetWidth + scrollStep;
// 				thumbElem.style.left = newLeft + 'px';
// 				progressElem.style.width = newLeft + 'px';
// 			} else {
// 				thumbElem.style.left = positionTwo + 'px';
// 				progressElem.style.width = positionTwo + 'px';
// 				clearInterval(scroller);
// 			}
// 		}, animationTime / framesCount);

// 	} else {
// 		var coord = positionOne - progressElem.offsetWidth;
// 		var scrollStep = coord / framesCount;
// 		var scroller = setInterval(function() {
// 			if(Math.abs(scrollStep) < Math.abs(positionOne - progressElem.offsetWidth)) {
// 				var newLeft = progressElem.offsetWidth + scrollStep;
// 				thumbElem.style.left = newLeft + 'px';
// 				progressElem.style.width = newLeft + 'px';
// 			} else {
// 				thumbElem.style.left = positionOne + 'px';
// 				progressElem.style.width = positionOne + 'px';
// 				clearInterval(scroller);
// 			}
// 		}, animationTime / framesCount);

// 	};
// };

// function touchCancel(e) {
// 	// e.preventDefault();
// }



// -- Parallax --
// var scrollDown = document.getElementById('scroll-down');
// var scrollPosition = 0;
// var baseParallaxPosition = 320;
// var parallaxMultiplier = -0.4;

// document.addEventListener('scroll', function(){
// 	if(window.pageYOffset > 0) scrollDown.classList.add('scroll-down_hidden');
// 	else scrollDown.classList.remove('scroll-down_hidden');
// 	scrollPosition = window.pageYOffset;
// 	document.getElementById('parallaxed').style.top = baseParallaxPosition + (scrollPosition * parallaxMultiplier) + 'px';
// });



// -- Screen Scrolling --

// window.onwheel = function(e) {
// 	e.preventDefault();
// }

// var container = document.getElementById('container');
// container.addEventListener('touchstart', containerTouchStart, false);
// container.addEventListener('touchend', containerTouchEnd, false);
// container.addEventListener('touchcancel', containerTouchCancel, false);
// container.addEventListener('touchmove', containerTouchMove, false);

// var screenHeight = 768;
// var currentScreen = 1;
// // var screenPosition = 0;
// var directionDown = true;
// var bullets = document.getElementsByClassName('bullet');
// var touchBeginY = 0;
// var touchEndY = 0;

// function containerTouchStart(e) {
// 	e.preventDefault();
// 	var touches = e.changedTouches;
// 	touchBeginY = touches[0].pageY;
// }

// function containerTouchMove(e) {
// 	e.preventDefault();
// 	var touches = e.changedTouches;
// 	touchEndY = touches[0].pageY;

// 	if (touchEndY < touchBeginY) directionDown = true;
// 	else directionDown = false;
// }

// function containerTouchEnd(e) {
// 	e.preventDefault();
// 	if (directionDown) {
// 		if (currentScreen == 1) {
// 			window.scrollTo({
// 				top: screenHeight,
// 				behavior: "smooth"
// 			});
// 			currentScreen = 2;
// 			for (var i = 0; i < bullets.length; i++) {
// 				bullets[i].classList.remove('bullet_active');
// 			}
// 			document.getElementById('bullet-two').classList.add('bullet_active');
// 		} else {
// 			window.scrollTo({
// 				top: 2*screenHeight,
// 				behavior: "smooth"
// 			});
// 			currentScreen = 3;
// 			for (var i = 0; i < bullets.length; i++) {
// 				bullets[i].classList.remove('bullet_active');
// 			}
// 			document.getElementById('bullet-three').classList.add('bullet_active');
// 		}
// 	} else {
// 		if (currentScreen == 3) {
// 			if(touchBeginY < 2100) { // ограничение для корректной работы "ползунка"
// 				window.scrollTo({
// 					top: screenHeight,
// 					behavior: "smooth"
// 				});
// 				currentScreen = 2;
// 				for (var i = 0; i < bullets.length; i++) {
// 					bullets[i].classList.remove('bullet_active');
// 				}
// 				document.getElementById('bullet-two').classList.add('bullet_active');
// 			}
// 		} else {
// 			window.scrollTo({
// 				top: 0,
// 				behavior: "smooth"
// 			});
// 			currentScreen = 1;
// 			for (var i = 0; i < bullets.length; i++) {
// 				bullets[i].classList.remove('bullet_active');
// 			}
// 			document.getElementById('bullet-one').classList.add('bullet_active');
// 		}
// 	}
// };

// function containerTouchCancel(e) {
// 	e.preventDefault();
// }


