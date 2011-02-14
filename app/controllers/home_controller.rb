class HomeController < ApplicationController
  def index
    if @context.nil? then
      @context = Context.new({:port => 0})
      @databases = 'null'
    else
      mongo = @context.to_mongo
      @databases = @context.database_names.to_json
   end
  end
  
  def connect
    render :layout => false
  end
  
  def about
    render :layout => false
  end
  
  def connecting
    connection = Connection.new(params[:connection])
    begin
      conn = Mongo::Connection.new(connection.host, connection.port)
      context = Context.new({:host => connection.host, :port => connection.port})
      session[:context] = context
    rescue Exception => e
      render :text => e.message, :status => 500
    end
    render :json => {:databases => context.database_names.sort, :host => connection.host, :port => connection.port}
  end
end