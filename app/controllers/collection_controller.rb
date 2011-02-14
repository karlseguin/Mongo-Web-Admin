class CollectionController < ApplicationController
  def find
    db = session[:context].to_database
    collection = db.collection(params[:collection])
    render :json => collection.find
  end
  def count
    db = session[:context].to_database
    collection = db.collection(params[:collection])
    render :json => {:count => collection.find(params[:selector] || {}).count }
  end
  def info
    render :json => {:ok => true}
  end
end