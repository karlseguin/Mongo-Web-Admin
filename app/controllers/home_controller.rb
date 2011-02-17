class HomeController < ApplicationController
  def index
    unless Settings.auto_connect.nil?
      @context = Context.new(Settings.auto_connect)
      session[:context] = @context
    end
    if @context.nil? then
      @context = Context.new({:port => 0})
      @databases = 'null'
    else
      mongo = @context.to_mongo
      @databases = @context.database_names.to_json
   end
  end
  def about
  end
end