class MoviesController < ApplicationController
  def home
    cache_params = {expires_in: 1.days, force: false}
    @trending_movies = MovieCore::Movie.trending(cache_params, 5)[0]
  end

  def show
  end

  def index
  end
end
