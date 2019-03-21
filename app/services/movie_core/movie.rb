module MovieCore
  class Movie < Base
    attr_accessor :backdrop_path,
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
                 :vote_count,
                 :genres,
                 :production_companies

    CACHE_DEFAULTS = { expires_in: 7.days, force: false }
    MAX_LIMIT = 5

    def initialize(args = {})
      super(args)
      self.genres = parse_genres(args)
      self.production_companies = parse_production_companies(args)
    end

    def self.find(id)
      response = Protocol::Request.get("movie/#{id}", CACHE_DEFAULTS)
      Movie.new(response)
    end

    def self.trending(cache_params, max_limit=MAX_LIMIT, query = {})
      cache = CACHE_DEFAULTS.merge( cache_params )
      response = Protocol::Request.where('trending/movie/week', cache, query)
      movies = response.fetch('results', []).sample(max_limit).map { |movie| MovieCore::Movie.find(movie.fetch('id')) }
      [ movies, response[:errors] ]
    end

    def self.now_playing(cache_params, max_limit=6, query= {})
      cache = CACHE_DEFAULTS.merge( cache_params )
      response = Protocol::Request.where('movie/now_playing', cache, query)
      movies = response.fetch('results', []).sample(max_limit).map { |movie| MovieCore::Movie.find(movie.fetch('id')) }
      [ movies, response[:errors] ]
    end

    def self.latest(cache_params, max_limit=6, query= {})
      cache = CACHE_DEFAULTS.merge( cache_params )
      response = Protocol::Request.where('movie/latest', cache, query)
      Movie.new(response)
    end

    def self.popular(cache_params, max_limit=6, query ={})
      cache = CACHE_DEFAULTS.merge( cache_params )
      response = Protocol::Request.where('movie/popular', cache, query)
      movies = response.fetch('results', []).sample(max_limit).map { |movie| MovieCore::Movie.find(movie.fetch('id')) }
      [ movies, response[:errors] ]
    end

    def self.top_rated(cache_params, max_limit=6, query = {})
      cache = CACHE_DEFAULTS.merge( cache_params )
      response = Protocol::Request.where('movie/top_rated', cache, query)
      movies = response.fetch('results', []).sample(max_limit).map { |movie| MovieCore::Movie.find(movie.fetch('id')) }
      [ movies, response[:errors] ]
    end

    def self.upcoming(cache_params, max_limit=6, query ={region: 'US'})
      cache = CACHE_DEFAULTS.merge( cache_params )
      response = Protocol::Request.where('movie/upcoming', cache, query)
      movies = response.fetch('results', []).sample(max_limit).map { |movie| MovieCore::Movie.find(movie.fetch('id')) }
      [ movies, response[:errors] ]
    end

    def parse_genres(args)
      args.fetch("genres", []).map { |genre| Genre.new(genre) }
    end

    def parse_production_companies(args)
       args.fetch("production_companies", []).map { |company| ProductionCompany.new(company) }
    end 
  end
end
