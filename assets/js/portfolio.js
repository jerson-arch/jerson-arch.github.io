
var itemsthumbnails = document.querySelector('[data-ref="mix-thumbnials"]');
var containerEl = document.querySelector('.container');
var loadItems = document.querySelector('.load-items');
var controls = document.querySelector('.controls');
var targetSelector = '.portfolio';
var endItems = document.querySelector('.load-items');
var tophere = document.querySelector('.scroll-top');
var ovar = document.getElementsByClassName('ovarlay')[0];
var count = true;

var mixer = mixitup(itemsthumbnails, {
  selectors: {
    target: targetSelector
  },
  load: {
    filter: getSelectorFromHash()
  },
  callbacks: {
    onMixEnd: setHash
  }
})

function mitdate() {
  count = false;
  //ovar.style.display = 'block';
  var db = firebase.database().ref('/portfolio/web');
  db.on('value', function (snapshot) {
    var players = snapshot.val();
    setitemsportfolio(players);
    setTimeout(function () {
      count = true;
      //ovar.style.display = 'none';
    }, 500);
    //endItems.scrollIntoView({ behavior: 'smooth' });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

/*
endItems.addEventListener('click', function () {
  setTimeout(mitdate, 500);
  tophere.style.display = 'block';
});


tophere.addEventListener('click', function () {
  document.getElementsByTagName('body')[0].scrollIntoView({ behavior: 'smooth' });
})
*/

function setitemsportfolio(items) {
  let all_items = '';
  items.forEach(function (item) {
    all_items += '<div class="portfolio ' + item.filter_category + '" data-src="' + item.image + '">'
      + '<div class="portfolio-wrapper" style="background: url(' + item.image + ') center/cover;">'
      + '<div class="label">'
      + '<div class="label-text">'
      + '<a class="label-text-title">' + item.name + '</a>'
      + '<span class="label-text-category">' + item.category + '</span>'
      + '</div>'
      + '<div class="label-bg"></div>'
      + '</div>'
      + '</div>'
      + '</div>';
  }, this);
  mixer.append(all_items);
  window.lgData[itemsthumbnails.getAttribute('lg-uid')].destroy(true);
  lightGallery(itemsthumbnails);
}

function getSelectorFromHash() {
  var hash = window.location.hash.replace(/^#/g, '');
  var selector = hash ? '.' + hash : targetSelector;
  return selector;
}

function setHash(state) {
  var selector = state.activeFilter.selector;
  var newHash = '#' + selector.replace(/^./g, '');
  if (selector === targetSelector && window.location.hash) {
    history.pushState(null, document.title, window.location.pathname);
  } else if (newHash !== window.location.hash && selector !== targetSelector) {
    history.pushState(null, document.title, window.location.pathname + newHash);
  }
}

var relation = document.getElementsByClassName('custom-select')[0];

relation.addEventListener("change", function (e) {
  const valueChange = e.target.value;
  console.log(valueChange);
  if (valueChange == 'all') {
    mixer.filter(valueChange);
  } else {
    mixer.filter('.' + valueChange);

  }
});

window.onscroll = function (ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && count == true && document.body.offsetWidth < 400) {
    setTimeout(mitdate, 500);
  }
};

lightGallery(itemsthumbnails, {
  enableSwipe: true,
});
mitdate();