class CollectionController < ApplicationController
  def find
    db = @context.to_database
    collection = db.collection(params[:collection])
    render :json => collection.find
  end
  def count
    db = @context.to_database
    collection = db.collection(params[:collection])
    render :json => {:count => collection.find(params[:selector] || {}).count }
  end
  def stats
    render :json => @context.to_database.collection(params[:collection]).stats
  end
  def get_indexes
    render :json => @context.to_database.collection(params[:collection]).index_information
  end
end