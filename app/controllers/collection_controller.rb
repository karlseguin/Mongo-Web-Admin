class CollectionController < ApplicationController
  before_filter :before_write, :except => [:find, :count, :stats, :get_indexes]
  def find
    collection = @context.to_collection(params[:collection])
  
    selector = params[:selector]
    selector = {} if selector.blank? || !selector.is_a?(Hash)
    
    options = {}
    options[:fields] = params[:fields] if params[:fields]
    options[:sort] = build_sort(params[:sort]) if params[:sort]
    options[:limit] = params[:limit].to_i == 0 ? 200 : params[:limit].to_i
    options[:skip] = params[:skip].to_i if params[:skip].to_i != 0

    finder = collection.find(selector, options)
    render :json => {:documents => finder, :count => finder.count, :limit => options[:limit] || 200}
  end
  def count
    collection = @context.to_collection(params[:collection])
    selector = params[:selector]   
    selector = {} if selector.blank? || !selector.is_a?(Hash)
    render :json => {:count => collection.find(selector).count }
  end
  def stats
    render :json => @context.to_collection(params[:collection]).stats
  end
  def get_indexes
    render :json => @context.to_collection(params[:collection]).index_information
  end
  
  def ensure_index
    return missing_parameter(:fields) if params[:fields].blank?
    
    options = {}
    options[:unique] = params[:unique] if params[:unique]
    @context.to_collection(params[:collection]).ensure_index(params[:fields].to_a, options)
    render :json => {:ok => true}
  end
  
  def drop_indexes
    @context.to_collection(params[:collection]).drop_indexes
    render :json => {:ok => true}
  end
  
  def drop_index
    render :text => 'this is not working yet...', :status => 500
    # return missing_parameter(:fields) if params[:fields].blank?
    # p params[:fields]
    # @context.to_collection(params[:collection]).drop_index(params[:fields])
    # render :json => {:ok => true}
  end
  
  def remove
    selector = params[:selector]
    selector = {} if selector.blank? || !selector.is_a?(Hash)
    collection = @context.to_collection(params[:collection])
    count = collection.find(selector).count
    collection.remove(selector)
    render :json => {:count => count}
  end
  
  def update
    return missing_parameter(:values) if params[:values].blank?
    
    selector = params[:selector]
    selector = {} if selector.blank? || !selector.is_a?(Hash)
    collection = @context.to_collection(params[:collection])
    count = collection.find(selector).count
    options = {:safe => true, :upsert => params[:upsert] || false, :multi => params[:multiple] || false}
    collection.update(selector, params[:values], options)
    render :json => {:count => count == 0 ? 0 : params[:multiple] ? count : 1}
  end
  
  def insert
    id = @context.to_collection(params[:collection]).insert(params[:object], {:safe => true})
    render :json => id
  end
  
  private
  def build_sort(raw)
    raw.map{|k, v| [k, v == '1' ? :ascending : :descending]}
  end
end