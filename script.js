(() => {

  function getViewElements() {
    let elements = [];
    document.querySelectorAll('#metadata-line span').forEach(candidate => {
      // if it starts with a digit, then it's a "views"-span
      if (candidate.innerHTML.substr(0,1).match(/[0-9]/)) {
        elements.push(candidate);
      }
    });
    return elements;
  }

  function getViewsFromElement(viewElem) {

    let viewsText = viewElem.innerHTML.replace('&nbsp;','');

    // remove "views"-word
    viewsText = viewsText.replace(/[a-zA-Z&;]{3,}/, '');

    let multiplier = 1;
    if (viewsText.match(/(k|K)/)) {
      multiplier = 1000;
    }
    if (viewsText.match(/(m|M)/)) {
      multiplier = 1000000;
    }

    const views = multiplier * parseFloat(viewsText.replace(/[^0-9,]/gi,'').replace(',','.'));

    // console.log(viewElem.innerHTML, views);

    return views;
  }

  function render() {

    document.querySelectorAll('.yt-views-bar').forEach(barOuter => {
      barOuter.remove();
    });

    let max = 0;

    getViewElements().forEach(viewElem => {
      const views = getViewsFromElement(viewElem);
      if (views > max) max = views;
    });

    getViewElements().forEach(viewElem => {

      const views = getViewsFromElement(viewElem);

      const barOuter = document.createElement('div');
      barOuter.className = 'yt-views-bar';
      barOuter.style.marginTop = '3px';
      barOuter.style.overflow = 'hidden';
      barOuter.style.backgroundColor = '#555';
      barOuter.style.minHeight = '10px';

      const barInner = document.createElement('div');
      barInner.style.width = '' + Math.round((views/max)*100) + '%';
      barInner.setAttribute('data-views', views);
      barInner.setAttribute('data-max', max);
      barInner.style.background = 'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,255,0,1) 50%, rgba(0,255,0,1) 100%)';
      barInner.style.minHeight = '10px';

      barOuter.append(barInner);

      viewElem.closest('#details').prepend(barOuter);
    });
  }

  window.prevVideosCount = 0;

  (new MutationObserver(() => {
    const videosCount = document.querySelectorAll('a#thumbnail').length;
    if (videosCount !== window.prevVideosCount) {
      window.prevVideosCount = videosCount;
      render();
    }
  })).observe(document.body, {attributes: false, childList: true, subtree: true});

})();