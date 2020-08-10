(function(){
  var loader = document.getElementById("loader");
  var html = document.querySelector("html");

  loader.classList.remove("loader--hidden");
  html.classList.add("no-scroll");

  var imgLoad = imagesLoaded( document.getElementsByTagName('body')[0], { background: true } );

  imgLoad.on( 'always', function( instance ) {
    console.log('ALWAYS - all images have been loaded');
    setTimeout(function(){
      loader.classList.add("loader--hidden");
      html.classList.remove("no-scroll");
      document.querySelector("body").classList.add("loaded");
    }, 1500);
  });
})();