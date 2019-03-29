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
                  :external_ids,
                  :cast,
                  :crew,
                  :directed_by,
                  :written_by,
                  :screenplay_by,
                  :story_by,
                  :rating,
                  :backdrops,
                  :posters

    CACHE_DEFAULTS = { expires_in: 7.days, force: false }
    QUERY_DEFAULTS = { append_to_response: "videos,external_ids", language: 'en-US' }
    MAX_LIMIT = 5

    def initialize(args = {})
      super(args)
      self.genres = parse_genres(args)
      self.production_companies = parse_production_companies(args)
      self.videos = parse_videos(args)
      self.trailers = parse_trailers if videos?
      if args.key?('credits')
        self.parse_cast(args)
        self.parse_crew(args)
      end
      if args.key?('release_dates')
        self.parse_release_dates(args)
      end
      if args.key?('images')
        parse_images(args)
      end
    end

    def self.find(id, query={})
      query = QUERY_DEFAULTS.merge(query) do |key, old_val, new_val| 
        key == :append_to_response ? "#{old_val},#{new_val}" : new_val
      end
      response = Protocol::Request.get("movie/#{id}", CACHE_DEFAULTS, query)
      Movie.new(response)
    end

    def self.discover_movies_with_genre(genre)
      query = {sort_by: "popularity.desc", include_adult: false, with_genres: genre }
      response = Protocol::Request.where('discover/movie', CACHE_DEFAULTS, query)
      movies = response.fetch('results', []).map { |movie| MovieCore::Movie.new(movie) }
      [ movies, response[:errors] ]
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

    def parse_cast(args)
      self.cast = args.fetch("credits", {}).fetch('cast', []).map { |character| Credit.new(character) }
    end

    def parse_crew(args)
      self.directed_by = []
      self.written_by = []
      self.screenplay_by = []
      self.story_by = []

      crew_ids = []
      self.crew = []

      args.fetch("credits", {}).fetch('crew', []).each do |cm|
        if not crew_ids.include? cm['id']
          crew_ids << cm['id']
          self.crew << (crew_member = Credit.new(cm))
        else
          crew_member = self.crew.detect { |c| c.id == cm['id'] }
          crew_member.merge_with(cm)
        end

        directed_by << crew_member if crew_member.is_in_department? "Directing" and (not directed_by.include? crew_member)
        if crew_member.is_in_department? "Writing"
          if crew_member.has_job? "Writer" and (not written_by.include? crew_member)
            written_by << crew_member 
          elsif crew_member.has_job? "Screenplay" and (not screenplay_by.include? crew_member)
            screenplay_by << crew_member 
          elsif crew_member.has_job? "Story"  and (not story_by.include? crew_member)
            story_by << crew_member 
          end
        end
      end
    end

    def parse_images(args)
      self.backdrops = args.fetch("images", {}).fetch('backdrops', []).map { |backdrop| Image.new(backdrop) }
      self.posters = args.fetch("images", {}).fetch('posters', []).map { |poster| Image.new(poster) }
    end

    def images
      self.backdrops + self.posters
    end

    def parse_release_dates(args)
      self.rating = args.fetch("release_dates", {}).fetch('results', []).select{|r| r["iso_3166_1"] == "US"}.first
      self.rating = (self.rating.nil? ? "" : self.rating.fetch("release_dates", []).first["certification"])
      self.rating = nil if self.rating.blank?
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

    def video_count
      self.videos.length
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
