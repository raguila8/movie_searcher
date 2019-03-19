module MoviesHelper
  def page_name
    action_name if controller_name == 'movies'
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
end
