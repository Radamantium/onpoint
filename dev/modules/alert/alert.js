'use strict';

export default function alert() {
  const wavesNum = 4;
  let alerts = document.getElementsByClassName('alert');

  for (let i = 0; i < alerts.length; i++) {
    generateHTMLContent(alerts[i]);
  }

  function generateHTMLContent(alertElement) {
    for (let wave, i = 0; i < wavesNum; i++) {
      wave = document.createElement('div');
      wave.classList.add('alert__wave');
      alertElement.appendChild(wave);
    }
  }
}