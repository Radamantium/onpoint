function frameSectionsScrolling(container_id, content_id, options = {}) {
	// * DEFAULT OPTIONS *
	if ( !('scrollTime' in options) || isNaN(options['scrollTime']) )  {
		options['scrollTime'] = 1;
	}

	if ( !('parallaxed' in options) )  {
		options['parallaxed'] = [];
	}

	if ( !('scrollLinks' in options) )  {
		options['scrollLinks'] = [];
	}

	if ( !('customFunctions' in options) )  {
		options['customFunctions'] = [];
	}
	

	// * BASE VARIABLES AND DEFENITIONS *
	//Base defenitions & input data check
	try {
		var container 	= document.getElementById(container_id);
		var content 	= document.getElementById(content_id);
		var sections 	= content.getElementsByTagName('section');
	
		if (container == null 
			|| content == null 
			|| !container.contains(content)
			|| sections.length == 0) {
			throw new Error('function frameSectionsScrolling: Некорреткные входные данные');
		}
	} catch (err) {
		console.log(err.message);
		return;
	}

	//Base styles
	container.style.overflow = 'hidden';
	container.style.position = 'relative';
	content.style.transition = 'transform ' + options['scrollTime'] + 's ease';

	//Content scrolling variables
	var sectionsTops = [];
	var displayedSectionNum = 0;
	var currentContentTopPosition = 0;
	

	// * PAGINATION *
	//Creating navigation
	var nav = document.createElement('nav');
	nav.id = 'pagination';
	nav.classList.add('pagination');
	
	//Creating bullets
	for (var elem, currentSectionTop = 0, i = 0; i < sections.length; i++) {
		elem = document.createElement('div');
		elem.classList.add('pagination__bullet');
		elem.dataset.top = currentSectionTop;
		elem.dataset.num = i;
		elem.addEventListener('click', scrollAndUpdateByLink.bind(elem));
		nav.appendChild(elem);
		sectionsTops.push(currentSectionTop);
		currentSectionTop += sections[i].offsetHeight;
	}
	//Set first bullet as active
	var activeBullet = nav.getElementsByTagName('div')[0];
	activeBullet.classList.add('pagination__bullet_active');
	//Add navigation to document
	container.appendChild(nav);

	//Vertical align of pagination
	nav.style.top = '50%';
	nav.style.marginTop = -nav.offsetHeight/2 + 'px';


	// * WHEEL SCROLLING *
	document.addEventListener( 'wheel', onWheel, {passive: false} );

	function onWheel(e) {
		e.preventDefault();
		var wheelDelta = e.deltaY;
		scrollAndUpdateByDelta(wheelDelta);
	}

	// * MOUSE POINTER SCROLLING *
	content.onmousedown = function(e) {
		var mouseBeginY = e.pageY,
			mouseEndY,
			mouseDelta;

		document.onmousemove = function(e) {
			// e.preventDefault();
			mouseEndY = e.pageY;
		}

		content.onmouseup = function(e) {
			mouseDelta = mouseBeginY - mouseEndY;
			scrollAndUpdateByDelta(mouseDelta);
			document.onmousemove = null;
			content.onmouseup = null;
		}
	}

	// * TOUCH SCROLLING *
	content.addEventListener('touchstart',	contentTouchStart,	false);
	content.addEventListener('touchmove',	contentTouchMove,	false);
	content.addEventListener('touchend',	contentTouchEnd,	false);
	content.addEventListener('touchcancel',	contentTouchEnd,	false);

	var touchBeginY,
		touchEndY,
		touchDelta;

	function contentTouchStart(e) {
		// e.preventDefault();
		var touches = e.changedTouches;
		touchBeginY = touches[0].pageY;
	}

	function contentTouchMove(e) {
		// e.preventDefault();
		var touches = e.changedTouches;
		touchEndY = touches[0].pageY;
		touchDelta = touchBeginY - touchEndY;
	}

	function contentTouchEnd(e) {
		// e.preventDefault();
		scrollAndUpdateByDelta(touchDelta);
		touchDelta = 0;
	};


	// * SCROLL LINKS *
	setScrollLinks();

	function setScrollLinks() {
		var links = options['scrollLinks'];
		if (Array.isArray(links)) {
			for (var i =  0; i < links.length; i++) {
				setScrollLinksItem(links[i]);
			}
		} else {
			setScrollLinksItem(links);
		}
	}

	function setScrollLinksItem(item) {
		if (('id' in item) 
			&& ('sectionNum' in item) 
			&& (item.sectionNum < sections.length)
			&& (item.sectionNum >= 0)
			) {
			var elem = document.getElementById(item.id);
			if (elem == null) return;
			elem.dataset.top = sectionsTops[item.sectionNum];
			elem.addEventListener('click', scrollAndUpdateByLink.bind(elem));
		}
	}

	// * PARALLAXED *
	updateParallaxed();

	// * FUNCTIONS *
	function scrollAndUpdateByLink() {
		var scrollTo = this.dataset.top;
		scrollAndUpdateByPosition(scrollTo);
	}

	function scrollAndUpdateByDelta(delta) {
		if ( (delta > 0) && (displayedSectionNum < sections.length - 1) ) {
			scrollTo = sectionsTops[displayedSectionNum + 1];
			scrollAndUpdateByPosition(scrollTo);
		} else if ( (delta < 0) && (displayedSectionNum > 0) ) {
			scrollTo = sectionsTops[displayedSectionNum - 1];
			scrollAndUpdateByPosition(scrollTo);
		}
	}

	function scrollAndUpdateByPosition(scrollTo) {
		scroll(scrollTo);
		updatePagination();
		updateParallaxed();
	}

	function scroll(scrollTo) {
		content.style.transform = 'translateY(-' + scrollTo + 'px)';
		currentContentTopPosition = scrollTo;
		displayedSectionNum = sectionsTops.indexOf(+currentContentTopPosition);
	}

	function updatePagination() {
		document.getElementsByClassName('pagination__bullet_active')[0]
			.classList.toggle('pagination__bullet_active');
		document.querySelector('[data-num=\"' + displayedSectionNum + '\"]')
			.classList.add('pagination__bullet_active');
	}

	function updateParallaxed() {
		var parallaxed = options['parallaxed'];
		if (Array.isArray(parallaxed)) {
			for (var i =  0; i < parallaxed.length; i++) {
				updateParallaxedItem(parallaxed[i]);
			}
		} else {
			updateParallaxedItem(parallaxed);
		}
	}

	function updateParallaxedItem(item) {
		if (('id' in item) && ('parallaxRatio' in item)) {
			var elem = document.getElementById(item.id);
			if (elem == null) return;

			// Element section number searching
			var elemSectionNum = -1;
			for (var i =  0; i < sections.length; i++) {
				for (let node of sections[i].childNodes) {	
					if (node.id == item.id) {
						elemSectionNum = i;
					}
				}
			}
			if (elemSectionNum == -1) return;

			elem.style.transition = 'transform ' + options['scrollTime'] + 's ease';
			var shift = elem.offsetHeight * item.parallaxRatio;

			if (elemSectionNum == displayedSectionNum) {
				elem.style.transform = 'translateY(0)';
			} else if (elemSectionNum > displayedSectionNum) {
				elem.style.transform = 'translateY(' + shift + 'px)';
			} else if (elemSectionNum < displayedSectionNum) {
				elem.style.transform = 'translateY(-' + shift + 'px)';
			}
		}
	}

}