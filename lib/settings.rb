class Settings 
  @@settings = File.exists?(Rails.root + 'config/config.yml') ? YAML::load_file(Rails.root + 'config/config.yml') : Hash.new
  
  def self.local_only?
    if @@settings.has_key?('local_only') 
      return @@settings['local_only']
    end
    if ENV.has_key?('LOCAL_ONLY')
      return ENV['LOCAL_ONLY'] != 'false'
    end
    return true
  end  
  def self.auto_connect
    @@settings['auto_connect'] || ENV['MONGO_URL']
  end
  def self.databases
    @@settings['databases'] || ENV['MONGO_DATABASES']
  end
end