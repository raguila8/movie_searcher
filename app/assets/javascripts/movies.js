$(document).on('turbolinks:load', function() {
  $(window).unbind('scroll');
  initInfiniteScroll();

  if ($('body').data('page') == 'home') {
    initTransparentNavbar();
    initModalVideos();
    //initYTAPI();
  }

  if ($('.custom-select1').length > 0 && $('.select-items').length == 0) {
    initCustomSelect();
  }

  if ($('body').data('page') == "discover" || $('body').data('page') == "genres#show") {
    //initInfiniteScroll();
  }

  searchOnInput();

  /* -----------------------
    Search overlay
  ------------------------- */
  function openNav() {
     document.getElementById("fullscreen-search").style.height = "100%";
  }
  function closeNav() {
     document.getElementById("fullscreen-search").style.height = "0%";
  }


  if ($('body').data('page') == 'show') {
    $('.cast-carousel, .cast-credits-carousel, .crew-carousel').on('init', function(slick) {
      let height = $($(this).find(".credit-profile-container")[0]).css('padding-top');
      $(this).find('.slick-arrow').css('height', height);
    });


    $('.cast-carousel, .cast-credits-carousel, .crew-carousel').slick({
      infinite: false,
      slidesToShow: 7,
      slidesToScroll: 7,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6
          }
        },

        {
          breakpoint: 1092,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5

          }
        },

        {
          breakpoint: 920,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4
          }
        },

        {
          breakpoint: 700,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },

        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    });

