module MovieCore
  class Person < Base
    attr_accessor  :birthday,
                   :known_for_department,
                   :deathday,
                   :id,
                   :name,
                   :also_known_as,
                   :gender,
                   :biography,
                   :popularity,
                   :place_of_birth,
                   :profile_path,
                   :adult,
                   :imdb_id,
                   :homepage,
                   :acting_credits,
                   :crew_credits,
                   :images
                   

    CACHE_DEFAULTS = { expires_in: 7.days, force: false }

    def initialize(args ={})
      super(args)
      parse_acting_credits(args)
      parse_crew_credits(args)
      self.images = parse_images(args)
    end

    def self.find(id, query={})
      response = Protocol::Request.get("person/#{id}", CACHE_DEFAULTS, query)
      Person.new(response)
    end

    def gender_to_str
      case self.gender
      when 0
        'Not specified'
      when 1
        'Female'
      when 2
        'Male'
      end
    end

    def parse_acting_credits(args)
      self.acting_credits = args.fetch("movie_credits", {}).fetch('cast', []).map {|c| Credit.new(c) }
    end

    def parse_crew_credits(args)
      credit_ids = []
      self.crew_credits = []
      args.fetch("movie_credits", {}).fetch('crew', []).each do |c|
        if not credit_ids.include? c['id']
          credit_ids << c['id']
          self.crew_credits << (credit = Credit.new(c))
        else
          credit = self.crew_credits.detect { |i| i.id == c['id'] }
          credit.merge_with(c)
        end
      end
    end

    def parse_images(args)
      args.fetch("images", {}).fetch('profiles', []).map { |image| Image.new(image) }
    end

    def known_credits
      self.acting_credits.length + self.crew_credits.length
    end
  end
end
