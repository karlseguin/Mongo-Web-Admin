class DatabaseController < ApplicationController
  def pick
    context = session[:context]
    context.database = params[:name]
    render :json => 
    {
      :name => params[:name], 
      :collections => context.collection_names
    }
  end
end