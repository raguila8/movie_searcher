module MovieCore
  class CrewMember < Base
    attr_accessor :credit_id,
                  :department,
                  :gender,
                  :id,
                  :name,
                  :job,
                  :profile_path
  end
end
