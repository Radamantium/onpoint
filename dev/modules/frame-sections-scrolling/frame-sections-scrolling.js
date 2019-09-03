'use strict';

export default function frameSectionsScrolling(container_id, content_id, options = {}) {

  /* DEFAULT OPTIONS */
  if ( !('scrollTime' in options) || isNaN(options.scrollTime) )  {
    options.scrollTime = 1;
  }

  if ( !('parallaxed' in options) )  {
    options.parallaxed = null;
  }

  if ( !('scrollLinks' in options) )  {
    options.scrollLinks = [];
  }

  if ( !('customUpdateFunctions' in options) )  {
    options.customUpdateFunctions = [];
  }
  

  /* BASE VARIABLES AND DEFENITIONS */
  let container;
  let content;
  let sections;
  let sectionsTops = [];
  let displayedSectionNum = 0;
  let currentContentTopPosition = 0;

  try {
    container = document.getElementById(container_id);
    content   = document.getElementById(content_id);
    sections  = content.getElementsByTagName('section');
  
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

  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  content.style.transition = `transform ${options.scrollTime}s ease`;


  /* PAGINATION */
  generatePagination();

  function generatePagination() {
    let pagination = document.createElement('nav');
    pagination.id = 'pagination';
    pagination.classList.add('pagination');

    for (let bullet, currentSectionTop = 0, i = 0; i < sections.length; i++) {
      bullet = new Bullet(i, currentSectionTop, !i);
      pagination.appendChild(bullet);
      sectionsTops.push(currentSectionTop);
      currentSectionTop += sections[i].offsetHeight;
    }

    pagination.style.top = '50%';
    pagination.style.marginTop = -pagination.offsetHeight/2 + 'px';

    container.appendChild(pagination);

    function Bullet(num, top, active) {
      let bullet;
      bullet = document.createElement('div');
      bullet.classList.add('pagination__bullet');

      bullet.dataset.num = num;
      bullet.dataset.top = top;
      if (active) {
        bullet.classList.add('pagination__bullet_active');
      }

      bullet.addEventListener('click', scrollAndUpdateByLink.bind(bullet));
      return bullet;
    }
  }


  /* WHEEL SCROLLING */
  {
    document.addEventListener( 'wheel', onWheel, {passive: false} );

    function onWheel(e) {
      e.preventDefault();
      let wheelDelta = e.deltaY;
      scrollAndUpdateByDelta(wheelDelta);
    }
  }  

  /* MOUSE POINTER SCROLLING */
  content.onmousedown = function(e) {
  	e.preventDefault();
    let mouseBeginY = e.pageY;
    let mouseEndY;
    let mouseDelta;

    document.onmousemove = function(e) {
      mouseEndY = e.pageY;
    }

    content.onmouseup = function(e) {
      mouseDelta = mouseBeginY - mouseEndY;
      scrollAndUpdateByDelta(mouseDelta);
      document.onmousemove = null;
      content.onmouseup = null;
    }
  }

  /* TOUCH SCROLLING */
  {
    content.addEventListener('touchstart',  contentTouchStart, false);
    content.addEventListener('touchmove',   contentTouchMove,  false);
    content.addEventListener('touchend',    contentTouchEnd,   false);
    content.addEventListener('touchcancel', contentTouchEnd,   false);

    let touchBeginY;
    let touchEndY;
    let touchDelta;

    function contentTouchStart(e) {
    	e.preventDefault();
      let touches = e.changedTouches;
      touchBeginY = touches[0].pageY;
    }

    function contentTouchMove(e) {
      let touches = e.changedTouches;
      touchEndY = touches[0].pageY;
    }

    function contentTouchEnd(e) {
      touchDelta = touchBeginY - touchEndY;
      scrollAndUpdateByDelta(touchDelta);
      touchDelta = 0;
    };
  }

  /* CUSTOM SCROLL LINKS */
  setScrollLinks();

  function setScrollLinks() {
    let links = options.scrollLinks;

    if (Array.isArray(links)) {
      for (let i =  0; i < links.length; i++) {
        setScrollLinksItem(links[i]);
      }
    } else {
      setScrollLinksItem(links);
    }

    function setScrollLinksItem(item) {
      if (
        ('id' in item) 
        && ('sectionNum' in item) 
        && (item.sectionNum < sections.length)
        && (item.sectionNum >= 0)
      ) {
        let link = document.getElementById(item.id);
        if (link == null) return;
        link.dataset.top = sectionsTops[item.sectionNum];
        link.addEventListener('click', scrollAndUpdateByLink.bind(link));
      }
    }
  }


  /* PARALLAXED */
  setParallaxed();
  updateParallaxed();

  function setParallaxed() {
    let parallaxed = options.parallaxed;

    if (parallaxed === null) return;

    if (Array.isArray(parallaxed)) {
      for (let i =  0; i < parallaxed.length; i++) {
        let isSet = setParallaxedItem(parallaxed[i]);
        if (!isSet) parallaxed.splice(i--, 1);
      }
    } else {
      let isSet = setParallaxedItem(parallaxed);
      if (!isSet) parallaxed = null;
    }

    function setParallaxedItem(item) {
      if (!('id' in item) || !('parallaxRatio' in item)) return false;

      let parallaxedElem = document.getElementById(item.id);
      if (parallaxedElem == null) return false;

      // Element section number searching
      let parallaxedElemSectionNum = -1;
      for (let i =  0; i < sections.length; i++) {
        for (let node of sections[i].childNodes) {  
          if (node.id == item.id) {
            parallaxedElemSectionNum = i;
          }
        }
      }
      if (parallaxedElemSectionNum == -1) return false;

      parallaxedElem.style.transition = `transform ${options.scrollTime}s ease`;
      parallaxedElem.dataset.sectionNum = parallaxedElemSectionNum;

      return true;
    }  
  }

  function updateParallaxed() {
    let parallaxed = options.parallaxed;

    if (parallaxed === null) return;

    if (Array.isArray(parallaxed)) {
      for (let i =  0; i < parallaxed.length; i++) {
        updateParallaxedItem(parallaxed[i]);
      }
    } else {
      updateParallaxedItem(parallaxed);
    }

    function updateParallaxedItem(item) {
      let parallaxedElem = document.getElementById(item.id);

      let parallaxedElemSectionNum = parallaxedElem.dataset.sectionNum
      let shift = parallaxedElem.offsetHeight * item.parallaxRatio;

      if (parallaxedElemSectionNum == displayedSectionNum) {
        parallaxedElem.style.transform = 'translateY(0)';
      } else if (parallaxedElemSectionNum > displayedSectionNum) {
        parallaxedElem.style.transform = `translateY(${shift}px)`;
      } else if (parallaxedElemSectionNum < displayedSectionNum) {
        parallaxedElem.style.transform = `translateY(-${shift}px)`;
      }
    }    
  }


  /* SCROLL AND UPDATE FUNCTIONS */
  function scrollAndUpdateByLink() {
    let scrollTo = this.dataset.top;
    scrollAndUpdate(scrollTo);
  }

  function scrollAndUpdateByDelta(delta) {
    if ( (delta > 0) && (displayedSectionNum < sections.length - 1) ) {
      scrollTo = sectionsTops[displayedSectionNum + 1];
      scrollAndUpdate(scrollTo);
    } else if ( (delta < 0) && (displayedSectionNum > 0) ) {
      scrollTo = sectionsTops[displayedSectionNum - 1];
      scrollAndUpdate(scrollTo);
    }
  }

  function scrollAndUpdate(scrollTo) {
    scroll(scrollTo);
    updatePagination();
    updateParallaxed();
    updateCustomFunctions();
  }

  function scroll(scrollTo) {
    content.style.transform = `translateY(-${scrollTo}px)`;
    currentContentTopPosition = scrollTo;
    displayedSectionNum = sectionsTops.indexOf(+currentContentTopPosition);
  }

  function updatePagination() {
    document.getElementsByClassName('pagination__bullet_active')[0]
      .classList.toggle('pagination__bullet_active');
    document.querySelector(`[data-num=\"${displayedSectionNum}\"]`)
      .classList.add('pagination__bullet_active');
  }

  //Custom update
  function updateCustomFunctions() {
    let custom = options.customUpdateFunctions;
    if ( Array.isArray(custom) ) {
      for (let i =  0; i < custom.length; i++) {
        tryCustomUpdate(custom[i]);
      }
    } else {
      tryCustomUpdate(custom);
    }
  }

  function tryCustomUpdate(customUpdate) {
    try {
      customUpdate();
    } catch (err) {
      console.log(err.message);
      return;
    }
  }
}