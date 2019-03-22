module Protocol
  class Request
    QUERY = {api_key: Rails.application.credentials.dig(:tmdb_api_key)}

    class << self
      def where(resource_path, cache_params, query = {}, options = {})
        query = QUERY.merge(query)
        response, status = get_json(resource_path, cache_params, query)
        status == 200 ? response : errors(response)
      end

      def get(id, cache_params, query={})
        response, status = get_json(id, cache_params, query)
        status == 200 ? response : errors(response)
      end

      def errors(response)
        error = { errors: { status: response["status"], message: response["message"] } }
        response.merge(error)
      end

      def get_json(root_path, cache_params, query = {})
        query = QUERY.merge(query)
        query_string = query.map{|k,v| "#{k}=#{v}"}.join("&")
        path = query.empty?? root_path : "#{root_path}?#{query_string}"

        response =  Rails.cache.fetch(path, cache_params) do
          api.get(path)
        end

        [JSON.parse(response.body), response.status]
      end

      def api
        Protocol::Connection.api
      end
    end
  end
end
