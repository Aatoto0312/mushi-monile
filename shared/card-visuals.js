(function (root) {
  'use strict';
  function artwork(card) {
    if (!card || !card.officialNumber) return null;
    var set = card.set === 'STARTER' ? 'BOOSTER_SET_1' : card.set;
    var number = String(card.officialNumber).split('/')[0];
    return (root.MushiCardArt || {})[set + ':' + Number(number)] || null;
  }
  function create(card, options) {
    options = options || {};
    var wrap = document.createElement('span');
    wrap.className = 'specimen-art';
    var fallback = document.createElement('span');
    fallback.className = 'art-fallback';
    fallback.textContent = (card && card.name) || '蟲神器';
    wrap.appendChild(fallback);
    var source = artwork(card);
    if (source && source.image) {
      var img = document.createElement('img');
      img.alt = options.decorative ? '' : card.name + 'のカード画像';
      img.loading = options.eager ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', function () { wrap.classList.add('art-loaded'); });
      img.addEventListener('error', function () { img.remove(); wrap.classList.add('art-unavailable'); });
      img.src = source.local || source.image;
      wrap.appendChild(img);
    }
    return wrap;
  }
  root.MushiCardVisuals = { artwork: artwork, create: create };
})(typeof window !== 'undefined' ? window : globalThis);
