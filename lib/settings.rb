class Settings 
  @@settings = File.exists?(Rails.root + 'config/config.yml') ? YAML::load_file(Rails.root + 'config/config.yml') : Hash.new
  
  def self.local_only?
    @@settings.has_key?('local_only') ? @@settings['local_only'] : ENV['LOCAL_ONLY'] || true
  end  
  def self.auto_connect
    @@settings['auto_connect'] || ENV['MONGO_URL']
  end
  def self.databases
    @@settings['databases'] || ENV['MONGO_DATABASES']
  end
end