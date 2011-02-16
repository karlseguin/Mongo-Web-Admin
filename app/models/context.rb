class Context
  attr_accessor :host, :port, :database
  
  def initialize(params = {})
    @host = params[:host]
    @port = params[:port]
    @database = params[:database]
  end
  
  def to_mongo    
#    Mongo::Connection.from_uri(ENV['MONGOHQ_URL'])
    Mongo::Connection.new(host, port)
  end
  
  def to_database
    to_mongo[database]
  end
  
  def database_names
    #['app444307']
    (to_mongo.database_names - ['local', 'admin']).sort
  end

  def collection_names
    to_database.collection_names.select{|name| !name.starts_with?'system.'}
  end
end
