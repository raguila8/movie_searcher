module MovieDB
  class Movie < Base
    attr_accesor :backdrop_path,
                 :homepage,
                 :id,
                 :imdb_id,
                 :original_language,
                 :original_title,
                 :overview,
                 :popularity,
                 :poster_path,
                 :release_date,
                 :revenue,
                 :runtime,
                 :status,
                 :tagline,
                 :title,
                 :vote_average,
                 :vote_count

    def initialize(args = {})
      super(args)
      self.genres = parse_genres(args)
      self.production_companies = parse_production_companies(args)
    end

    def self.find(id)
      response = Request.get("movie/#{id}")
      Movie.new(response)
    end

    def parse_genres(args)
      
    end

    def parse_production_companies(args)
      
    end 
  end
end
