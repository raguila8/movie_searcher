require 'faraday'
require 'json'

module Protocol
  class Connection
    BASE = 'https://api.themoviedb.org/3'

    def self.api
      Faraday.new(url: BASE) do |faraday|
        faraday.response :logger
        faraday.adapter Faraday.default_adapter
        faraday.headers['Content-Type'] = 'application/json'
        #faraday.headers['X-Mashape-Key'] = ENV['MASHAPE_KEY']
      end
    end
  end
end
