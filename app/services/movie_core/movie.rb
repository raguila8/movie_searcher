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
                  :production_companies,
                  :videos,
                  :trailers,
                  :external_ids

    CACHE_DEFAULTS = { expires_in: 7.days, force: false }
    MAX_LIMIT = 5

    def initialize(args = {})
      super(args)
      self.genres = parse_genres(args)
      self.production_companies = parse_production_companies(args)
      self.videos = parse_videos(args)
      self.trailers = parse_trailers if videos?
    end

    def self.find(id, query={})
      query = query.merge({ append_to_response: 'videos,external_ids' })
      response = Protocol::Request.get("movie/#{id}", CACHE_DEFAULTS, query)
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

    def parse_videos(args)
      args.fetch("videos", {}).fetch('results', []).map { |video| Video.new(video) }
    end

    def parse_trailers
      self.videos.select { |video| video.type == 'Trailer' }
    end

    def get_a_trailer
      trailers? ? self.trailers.sample : nil
    end

    def videos?
      not self.videos.empty?
    end

    def trailers?
      videos? and not self.trailers.empty?
    end

    def has_facebook?
      not self.external_ids["facebook_id"].nil?
    end

    def has_instagram?
       not self.external_ids["instagram_id"].nil?
    end

    def has_twitter?
       not self.external_ids["twitter_id"].nil?
    end

    def facebook_url
      "https://facebook.com/#{self.external_ids["facebook_id"]}"
    end

    def instagram_url
      "https://www.instagram.com/#{self.external_ids["instagram_id"]}"
    end

    def twitter_url
      "https://twitter.com/#{self.external_ids["twitter_id"]}"
    end
  end
end
