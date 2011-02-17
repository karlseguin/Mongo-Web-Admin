class DatabaseController < ApplicationController
  def connect
    context = Context.new({:host => params[:host], :port => params[:port] || 27017})
    context.to_mongo.close
    session[:context] = context
    render :json => {:databases => context.database_names.sort, :host => context.host, :port => context.port}
  end
  
  def noop
    render :json => {:ok => true}
  end
    
  def use
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
  
  def list_databases
    render :json => @context.database_names
  end
  
  def collections
    render :json => @context.collection_names
  end
  
  def stats
    render :json => @context.to_database.stats(); 
  end
  
  def get_last_error
    render :json => @context.to_database.get_last_error
  end
  
end