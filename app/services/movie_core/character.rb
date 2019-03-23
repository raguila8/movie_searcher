module MovieCore
  class Character < Base
    attr_accessor :cast_id,
                  :character,
                  :credit_id,
                  :gender,
                  :id,
                  :name,
                  :order,
                  :profile_path
  end
end
