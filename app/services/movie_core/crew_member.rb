module MovieCore
  class CrewMember < Base
    attr_accessor :credit_id,
                  :department,
                  :gender,
                  :id,
                  :name,
                  :job,
                  :profile_path

    def merge_with(crew_member)
      merge_department(crew_member['department'])
      merge_job(crew_member['job'])
    end

    def merge_department(department)
      self.department = "#{self.department}, #{department}"
    end

    def merge_job(job)
      self.job = "#{self.job}, #{job}"
    end

    def is_in_department?(department)
      self.department.split(", ").include? department
    end

    def has_job?(job)
      self.job.split(", ").include? job
    end
  end
end