/* 
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
*/

    $('.video-carousel').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
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

    let resizeChangeTimer = false;
    $(window).on('resize', function(){
      if(resizeChangeTimer !== false) clearTimeout(resizeChangeTimer);
      resizeChangeTimer = setTimeout(function(){
        let $slick = $('.cast-carousel, .cast-credits-carousel, .crew-carousel');
        let height = $($slick.find(".credit-profile-container")[0]).css('padding-top');
        console.log(height);
        $slick.find('.slick-arrow').css('height', height);
        resizeChangeTimer = false;
      }, 300);
    });

    $(".arrow-link[data-trigger='tab']").on('click', function (e) {
      e.preventDefault();
      let target = $(this).attr('data-target');
      $target = $("#movieTab a[id='" + target + "']");
      if (!$target.hasClass('active')) {
        $target.tab('show'); // Select tab by name
      }
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
        changeGridLayout($(this).data('col'));
      }
    });

    // Sort order toggles
    $('.sort-order-option').on('click', function() {
      let $c = $(this).closest('.sort-order');
      let newOrder = $(this).data('order-option');
      if (newOrder != $c.data('order')) {
        $c.attr('data-order', newOrder).data('order', newOrder);
        $(this).find('svg.unchecked-radio').addClass('d-none');
        $(this).find('svg.checked-radio').removeClass('d-none');

        let $otherOption = $(this).siblings('.sort-order-option');
        $otherOption.find('svg.unchecked-radio').removeClass('d-none');
        $otherOption.find('svg.checked-radio').addClass('d-none');

        let $sorter = $c.prev('.custom-select1');
        console.log("sort-attr:  " + $sorter.attr('data-sort'));
        console.log("sort-data:  " + $sorter.data('sort'));

        let sortBy = $sorter.attr('data-sort');
        let newSort = sortBy + "." + newOrder;
        //let newSort = sortBy.substring(0, sortBy.lastIndexOf(".") + 1) + newOrder;
        //$sorter.attr('data-sort', newSort).data('sort', newSort);
        //sortMovies($sorter.attr('data-sort'));
        sortMovies(newSort);
        console.log("sort: " + newSort);
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

function changeGridLayout(newGrid) {
  let colClasses = "";
  switch(newGrid) {
    case "full-width-overview":
      changeToOneColumnGrid();
      colClasses =  "col-lg-12 row";
      break;
    case "poster-with-overview":
      changeToTwoColumnGrid();
      colClasses =  "col-xxl-3 col-lg-4 col-md-6 row";
      break;
    case "backdrop-compact":
      changeToThreeColumnGrid();
      colClasses =  "col-xxl-2 col-xl-2half col-lg-3 col-md-4 col-sm-6";
      break;
    case "poster-compact":
      changeToFourColumnGrid()
      colClasses = "col-xxl-2 col-xl-2half col-lg-3 col-sm-4 col-6";
    break;
  }

  $(".movie-list-item[class*='col-']").removeClass(function(index, css) {
    return (css.match (/(^|\s)col-\S+/g) || []).join(' ');
  }).addClass(colClasses);
}

function changeToThreeColumnGrid() {
  $('.movie-list-item').addClass('mb-4').removeClass('row').find('.movie-meta').hide();
  //$('.movie-list-item').fadeTo('100', 0);
  $('.movie-list-item').each(function() {
    $(this).fadeTo('slow', 0);
    let $poster = $(this).find("img[data-image-type='poster']");
    let $backdrop = $(this).find("img[data-image-type='backdrop']");

    $poster.addClass('d-none').removeClass('d-block');
    $backdrop.addClass('d-block').removeClass('d-none');
    $(this).find('.movie-list-item-body').addClass('d-block text-center').removeClass('col-md-7 col-md-4 col-md-8 order-first pt-3 p-1');
    $(this).find('.movie-poster-item').removeClass('col-md-5 col-md-4 col-md-3 order-last');
    $(this).find('.movie-list-item-body .movie-overview').removeClass('d-block d-webkit-box').addClass('d-none');
    $(this).find('.movie-list-item-body .movie-title').addClass('fs-105').removeClass('fs-140 fs-130');
    $(this).find('.movie-list-item-body .movie-release-date').addClass('fs-094').removeClass('fs-105 fs-100');
  });
  $('.movie-list-item').fadeTo('slow', 1);
}

function changeToFourColumnGrid() {
  $('.movie-list-item').removeClass('row').addClass('mb-4').find('.movie-meta').show();
  $('.movie-list-item').each(function() {
    $(this).fadeTo('slow', 0);
    let $backdrop = $(this).find("img[data-image-type='backdrop']");
    let $poster = $(this).find("img[data-image-type='poster']");

    $backdrop.removeClass('d-block').addClass('d-none');
    $poster.removeClass('d-none').addClass('d-block');
    //$(this).find("img[data-image-type='poster']").addClass('d-block');
    $(this).find('.movie-list-item-body').addClass('d-block text-center').removeClass('col-md-8 col-md-7 pt-3 p-1');
    $(this).find('.movie-list-item-body .movie-overview').removeClass('d-block d-webkit-box').addClass('d-none');
    $(this).find('.movie-poster-item').removeClass('col-md-5 col-md-4 col-md-3 order-last');
    $(this).find('.movie-list-item-body .movie-title').addClass('fs-105').removeClass('fs-140 fs-130');
    $(this).find('.movie-list-item-body .movie-release-date').addClass('fs-094').removeClass('fs-105 fs-100');

  });
  $('.movie-list-item').fadeTo('slow', 1);
}

function changeToTwoColumnGrid() {
  $('.movie-list-item').addClass('mb-4').find('.movie-meta').hide();
  $('.movie-list-item').each(function() {
    $(this).fadeTo('slow', 0);
    let $backdrop = $(this).find("img[data-image-type='backdrop']");
    let $poster = $(this).find("img[data-image-type='poster']");

    $backdrop.removeClass('d-block').addClass('d-none');
    $poster.removeClass('d-none').addClass('d-block');
    //$(this).find("img[data-image-type='poster']").addClass('d-block');
    $(this).find('.movie-list-item-body').addClass('d-block col-md-7 p-1 pt-3').removeClass('text-center col-md-8 order-first');
    $(this).find('.movie-poster-item').addClass('col-md-5').removeClass('col-md-4 order-last');
    $(this).find('.movie-list-item-body .movie-overview').addClass('d-block d-webkit-box').removeClass('line-clamp-3');
    $(this).find('.movie-list-item-body .movie-title').addClass('fs-130').removeClass('fs-105 fs-140');
    $(this).find('.movie-list-item-body .movie-release-date').addClass('fs-100').removeClass('fs-094 fs-105');

  });
  $('.movie-list-item').fadeTo('slow', 1);
}

function changeToOneColumnGrid() {
  $('.movie-list-item').addClass('mb-4').find('.movie-meta').hide();
  $('.movie-list-item').each(function() {
    $(this).fadeTo('slow', 0);
    let $backdrop = $(this).find("img[data-image-type='backdrop']");
    let $poster = $(this).find("img[data-image-type='poster']");

    $backdrop.addClass('d-block').removeClass('d-none');
    $poster.addClass('d-none').removeClass('d-block');
    //$(this).find("img[data-image-type='poster']").addClass('d-block');
    $(this).find('.movie-list-item-body').addClass('d-block col-md-8 pt-3').removeClass('text-center col-md-7');
    $(this).find('.movie-poster-item').addClass('col-md-3').removeClass('col-md-5');
    $(this).find('.movie-list-item-body .movie-overview').addClass('d-block d-webkit-box line-clamp-3');
    $(this).find('.movie-list-item-body .movie-title').addClass('fs-140').removeClass('fs-105 fs-130');
    $(this).find('.movie-list-item-body .movie-release-date').addClass('fs-105').removeClass('fs-094 fs-100');
  });
  $('.movie-list-item').fadeTo('slow', 1);
}

function renderMovieHTML(movie, classes) {
  return  `
  <div class="movie-list-item ${classes.movieListItem}">
    <div class="movie-poster-item ${classes.moviePosterItem}">
      <div class="position-relative movie-poster-container">
        <a href="/movies/${movie['id']}" class="movie-link"></a>
        <img src="https://image.tmdb.org/t/p/original${movie['backdrop_path']}" class="img-fluid ${classes.backdrop}" data-image-type="backdrop" onerror="this.onerror=null; this.src='/assets/backdrop_default.jpg'">
        <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" class="img-fluid ${classes.poster}" data-image-type="poster" onerror="this.onerror=null; this.src='/assets/movie1-02.jpg'">
        <div class="movie-meta ${classes.movieMeta}">
          <h5 class="line-clamp line-clamp-3" >${movie['title']}</h5>
        </div>
      </div>
    </div>

    <div class="movie-list-item-body ${classes.movieListItemBody}">
      <p class="font-weight-normal mb-0 ${classes.movieTitle}">
        ${ movie.title }
      </p>
      <span class="dark-64 font-weight-light ${classes.movieReleaseDate}">
        ${ new Date(movie['release_date']).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) }
      </span>
      <p class="font-weight-normal dark-68 movie-overview line-clamp mt-3 ${classes.movieOverview}">
        ${ movie['overview'] }
      </p>
    </div>
  </div>
  `;
}

/* ----------------------------------------------------------------------
  Custom Select 
 ----------------------------------------------------------------------- */

function initCustomSelect() {
  var x, i, j, selElmnt, a, b, c;
  /* Look for any elements with the class "custom-select1": */
  x = document.getElementsByClassName("custom-select1");
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 0; j < selElmnt.length; j++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      if (selElmnt.classList.contains("movie-sorter-select")) {
        c.setAttribute("data-sort-option", selElmnt.options[j].getAttribute("data-sort-option"));
      } else if (selElmnt.classList.contains("year-filter-select")) {
        c.setAttribute("data-filter-option", selElmnt.options[j].getAttribute("data-filter-option"));
      } else if (selElmnt.classList.contains("layout-toggles-select")) {
        c.setAttribute("data-layout-option", selElmnt.options[j].getAttribute("data-layout-option"));
      }
      if ( j == 0) {
        c.setAttribute('class', 'same-as-selected');
      }
      c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
          and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        var customSelect = s.parentNode;
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            if (customSelect.hasAttribute('data-sort') && customSelect.getAttribute('data-sort') !== this.getAttribute('data-sort-option')) {
              var sortBy = this.getAttribute("data-sort-option");
              customSelect.setAttribute("data-sort", sortBy);
              //customSelect.dataset.sort = sortBy;
              console.log("here:  " + customSelect.dataset.sort);
              let order = $('.sort-options .sort-order').data('order');
              console.log("sort: " + sortBy + "." + order);
              sortMovies(sortBy + "." + order);
            } else if (customSelect.hasAttribute('data-filter') && customSelect.getAttribute('data-filter') !== this.getAttribute('data-filter-option')) {
              let myData = $('.movies-filter').data('filters');
              myData["primary_release_year"] = this.getAttribute('data-filter-option');
              $('.movies-filter').data('filters', myData).attr('data-filters', myData);
              let sort = $('.sort-options .custom-select1').attr('data-sort');
              let order = $('.sort-options .sort-order').attr('data-order');
              //sortMovies($('.sort-options .custom-select1').data('sort'));
              sortMovies(sort + "." + order);
            } else if (customSelect.hasAttribute('data-view') && customSelect.getAttribute('data-view') !== this.getAttribute('data-layout-option')) {
              let layout = this.getAttribute("data-layout-option");
              customSelect.setAttribute("data-view", layout);
              //customSelect.data.view = layout;
              changeGridLayout(layout);
            }
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
      /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

  /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
  document.addEventListener("click", closeAllSelect);
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

function sortMovies(sortBy) {
  var filters = $('.movies-filter').data('filters');
  var filtersString = "";
  for (var property in filters) {
    if (filters.hasOwnProperty(property)) {
      filtersString = filtersString + "&" + property + "=" + filters[property];
    }
  }

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/discover/movie?with_genres=18&page=1&include_video=false&include_adult=false&sort_by=" + sortBy + "&language=en-US&api_key=028d977d1d63154051352db890f31c62" + filtersString,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {
    $('#movies-row').empty().hide();
    let currentGrid = $('.layout-toggles .custom-select1').data('view');
    let classes = getMovieItemClasses(currentGrid);
    for (var i = 0; i < response.results.length; i++) {
      $("#movies-row").append(renderMovieHTML(response.results[i], classes));
    }
    
    $('#movies-row').show();
  });
}

function getMovieItemClasses(grid) {
  switch(grid) {
    case "full-width-overview":
      return { movieListItem: "col-lg-12 row mb-4", moviePosterItem: "col-md-3", backdrop: "d-block", poster: "d-none", movieMeta: "d-none", movieListItemBody: "d-block col-md-8 pt-3", movieTitle: "fs-140", movieReleaseDate: "fs-105", movieOverview: "d-block d-webkit-box line-clamp-3" };
    case "poster-with-overview":
      return { movieListItem: "col-xxl-3 col-lg-4 col-md-6 row mb-4", moviePosterItem: "col-md-5", backdrop: "d-none", poster: "d-block", movieMeta: "d-none", movieListItemBody: "d-block col-md-7 p-1 pt-2", movieTitle: "fs-130", movieReleaseDate: "fs-100", movieOverview: "d-block d-webkit-box" };
    case "backdrop-compact":
      return { movieListItem: "col-xxl-2 col-xl-2half col-lg-3 col-md-4 col-sm-6 mb-4", moviePosterItem: "", backdrop: "d-block", poster: "d-none", movieMeta: "d-none", movieListItemBody: "d-block text-center", movieTitle: "fs-105", movieReleaseDate: "fs-094", movieOverview: "d-none" };
    case "poster-compact":
      return { movieListItem: "col-xxl-2 col-xl-2half col-lg-3 col-sm-4 col-6 mb-4", moviePosterItem: "", backdrop: "d-none", poster: "d-block", movieMeta: "d-block", movieListItemBody: "d-block text-center", movieTitle: "fs-105", movieReleaseDate: "fs-094", movieOverview: "d-none" };
  }
}

/*
function renderMovieHTML(movie) {
  return  `
  <div class="col-xxl-2 col-xl-2half col-lg-3 col-sm-4 col-6 movie-list-item">
    <div class="movie-poster-item">
      <div class="position-relative movie-poster-container">
        <a href="/movies/${movie['id']}" class="movie-link"></a>
        <img src="https://image.tmdb.org/t/p/original${movie['backdrop_path']}" class="img-fluid d-none" data-image-type="backdrop" onerror="this.onerror=null; this.src='/assets/backdrop_default.jpg'">
        <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" class="img-fluid" data-image-type="poster" onerror="this.onerror=null; this.src='/assets/movie1-02.jpg'">
        <div class="movie-meta">
          <h5 class="line-clamp line-clamp-3" >${movie['title']}</h5>
        </div>
      </div>
    </div>

    <div class="movie-list-item-body d-none text-center p-3">
      <p class="font-weight-normal fs-140 mb-0">
        ${ movie.title }
      </p>
      <span class="dark-64 font-weight-light">
        ${ new Date(movie['release_date']).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) }
      </span>
      <p class="font-weight-normal d-none dark-54 movie-overview line-clamp mt-3">
        ${ movie['overview'] }
      </p>
    </div>
  </div>
  `;
}
*/


/* --------------------------------------------------------------------
    Search overlay
  -------------------------------------------------------------------- */
function openNav() {
  document.getElementById("fullscreen-search").classList.remove('d-none');
  document.getElementById("search").focus();
  document.getElementsByTagName('body')[0].classList.add('lock-scroll');
}
function closeNav() {
  document.getElementById("fullscreen-search").classList.add('d-none');
  $('.search-content').data('searched', false);
  $('.search-content').html("<div class='col-md-4 offset-md-4'><img src='/assets/movie_night.svg' class='img-fluid'><p class='dark-64 lead3 mt-4'> Search for any movie, actor or crew member </p></div>");
  $('#search').val('');
   document.getElementsByTagName('body')[0].classList.remove('lock-scroll');
}

function searchOnInput() {
  var changeTimer = false;
  var query ="";
  var resource = "";
  var $content = $('.search-content');
  $('#search').on('input', function() {
    if ($(this).val() != "") {
      if(changeTimer !== false) clearTimeout(changeTimer);
      query = $(this).val();
      changeTimer = setTimeout(function(){
        if (!$content.data('searched') || $content.find('#movies-searched-tab').hasClass('active')) {
          resource = "movie";
        } else {
          resource = "person";
        }
        var settings = {
          "async": true,
          "crossDomain": true,
           "url": "https://api.themoviedb.org/3/search/" + resource + "?include_adult=false&page=1&query=" + query + "&language=en-US&api_key=028d977d1d63154051352db890f31c62",
           "method": "GET",
           "headers": {},
           "data": "{}",
           "beforeSend": function() {
             if (!$(".search-content").data('searched')) {
               $('.search-content').html(loaderHTML());
             }
           }
        };

        $.ajax(settings).
          done(function (response) {
            if (!$content.data('searched')) {
              // display movie and person tabs. Show movies
              $content.html(searchTabsHTML());
              $content.find('#searched-movies-list').html(searchedMoviesHTML(response.results));
              $content.find('#movies-searched-tab').data('loaded', true).attr('data-loaded', true);
            } else {
              if ($content.find('#movies-searched-tab').hasClass('active')) {
                $content.find('#searched-movies-list').html(searchedMoviesHTML(response.results));
                $content.find('#movies-searched-tab').data('loaded', true).attr('data-loaded', true);
                $content.find('#people-searched-tab').data('loaded', false).attr('data-loaded', false);
              } else {
                //showSearchedPeople(response.results);
                $content.find('#searched-people-list').html(searchedPeopleHTML(response.results));
                $content.find('#people-searched-tab').data('loaded', true).attr('data-loaded', true);
                $content.find('#movies-searched-tab').data('loaded', false).attr('data-loaded', false);
              }
            }
            $content.data('searched', true);
          });
        changeTimer = false;
      },300);
    }
  });
}

function searchTabsHTML() {
  return `
    <ul class="nav nav-tabs" id="searchTabs" role="tablist">
      <li class="nav-item">
        <a onclick="searchMovies()" class="nav-link active" id="movies-searched-tab" data-loaded=false data-toggle="tab" href="#movies-searched" role="tab" aria-controls="movies" aria-selected="true">Movies</a>
      </li>
      <li class="nav-item">
        <a onclick="searchPeople()" class="nav-link" id="people-searched-tab" data-loaded=false data-toggle="tab" href="#people-searched" role="tab" aria-controls="people" aria-selected="false">People</a>
      </li>
    </ul>

    <div class="tab-content" id="searchedTabContent">
      <div class="tab-pane fade show active pt-5" id="movies-searched" role="tabpanel" aria-labelledby="movies-tab">
        <div class='row' id='searched-movies-list' data-page=1></div>
      </div>
      <div class="tab-pane fade pt-5" id="people-searched" role="tabpanel" aria-labelledby="people-tab">
        <div class='row' id='searched-people-list' data-page=1></div>
      </div>
    </div>
  `;
}

function loaderHTML() {
  return `
  <div class='position-relative width-100 height-100'>
  <div class="loader">
    <svg>
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2" result="gooey" />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
        </filter>
      </defs>
    </svg>
  </div>
  </div>
  `;
}

function searchedMoviesHTML(results) {
  var html = "";
  for (var i = 0; i < results.length; i++) {
    html += searchedMovieHTML(results[i]);
  }
  return html;
}

function searchedPeopleHTML(results) {
  var html = "";
  for (var i = 0; i < results.length; i++) {
    html += searchedPersonHTML(results[i]);
  }
  return html;
}


function searchedMovieHTML(movie) {
  return `
  <div class="col-md-12 movie-list-item row mb-4">
    <div class="movie-poster-item col-md-3">
      <div class="position-relative">
        <a href="/movies/${movie['id']}">
          <img src="https://image.tmdb.org/t/p/original${movie['backdrop_path']}" class="img-fluid" data-image-type="poster" onerror="this.onerror=null; this.src='/assets/backdrop_default.jpg'">
        </a>
      </div>
    </div>

    <div class="movie-list-item-body p-3 col-md-8 text-left">
      <a href="/movies/${movie.id}">
        <p class="font-weight-normal fs-140 mb-0">
          ${ movie.title }
        </p>
      </a>
      <span class="dark-64 font-weight-light fs-094">
        ${ new Date(movie['release_date']).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) }
      </span>
      <p class="font-weight-normal dark-68 movie-overview line-clamp mt-3">
        ${ movie['overview'] }
      </p>
    </div>
  </div>
  `;
}

function searchedPersonHTML(person) {
  var knownfor = person.known_for;
  var knownforHTML = "";
  var has_knownfor = false;

  if (knownfor.length > 0) {
    for (var j = 0; j < knownfor.length; j++) {
      if (knownfor[j].media_type == "movie") {
        has_knownfor = true;
        knownforHTML += "<a href='/movies/" + knownfor[j].id + "'><span class='badge badge-light dark-84 font-weight-normal background-light-gold mr-2'>" + knownfor[j].title + "</span></a>";
      }
    }
  } 

  html =  `
  <div class="movie-list-item mb-4 col-md-6 row">
    <div class="movie-poster-item col-md-5">
      <div class="position-relative">
        <a href='/person/${person.id}'">
          <img src="https://image.tmdb.org/t/p/w185${person['profile_path']}" class="img-fluid" data-image-type="profile" onerror="this.onerror=null; this.src='/assets/default-profile-icon-w185.jpg'">
        </a>
      </div>
    </div>
    <div class="movie-list-item-body p-3 p-1 col-md-7 text-left">
      <a href="/person/${person.id}">
      <p class="font-weight-normal fs-140 mb-0">
        ${person.name}
      </p>
      </a>
  `;

  if (has_knownfor) {
    html += `
      <span class="dark-64 font-weight-light mb-2">
        Known for:
      </span>
      <div class='known-for'>
        ${knownforHTML}
      </div></div></div>
    `;
  } else {
    html += "</div></div>";
  }

  return html;
}

function searchMovies() {
  var query = $('#search').val();
  if (!$('.search-content').find('#movies-searched-tab').data('loaded')) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "url": "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query=" + query + "&language=en-US&api_key=028d977d1d63154051352db890f31c62",
       "method": "GET",
       "headers": {},
       "data": "{}",
       "beforeSend": function() {
         
       }
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      $('#searched-movies-list').html(searchedMoviesHTML(response.results));
      $('#movies-searched-tab').data('loaded', true).attr('data-loaded', true);
    });
  }
}


