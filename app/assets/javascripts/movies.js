$(document).on('turbolinks:load', function() {
  if ($('body').data('page') == 'home') {
    initTransparentNavbar();
		//getMainCarouselMovies();
  }
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

/* ---------------------------------------------------------------------
  Movie DB API getters
	------------------------------------------------------------------ */

function getMainCarouselMovies() {
  let settings = {
	  "async": true,
		"crossDomain": true,
		"url": "https://api.themoviedb.org/3/trending/movie/week?api_key=028d977d1d63154051352db890f31c62",
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});
}
