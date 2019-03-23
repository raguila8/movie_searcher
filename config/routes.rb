Rails.application.routes.draw do
  get 'movies/home', to: 'movies#home', as: :home
  get 'movies/:id', to: 'movies#show', as: :movie
  get 'movies/index', to: 'movies#index', as: :index

  root 'movies#home'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
