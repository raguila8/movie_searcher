module MoviesHelper
  def page_name
    return action_name if controller_name == 'movies' or controller_name == "people"
    return 'genres#show' if controller_name == 'genres'
  end

  def navbar_class
    return "fixed-top" if page_name == "home"
    return "solid" if page_name == "show"
  end
 
  def home_carousel_item_html(movie, index)
    "<div class='carousel-item #{'active' if index == 0}' style='background-image: url(#{configurations_base_url}/original/#{movie.backdrop_path});'>
		</div>".html_safe
  end

  def home_carousel_items
    @trending_movies.each_with_index do |movie, index|
      render html: home_carousel_item_html(movie, index)
    end
  end

  def configurations_base_url
    "https://image.tmdb.org/t/p/"
  end

  def home_sections
    ['Now playing', 'Popular', 'Top rated', 'Upcoming']
  end

  def home_collection(section)
    case section
    when "Now playing"
      @now_playing
    when "Popular"
      @popular
    when "Top rated"
      @top_rated
    when "Upcoming"
      @upcoming
    else
      nil
    end
  end

  def movie_header_poster_image(poster_path)
    if poster_path.nil?
      "<img src='/assets/movie1-02.jpg' style='max-width:50%; height: auto;'>".html_safe
    else
      "<img src='#{ configurations_base_url }w500#{poster_path}' class='img-fluid'>".html_safe
    end
  end

  def poster_image_src(poster_path)
    if poster_path.nil?
      "/assets/movie1-02.jpg"
    else
      "#{ configurations_base_url }h632#{poster_path}" 
    end
  end
end