function searchPeople() {
  var query = $('#search').val();

  if (!$('.search-content').find('#people-searched-tab').data('loaded')) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "url": "https://api.themoviedb.org/3/search/person?include_adult=false&page=1&query=" + query + "&language=en-US&api_key=028d977d1d63154051352db890f31c62",
       "method": "GET",
       "headers": {},
       "data": "{}",
       "beforeSend": function() {
         
       }
    };

    $.ajax(settings).done(function (response) {
      $('#searched-people-list').html(searchedPeopleHTML(response.results));
      $('#people-searched-tab').data('loaded', true).attr('data-loaded', true);
    });
  }
}

/* ----------------------------------------------------------------
 Open sidenav
----------------------------------------------------------------- */

function toggleSidenav() {
  if (document.getElementById("sidenav").style.width != "250px") {
    document.getElementById("sidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  } else {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";

  }
}

/* --------------------------------------------------------------------
  Infinite Scroll
 --------------------------------------------------------------------- */

function initInfiniteScroll() {
  if ($('body').data('page') == "discover" || $('body').data('page') == "genres#show") {
    let changeTimer = false;
    $(window).scroll(function(){
      if ($(window).scrollTop() > ($(document).height() - ($(window).height() + 300))){
        if(changeTimer !== false) clearTimeout(changeTimer);
        changeTimer = setTimeout(function(){
          let url = prepareURLForPagination();
          console.log(url);
          let $list = $('.infinite-scroll');

          var settings = {
           "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {},
            "data": "{}",
            "beforeSend": function() {
            }
          };

          $.ajax(settings).done(function (response) {
            let page = parseInt($list.data('page')) + 1
            $list.append(movieListHTML(response.results));
            $list.data('page', page).attr('data-page', page);
          });
          changeTimer = false;
        }, 300);
      }
    });
  }

  let secondChangeTimer = false;
  $content = $(".search-content");
  $content.scroll(function(){
    if ($content.scrollTop() > ($content[0].scrollHeight - ($content.height() + 300))){
      if(secondChangeTimer !== false) clearTimeout(secondChangeTimer);
      secondChangeTimer = setTimeout(function(){
        var $list;
        var resource;
        let query = $('#search').val();
        if ($content.find('#movies-searched-tab').hasClass('active')) {
          resource = "movie";
          $list = $("#searched-movies-list");
        } else {
          resource = "person";
          $list = $("#searched-people-list");
        }

        let pageToLoad = parseInt($list.data('page')) + 1;
        let url = "https://api.themoviedb.org/3/search/" + resource + "?include_adult=false&page=1&query=" + query + "&language=en-US&api_key=028d977d1d63154051352db890f31c62" + "&page=" + pageToLoad;
        console.log(url);
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "GET",
          "headers": {},
          "data": "{}",
          "beforeSend": function() {
          }
        };

        $.ajax(settings).done(function (response) {
          let classes = getMovieItemClasses("full-width-overview");
          let html = "";
          if (resource == "movie") {
            for (var i = 0; i < response.results.length; i++) {
              html += renderMovieHTML(response.results[i], classes);
            }
          } else if (resource == "person") {
            for (var i = 0; i < response.results.length; i++) {
              html += searchedPersonHTML(response.results[i]);
            }
          }
          $list.append(html);
          $list.data('page', pageToLoad).attr('data-page', pageToLoad);
        });
        secondChangeTimer = false;
      }, 300);
    }
  });
}

