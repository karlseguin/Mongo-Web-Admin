class DatabaseController < ApplicationController
  def connect
    connection = Connection.new({:host => params[:host], :port => params[:port] || 27017})
    begin
      conn = Mongo::Connection.new(connection.host, connection.port)
      context = Context.new({:host => connection.host, :port => connection.port})
      session[:context] = context
    rescue Exception => e
      render :text => e.message, :status => 500 and return
    end
    render :json => {:databases => context.database_names.sort, :host => connection.host, :port => connection.port}
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