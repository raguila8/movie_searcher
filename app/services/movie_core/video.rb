module MovieCore
  class Video < Base
    attr_accessor :id, 
                  :key, 
                  :name, 
                  :site,
                  :size,
                  :type
  end
end
