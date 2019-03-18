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

    CACHE_DEFAULTS = { expires_in: 7.days, force: false }

    def initialize(args = {})
      super(args)
      self.genres = parse_genres(args)
      self.production_companies = parse_production_companies(args)
    end

    def self.find(id)
      response = Request.get("movie/#{id}", CACHE_DEFAULTS)
      Movie.new(response)
    end

    def parse_genres(args)
      args.fetch("genres", []).map { |genre| Genre.new(genre) }
    end

    def parse_production_companies(args)
       args.fetch("production_companies", []).map { |company| ProductionCompany.new(company) }
    end 
  end
end
