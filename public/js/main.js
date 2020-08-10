
(function(){
  var sakura = new Sakura("header");


  var lastScrollTop = 0;

// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
  var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
  if (st > lastScrollTop){
      // downscroll code
      if (lastScrollTop > 1600 && document.querySelector(".sakura")) {
        // Kill sakura
        sakura.stop(false);
      }
  } else {
      // upscroll code
      if (lastScrollTop < 1600 && !document.querySelector(".sakura")) {
        // Restarting sakura
        sakura.start();
      }
  }
  lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

  // **********************************************************
  // SCROLLMAGIC
  // **********************************************************

  var controller = new ScrollMagic.Controller();

  new ScrollMagic.Scene({triggerElement: "#rsvp"})
      .setClassToggle("#rsvp", "reveal") // add class toggle
      .addTo(controller);

  new ScrollMagic.Scene({triggerElement: "#gallery"})
      .setClassToggle("#gallery", "reveal") // add class toggle
      .addTo(controller);

  new ScrollMagic.Scene({triggerElement: "#gallery-flowers"})
      .setClassToggle("#my-gallery", "reveal") // add class toggle
      .addTo(controller);

  new ScrollMagic.Scene({triggerElement: "#locations"})
      .setClassToggle("#locations", "reveal") // add class toggle
      .addTo(controller);

  new ScrollMagic.Scene({triggerElement: "#song"})
      .setClassToggle("#song-wrapper", "reveal") // add class toggle
      .addTo(controller);

  

  if (window.screen.availWidth > 1023) {
    new ScrollMagic.Scene({triggerElement: "#invitation-title", offset: 50})
      .setClassToggle("#invitation__info-holder", "reveal") // add class toggle
      .addTo(controller);
  } else {
    new ScrollMagic.Scene({triggerElement: "#invitation-title", offset: 400})
      .setClassToggle("#invitation__info-holder", "reveal") // add class toggle
      .addTo(controller);
  }



  // var scene = new ScrollMagic.Scene({triggerElement: "#invitation-title"})
  // .addTo(controller)
  // .addIndicators() // add indicators (requires plugin)
  // .on("enter", function (e) {
  //   // trigger animation by changing inline style.
  //   // console.log(window.screen.availWidth);
  //   if (window.screen.availWidth > 1023) {
  //     // Big screen layout
  //     console.log("big")
  //   } else {
  //     console.log("small")
  //   }
  // })


  // **********************************************************
  // FORM
  // **********************************************************

  // Submit RSVP Form
  function submitform(e) {
    e.preventDefault();

    var rsvpBtn = document.getElementById("rsvpBtn");
    rsvpBtn.disable = true;
    rsvpBtn.innerText = "Αποστολή...";

    // Get the values
    var name = document.getElementById("name").value;
    var responses = document.getElementsByName("rsvpRes");
    var response;

    for (var i = 0; i < responses.length; i += 1) {
      if (responses[i].checked) {
        response = responses[i].value;
      }
    }

    response = +response;
    var params = { name: name, response: response };

    fetch("//" + window.location.hostname + ":5000" +"/rsvp", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then(data => {

      rsvpBtn.disabled = false;
      rsvpBtn.innerText = "Αποστολή";

      if (data.status !== "OK") {
        const { message } = data;

        Object.entries(errors).forEach(error => {
          let errorEl = document.getElementById("error");
          errorEl.innerText = message;
        });
      } else {
        document.querySelector(".back").classList.remove("hidden");
        document.querySelector(".form-wrapper").classList.remove("flowers");
        document.querySelector(".form-wrapper").classList.add("flip");
        setTimeout(function(){ document.querySelector(".form-wrapper").classList.add("flowers"); }, 600);

      }
    })
    .catch(error => console.log(error));
  }
  

  document.getElementById("rsvp-form").addEventListener("submit", submitform);


  // **********************************************************
  // PHOTOSWIPE
  // **********************************************************

  var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
  };

  // execute above function
  initPhotoSwipeFromDOM('.my-gallery');

  // !PHOTOSWIPE

  // **********************************************************
  // FITTEXT
  // **********************************************************
  var addEvent = function (el, type, fn) {
    if (el.addEventListener)
      el.addEventListener(type, fn, false);
		else
			el.attachEvent('on'+type, fn);
  };
  
  var extend = function(obj,ext){
    for(var key in ext)
      if(ext.hasOwnProperty(key))
        obj[key] = ext[key];
    return obj;
  };

  window.fitText = function (el, kompressor, options) {

    var settings = extend({
      'minFontSize' : -1/0,
      'maxFontSize' : 1/0
    },options);

    var fit = function (el) {
      var compressor = kompressor || 1;

      var resizer = function () {
        el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
      };

      // Call once to set.
      resizer();

      // Bind events
      // If you have any js library which support Events, replace this part
      // and remove addEvent function (or use original jQuery version)
      addEvent(window, 'resize', resizer);
      addEvent(window, 'orientationchange', resizer);
    };

    if (el.length)
      for(var i=0; i<el.length; i++)
        fit(el[i]);
    else
      fit(el);

    // return set of elements
    return el;
  };

  window.fitText(document.querySelectorAll(".title-header"));
  // !FITTEXT

  // **********************************************************
  // Countdown-timer
  // **********************************************************
  function getRemainingTime(endtime) {
    var total = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((total / 1000) % 60);
    var minutes = Math.floor((total / 1000 / 60) % 60);
    var hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    var days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }
  
  function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
  
    function updateClock() {
      var t = getRemainingTime(endtime);
  
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
  
      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }
  
    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
  }
  
  var deadline = "September 5 2020 19:00:00 GMT+0300";
  initializeClock('countdown-timer', deadline);

  // **********************************************************
  // MAP
  // **********************************************************

  /* This will let you use the .remove() function later on */
if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
  
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYW5hcGFsIiwiYSI6ImNrNTV0bnlydjAzc2Izb3FmcXBzenZieTEifQ.i0feZTHcT5F4cAwT0hF9Iw";
  
  /**
   * Add the map to the page
   */
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/anapal/ckdd4w7p03rte1hl6ctdsqonh",
    center: [23.39, 41.236],
    zoom: 12.5
  });
  
  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
  // disable map zoom when using scroll
  map.scrollZoom.disable();
  
  var locations = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [23.39143, 41.22992]
        },
        properties: {
          id: 1,
          name: "Ιερός Ναός Αγ. Παρασκευής",
          phoneFormatted: "",
          phone: "",
          address: "Βασιλέως Γεωργίου Β' 65",
          city: "Σιδηρόκαστρο",
          country: "Ελλάδα",
          postalCode: "623 00"
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [23.40888, 41.26032]
        },
        properties: {
          id: 2,
          name: "Κτήμα Γάλβα",
          phoneFormatted: "698 28 00 200",
          phone: "6982800200",
          address: "Ζεστά νερά Σιδηροκάστρου",
          city: "Σιδηρόκαστρο",
          country: "Ελλάδα",
          postalCode: "623 00"
        }
      }
    ]
  };
  
  /**
   * Assign a unique id to each location. You'll use this `id`
   * later to associate each point on the map with a listing
   * in the sidebar.
   */
