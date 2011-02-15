module ApplicationHelper
  def include_js_bundle(name)
    if Rails.env.development?
      javascript_include_tag Compressor.get_javascript(name)
    else
      javascript_include_tag name
    end
  end
  
  def include_css_bundle(name)
    if Rails.env.development?
      stylesheet_link_tag Compressor.get_css(name)
    else
      stylesheet_link_tag name
    end
  end
end
