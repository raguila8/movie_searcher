class PeopleController < ApplicationController
  def show
    @person = MovieCore::Person.find(params[:id], append_to_response: "movie_credits,external_ids,images,tagged_images")
  end
end