//   locations.features.forEach(function (location, i) {
//     location.properties.id = i;
//   });
  
  /**
   * Wait until the map loads to make changes to the map.
   */
  map.on("load", function (e) {
    /**
     * This is where your '.addLayer()' used to be, instead
     * add only the source without styling a layer
     */
    map.addSource("places", {
      type: "geojson",
      data: locations
    });
  
    /**
     * Add all the things to the page:
     * - The location listings on the side of the page
     * - The markers onto the map
     */
    buildLocationList(locations);
    addMarkers();
  });
  
  /**
   * Add a marker to the map for every location listing.
   **/
  function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    locations.features.forEach(function (marker) {
      /* Create a div element for the marker. */
      var el = document.createElement("div");
      /* Assign a unique `id` to the marker. */
      el.id = "marker-" + marker.properties.id;
      /* Assign the `marker` class to each marker for styling. */
      el.className = "marker" + " " + "marker-" + marker.properties.id;
  
      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
  
      /**
       * Listen to the element and when it is clicked, do three things:
       * 1. Fly to the point
       * 2. Close all other popups and display popup for clicked location
       * 3. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      el.addEventListener("click", function (e) {
        /* Fly to the point */
        flyToLocation(marker);
        /* Close all other popups and display popup for clicked location */
        createPopUp(marker);
        /* Highlight listing in sidebar */
        var activeItem = document.getElementsByClassName("active");
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        var listing = document.getElementById("listing-" + marker.properties.id);
        listing.classList.add("active");
      });
    });
  }
  
  /**
   * Add a listing for each location to the sidebar.
   **/
  function buildLocationList(data) {
    data.features.forEach(function (location, i) {
      /**
       * Create a shortcut for `location.properties`,
       * which will be used several times below.
       **/
      var prop = location.properties;
  
      /* Add a new listing section to the sidebar. */
      var listings = document.getElementById("listings");
      var listing = listings.appendChild(document.createElement("a"));
      /* Assign a unique `id` to the listing. */
      listing.id = "listing-" + prop.id;
      /* Assign the `item` class to each listing for styling. */
      listing.className = "item";
  
      /* Add the link to the individual listing created above. */
      var title = listing.appendChild(document.createElement("h3"));
      listing.href = "#";
      listing.id = "link-" + prop.id;
      title.className = "title";
      title.innerHTML = prop.name;
  
      /* Add details to the individual listing. */
      var details = listing.appendChild(document.createElement("p"));
      details.innerHTML = prop.address;
      if (prop.phone) {
        details.innerHTML += " &middot; " + prop.phoneFormatted;
      }
  
      /**
       * Listen to the element and when it is clicked, do four things:
       * 1. Update the `currentFeature` to the location associated with the clicked link
       * 2. Fly to the point
       * 3. Close all other popups and display popup for clicked location
       * 4. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      listing.addEventListener("click", function (e) {
        for (var i = 0; i < data.features.length; i++) {
          if (this.id === "link-" + data.features[i].properties.id) {
            var clickedListing = data.features[i];
            flyToLocation(clickedListing);
            createPopUp(clickedListing);
          } else {
            console.log("nope")
          }
        }
        var activeItem = document.getElementsByClassName("active");
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        this.parentNode.classList.add("active");
      });
    });
  }
  
  /**
   * Use Mapbox GL JS's `flyTo` to move the camera smoothly
   * a given center point.
   **/
  function flyToLocation(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }
  
  /**
   * Create a Mapbox GL JS `Popup`.
   **/
  function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();
    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        "<h4>" +
          currentFeature.properties.name +
          "</h4>" +
          "<h5>" +
          currentFeature.properties.address +
          "</h5>"
      )
      .addTo(map);
  }
  
}());