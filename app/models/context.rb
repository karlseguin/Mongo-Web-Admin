class Context
  attr_accessor :host, :port, :database, :user, :password
  
  def initialize(arg)
    if arg.is_a?String then
      info = Mongo::URIParser.new(arg)
      @host = info.nodes[0][0]
      @port = info.nodes[0][1]
      @user = info.auths[0]['username']
      @password = info.auths[0]['password']
      @database = info.auths[0]['db_name']
    else
      @host = arg[:host]
      @port = arg[:port]
      @database = arg[:database]
    end
  end
  
  def to_mongo    
    options = {}
    unless user.blank? || password.blank?
      options[:auths] = [{'db_name' => @database, 'username' => user, 'password' => password}]
    end
    Mongo::Connection.new(host, port, options)
  end
  
  def to_database
    to_mongo[database]
  end
  
  def to_collection(name)
    to_database.collection(name)
  end
  
  def database_names
    (Settings.databases || (to_mongo.database_names - ['local', 'admin'])).sort
  end

  def collection_names
    to_database.collection_names.select{|name| !name.starts_with?'system.'}
  end
end
