class Compressor
  @@settings = YAML::load_file('config/assets.yml') 
  def self.get_javascript(name)
    @@settings['javascript'][name]
  end
  def self.get_css(name)
    @@settings['css'][name]
  end
end