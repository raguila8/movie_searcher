module PeopleHelper
  def person_header_profile_image(person)
    if not person.profile_path.nil?
      "<img src='#{configurations_base_url}original#{person.profile_path}' class='img-fluid'>".html_safe
    else
      "<img src='/assets/default-profile-icon.jpg' style='width:20%; height: auto;'>".html_safe
		end
  end

  def profile_image_src(person)
    if not person.profile_path.nil?
      "#{configurations_base_url}h632#{person.profile_path}"
    else
      "/assets/default-profile-icon.jpg"
		end
  end
end
