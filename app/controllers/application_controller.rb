class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :ensure_local, :load_context
  rescue_from StandardError, :with => :handle_error

  def handle_error(exception)
    render :text => exception.message, :status => 500
  end
  
  def ensure_local
    if Settings.local_only? && !request.local?
      render :text => 'request must be local', :status => 400
    end
  end
  
  def load_context
    @context = session[:context]
  end
  
end
