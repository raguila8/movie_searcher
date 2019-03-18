require 'faraday'
require 'json'

class Connection
  BASE = 'https://api.themoviedb.org'

  def self.api
    Faraday.new(url: BASE) do |faraday|
      faraday.response :logger
      faraday.adapter Faraday.default_adapter
      faraday.headers['Content-Type'] = 'application/json'
      #faraday.headers['X-Mashape-Key'] = ENV['MASHAPE_KEY']
      faraday.basic_auth('api_key', Rails.application.credentials.dig(:tmdb_api_key))
    end
  end
end
