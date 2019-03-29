module MovieCore
  class Credit < Base
    attr_accessor :credit_id,
                  :cast_id,
                  :character,
                  :order,
                  :department,
                  :gender,
                  :id,
                  :name,
                  :job,
                  :profile_path,
                  :title,
                  :poster_path
 
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
  end
end
