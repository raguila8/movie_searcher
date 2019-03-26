module MovieCore
  class Image < Base
    attr_accessor :aspect_ratio, 
                  :file_path, 
                  :height, 
                  :iso_639_1,
                  :vote_average,
                  :vote_count,
                  :width
  end
end
