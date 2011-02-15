var db = 
{
  __context: function(type, context)
  {
    if (type == 'new') { db.__clear(); return }
    if (type != 'database') { return; }
    db.__clear();
    if (context.collections == null) { return; }
    for(var i = 0; i < context.collections.length; ++i)
    {
      db[context.collections[i]] = new collection(context.collections[i]);
    }
  },
  __clear: function()
  {
    for(var property in db)
    {
      if (typeof db[property] == 'object') { delete db[property]; }
    }
  },
  getCollectionNames: function()
  {
    return new function()
    {
      this.mongo_serialize = function() { return {endpoint: 'database', command: 'collections'} };
      this.response = function(collections) { return renderer.simpleList(collections); }
    };
  },
  stats: function()
  {
    return new function()
    {
      this.mongo_serialize = function() { return {endpoint: 'database', command: 'stats'} };
      this.response = function(r) { return renderer.generic(r); };
    };    
  },
  getLastError: function()
  {
    return new function()
    {
      this.mongo_serialize = function() { return {endpoint: 'database', command: 'get_last_error'} };
      this.response = function(r) { return renderer.generic(r); };
    };    
  },
  listDatabases: function()
  {
    return new function()
    {
      this.mongo_serialize = function() { return {endpoint: 'database', command: 'list_databases'} };
      this.response = function(databases) { return renderer.simpleList(databases); }
    };    
  }
};

context.register(db.__context)

function collection(name)
{
  this._name = name;
  this.find = function(selector, fields)
  {
    return new collection_find(selector, fields, this);
  };
  this.count = function(selector)
  {
    return new collection_count(selector, this);
  };
  this.stats = function()
  {
    return new collection_stats(this);
  }
  this.getIndexes = function()
  {
    return new collection_getIndexes(this);
  }
};

function collection_find(selector, fields, collection)
{
  this._selector = selector;
  this._fields = fields;
  this._collection = collection;
  
  this.limit = function(limit)
  {
    this._limit = limit;
    return this;
  };
  
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'find', collection: this._collection._name, selector: this._selector, fields: this._fields, limit: this._limit};
  };
  this.response = function(r) { return renderer.generic(r); };
};

function collection_count(selector, collection)
{
  this._selector = selector;
  this._collection = collection;

  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'count', collection: this._collection._name, selector: this._selector};
  };

  this.response = function(r, command)
  {
    var document = r.count == 1 ? ' document' : ' documents';
    return r.count + document + ' in ' + this._collection._name;
  };
};

function collection_stats(collection)
{
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'stats', collection: this._collection._name};
  };
  this.response = function(r) { return renderer.generic(r); };
};

function collection_getIndexes(collection)
{
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'get_indexes', collection: this._collection._name};
  };
  this.response = function(r) { return renderer.generic(r); }; 
};
