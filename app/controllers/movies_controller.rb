class MoviesController < ApplicationController
  def home
    cache_params = {expires_in: 1.days, force: false}
    @trending_movies = MovieCore::Movie.trending(cache_params, 5)[0]
    @now_playing = MovieCore::Movie.now_playing(cache_params, 6)[0]
    @popular = MovieCore::Movie.popular(cache_params, 6)[0]
    @top_rated = MovieCore::Movie.top_rated(cache_params, 6)[0]
    @upcoming = MovieCore::Movie.upcoming(cache_params, 6, {region: 'US'})[0]
  end

  def show
    @movie = MovieCore::Movie.find(params[:id], append_to_response: "credits,release_dates,images", include_image_language: 'en')
  end

  def index
  end
end
