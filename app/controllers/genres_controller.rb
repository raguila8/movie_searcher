class GenresController < ApplicationController
  def show
    @genre = MovieCore::Genre.new(id: params[:id])
    @movies = MovieCore::Movie.discover_movies_with_genre(@genre.id)[0]
  end
end