function getSearchPaginationURL($content) {
  let resource = "";
  if ($content.find('#movies-searched-tab').hasClass('active')) {
    resource = "movie";
  } else {
    resource = "person";
  }

  let query = $('#search').val();
  return "https://api.themoviedb.org/3/search/" + resource + "?include_adult=false&page=1&query=" + query + "&language=en-US&api_key=028d977d1d63154051352db890f31c62";

}

function prepareURLForPagination() {
  let $list = $('.infinite-scroll');
  let list = $list.data('list');
  let pageToLoad = parseInt($list.data('page')) + 1;
  let url = "";
  
  if (list == "genre") {
    let genre_id = $list.data('genre-id');
    let sort = $(".sort-options .custom-select1").attr('data-sort');
    let order = $(".sort-options .sort-order").attr('data-order');
    let sort_by = sort + "." + order;
    var filters = $('.movies-filter').data('filters');
    var filtersString = "";
    for (var property in filters) {
      if (filters.hasOwnProperty(property)) {
        filtersString = filtersString + "&" + property + "=" + filters[property];
      }
    }
    console.log(filtersString);
    console.log(sort);
    console.log(pageToLoad);
    return url = "https://api.themoviedb.org/3/discover/movie?api_key=028d977d1d63154051352db890f31c62&language=en-US&sort_by=" + sort_by + "&include_adult=false&include_video=false&page=" + pageToLoad + "&with_genres=" + genre_id + filtersString;
  } else if (list == "collection") {
    let collection = $list.data('collection');
    if (collection == "trending") {
      collection = "trending/movie/week";
      return "https://api.themoviedb.org/3/" + collection + "?api_key=028d977d1d63154051352db890f31c62&page=" + pageToLoad + "";
    }
    return "https://api.themoviedb.org/3/movie/" + collection + "?api_key=028d977d1d63154051352db890f31c62&language=en-US&page=" + pageToLoad + "";
  }
}

function movieListHTML(movies) {
  let currentGrid = $('.layout-toggles .custom-select1').attr('data-view');
  let classes = getMovieItemClasses(currentGrid);

  var html = "";
  for (var i = 0; i < movies.length; i++) {
    html += renderMovieHTML(movies[i], classes);
  }
  return html;
}

function movieItemHTML(movie) {
  return `
    <div class='col-lg-2 col-sm-3 col-4 movie-list-item'>
      <div class='movie-poster-item'>
        <div class='position-relative movie-poster-container'>
          <a href="/movies/${movie.id}" class= 'movie-link'></a>
	  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class='img-fluid' data-image-type='poster' onerror="this.onerror=null; this.src='/assets/movie1-02.jpg'">
          <div class='movie-meta'>
            <h5 class='line-clamp line-clamp-3' >${movie.title}</h5>
          </div>
        </div>
      </div>
    </div>
    `;
}
