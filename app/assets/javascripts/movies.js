$(document).on('turbolinks:load', function() {
  if ($('body').data('page') == 'home') {
    initTransparentNavbar();
    initModalVideos();
    //initYTAPI();
  }

  if ($('body').data('page') == 'show') {
    $('.cast-carousel, .cast-credits-carousel, .crew-credits-carousel').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      centerMode: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    $('.crew-carousel').slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      variableWidth: true,
      centerMode: true,
      centerPadding: '60px',
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    $('.video-carousel').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
			centerMode: true,
			focusOnSelect: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    $('#all-tab').on('click', function() {
      $(this).find('.slick-carousel').slick('refresh');
    });

    initShowVideos();
    initModalVideos();
  }

  if ($('body').data('page') == 'genres#show') {
    $('.grid-layout-toggles > span').on('click', function() {
      $previousGrid = $('.grid-layout-toggles span.active');
      if ($previousGrid.is($(this))) {
        return;
      } else {
        $previousGrid.removeClass('active');
        $(this).addClass('active');
        changeGridLayout($previousGrid.data('col'), $(this).data('col'));
      }
    });
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

function initModalVideos() {
  // Gets the video src from the data-src on each button

  var $videoSrc;
  $('body').on('click', '.video-toggle', function() {
    $videoSrc = $(this).data( "src" );
  });
          
  // when the modal is opened autoplay it  
  $('#videoModal').on('shown.bs.modal', function (e) {
              
    // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
    $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
  });
                
  // stop playing the youtube video when I close the modal
  $('#videoModal').on('hide.bs.modal', function (e) {
    // a poor man's stop video
    $("#video").attr('src',$videoSrc); 
  });
}

function initShowVideos() {
  var $videoSrc;

	if ($('.video-carousel').length > 0) {
    
    $('.video-carousel-item .video-image-container').on('click', function() {
      $videoSrc = $(this).data( "src" );
	  	$("#show-video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" );

	  	$('.video-carousel-item .video-image-container').removeClass('active');
	  	$(this).addClass('active');
    });

	} else {
    $('.video-card').on('click', function() {
      $videoSrc = $(this).data( "src" );
		});
  }
}

function changeGridLayout(oldGrid, newGrid) {
  let classes_to_add = getClassesToAdd(oldGrid, newGrid);
  $(".movie-list-item[class*='col-md-']").removeClass(function(index, css) {
    return (css.match (/(^|\s)col-md-\S+/g) || []).join(' ');
  }).addClass(classes_to_add);
  
}

function getClassesToAdd(oldGrid, newGrid) {
  switch(newGrid) {
    case 1:
      return "col-md-12"
    case 2:
      return "col-md-6"
    case 3:
      changeToThreeColumnGrid(oldGrid);
      return "col-md-4"
    case 4:
      return "col-md-3"
  }
}

function changeToThreeColumnGrid(oldGrid) {
  switch(oldGrid) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      $('.movie-list-item').addClass('mb-4').find('.movie-meta').hide();
      $('.movie-list-item').each(function() {
        $(this).find('img').attr('src', $(this).find('img').data('backdrop'));
      });

      $('.movie-list-item-body').addClass('d-block');
      break;
  }
}
