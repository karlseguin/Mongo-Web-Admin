class CollectionController < ApplicationController
  before_filter :before_write, :except => [:find, :count, :stats, :get_indexes, :distinct]
  def find
    collection = @context.to_collection(params[:collection])
  
    selector = to_selector(params[:selector])
    
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
    selector = to_selector(params[:selector])
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
    selector = to_selector(params[:selector])
    collection = @context.to_collection(params[:collection])
    count = collection.find(selector).count
    collection.remove(selector)
    render :json => {:count => count}
  end
  
  def update
    return missing_parameter(:values) if params[:values].blank?
    
    selector = to_selector(params[:selector])
    values = to_selector(params[:values]) #this pretty much behaves like a selector as far as we are concerned

    collection = @context.to_collection(params[:collection])
    count = collection.find(selector).count
    options = {:safe => true, :upsert => params[:upsert] || false, :multi => params[:multiple] || false}
    collection.update(selector, values, options)
    render :json => {:count => count == 0 ? 0 : params[:multiple] ? count : 1}
  end
  
  def insert
    id = @context.to_collection(params[:collection]).insert(params[:object], {:safe => true})
    render :json => id
  end
  
  def distinct
    render :json => @context.to_collection(params[:collection]).distinct(params[:field], to_selector(params[:query]))
  end
  
  private
  def build_sort(raw)
    raw.map{|k, v| [k, v == '1' ? :ascending : :descending]}
  end
  def to_selector(raw)
    return {} if raw.blank? || !raw.is_a?(Hash)    
    raw.each do |key, value|
      if value.is_a?(Hash) && value.has_key?('$oid')
        raw[key] = BSON::ObjectId(value['$oid'])
      elsif value.is_a?(String) && BSON::ObjectId.legal?(value)
        raw[key] = BSON::ObjectId(value)
      end
    end
  end
  
end