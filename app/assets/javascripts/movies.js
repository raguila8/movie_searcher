$(document).on('turbolinks:load', function() {
  if ($('body').data('page') == 'home') {
    initTransparentNavbar();
    initTrailerVideos();
    //initYTAPI();
  }

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
});

/* ------------------------------------------------------------------
  Navigation
	------------------------------------------------------------------ */
function initTransparentNavbar() {
  // Transition effect for navbar 
	$(window).scroll(function() {
    // checks if window is scrolled more than 2px, adds/removes solid class
	  if($(this).scrollTop() > 2) { 
		  $('.navbar').addClass('solid');
		} else {
		  $('.navbar').removeClass('solid');
	  }
  });
}

/* ----------------------------------------------------------------
  Youtube Iframe player api
  -------------------------------------------------------------- */

function initYTAPI() {
  loadYTAPI();
  
  var player;
  onYouTubeIframeAPIReady() 
}

//  This code loads the IFrame Player API code asynchronously.
function loadYTAPI() {
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

//  This function creates an <iframe> (and YouTube player)
//  after the API code downloads.
function onYouTubeIframeAPIReady() {
  console.log('running');
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady
    }
  });
}

//  The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

function initTrailerVideos() {
  console.log('running function');
  // Gets the video src from the data-src on each button

  var $trailerSrc;
  $('.movie-poster-item, .carousel-item').on('click', '.trailer-btn', function() {
    console.log('btn-clicked');
    $trailerSrc = $(this).data( "src" );
  });   
          
  // when the modal is opened autoplay it  
  $('#trailerModal').on('shown.bs.modal', function (e) {
              
    // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
    $("#trailer").attr('src',$trailerSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
  });
                
  // stop playing the youtube video when I close the modal
  $('#trailerModal').on('hide.bs.modal', function (e) {
    // a poor man's stop video
    $("#trailer").attr('src',$trailerSrc); 
  });
}
