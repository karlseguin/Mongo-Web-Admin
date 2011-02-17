class Settings 
  @@settings = YAML::load_file(Rails.root + 'config/config.yml') || Hash.new
  
  def self.local_only?
    @@settings.has_key?('local_only') ? @@settings['local_only'] : true
  end  
  def self.auto_connect
    @@settings['auto_connect']
  end
  def self.databases
    @@settings['databases']
  end
end