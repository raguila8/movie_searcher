module MoviesHelper
  def page_name
    action_name if controller_name == 'movies'
  end
end
