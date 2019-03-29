Rails.application.routes.draw do
  get 'movies/home', to: 'movies#home', as: :home
  get 'movies/:id', to: 'movies#show', as: :movie
  get 'movies/index', to: 'movies#index', as: :index

  get 'person/:id', to: 'people#show', as: :person
  root 'movies#home'

  get 'genres/:id', to: 'genres#show', as: :genre
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
