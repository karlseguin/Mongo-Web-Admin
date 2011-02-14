Mongoweb::Application.routes.draw do
  match '/:controller(/:action(/:id))'
  root :to => 'home#index'
end
