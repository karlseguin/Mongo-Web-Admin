class Settings 
  @@settings = File.exists?(Rails.root + 'config/config.yml') ? YAML::load_file(Rails.root + 'config/config.yml') : Hash.new
  
  def self.local_only?
    self.bool_lookup('local_only', true)
  end
  def self.auto_connect
    @@settings['auto_connect'] || ENV['MONGO_URL']
  end
  def self.databases
    if @@settings.has_key?('databases') 
      return @@settings['databases']
    end
    if ENV.has_key?('MONGO_DATABASES')
      return ENV['MONGO_DATABASES'].split(',')
    end
  end
  def self.allow_writes?
    self.bool_lookup('allow_writes', false)
  end
  def self.bool_lookup(key, default)
    return @@settings[key] if @@settings.has_key?(key) 
    return ENV[key.upcase] != 'false' if ENV.has_key?(key.upcase)
    return default
  end
end