class DatabaseController < ApplicationController
  def pick
    @context.database = params[:name]
    render :json => 
    {
      :name => params[:name], 
      :collections => @context.collection_names
    }
  end
  
  def quit
    session.delete :context
    render :json => {:ok => true}, :layout => false    
  end
  
  def list
    render :json => @context.database_names
  end
  
  def collections
    render :json => @context.collection_names
  end
end