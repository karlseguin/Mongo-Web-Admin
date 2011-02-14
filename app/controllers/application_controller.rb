class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :ensure_local, :load_context
  
  def ensure_local
    render :text => 'request must be local', :status => 400 unless request.local?
  end
  
  def load_context
    @context = session[:context]
  end
  
end
