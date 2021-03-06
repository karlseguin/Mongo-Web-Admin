function ObjectId(value)
{
  return {$oid: value};
};
Date.prototype.to_mongo = function()
{
  return {$date: this.getTime()/1000};
}

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
      this.response = function(r) { return $.resultGrid.display({documents: r}, null); };
    };    
  },
  getLastError: function()
  {
    return new function()
    {
      this.mongo_serialize = function() { return {endpoint: 'database', command: 'get_last_error'} };
      this.response = function(r) { return $.resultGrid.display({documents: r}, null); };
    };    
  },
  listDatabases: function()
  {
    return new function()
    {
      this.mongo_serialize = function() { return {endpoint: 'database', command: 'list_databases'} };
      this.response = function(databases) { return renderer.simpleList(databases); }
    };    
  },
  toSelector: function(selector)
  {
    for(var property in selector)
    {
      if (selector.hasOwnProperty(property))
      {
        var value = selector[property];
        if (value.to_mongo)
        {
          selector[property] = value.to_mongo();
        }
        else if (typeof value == 'object')
        {
          db.toSelector(value);
        }
      }
    }
    return selector;
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
  };
  this.getIndexes = function()
  {
    return new collection_getIndexes(this);
  };
  this.ensureIndex = function(fields, options)
  {
    return new collection_ensureIndex(fields, options, this);
  };
  this.dropIndex = function(fields)
  {
    return new collection_dropIndex(fields, this);
  };
  this.dropIndexes = function()
  {
    return new collection_dropIndexes(this);
  };
  this.remove = function(selector)
  {
    return new collection_remove(selector, this);
  };
  this.update = function(selector, values, upsert, multiple)
  {
    return new collection_update(selector, values, upsert, multiple, this);
  };
  this.insert = function(object)
  {
    return new collection_insert(object, this);
  };
  this.distinct = function(field, query)
  {
    return new collection_distinct(field, query, this);
  };
};

function collection_find(selector, fields, collection)
{
  this._selector = selector;
  this._fields = fields;
  this._collection = collection;
  this._explain = false;
  
  this.limit = function(limit)
  {
    this._limit = limit;
    return this;
  };
  this.sort = function(sort)
  {
    this._sort = sort;
    return this;
  };
  this.skip = function(skip)
  {
    this._skip = skip;
    return this;
  };
  this.explain = function()
  {
    this._explain = true;
    return this;
  };
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'find', collection: this._collection._name, selector: db.toSelector(this._selector), fields: this._fields, limit: this._limit, sort: this._sort, skip: this._skip, explain: this._explain};
  };
  this.response = function(r) { return $.resultGrid.display(r, this.mongo_serialize()); };
};

function collection_count(selector, collection)
{
  this._selector = selector;
  this._collection = collection;

  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'count', collection: this._collection._name, selector: db.toSelector(this._selector)};
  };

  this.response = function(r, command)
  {
    var document = r.count == 1 ? ' document' : ' documents';
    return renderer.single(r.count + document + ' in ' + this._collection._name);
  };
};

function collection_stats(collection)
{
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'stats', collection: this._collection._name};
  };
  this.response = function(r) { return $.resultGrid.display({documents: r}, null); };
};

function collection_getIndexes(collection)
{
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'get_indexes', collection: this._collection._name};
  };
  this.response = function(r) { return $.resultGrid.display({documents: r}, null); }; 
};

function collection_ensureIndex(fields, options, collection)
{
  this._fields = fields;
  this._options = options;
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'ensure_index', collection: this._collection._name, fields: this._fields, options: this._options};
  };
  this.response = function(r) { return renderer.ok(); }; 
};

function collection_dropIndex(fields, collection)
{
  this._fields = fields;
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'drop_index', collection: this._collection._name, fields: this._fields};
  };
  this.response = function(r) { return renderer.ok(); }; 
};

function collection_dropIndexes(collection)
{
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'drop_indexes', collection: this._collection._name};
  };
  this.response = function(r) { return renderer.ok(); }; 
};

function collection_remove(selector, collection)
{
  this._selector = selector;
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'remove', selector: db.toSelector(this._selector), collection: this._collection._name};
  };
  this.response = function(r) { return renderer.count(r); }; 
};

function collection_update(selector, values, upsert, multiple, collection)
{
  this._selector = selector;
  this._values = values;
  this._upsert = upsert;
  this._multiple = multiple;
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'update', selector: db.toSelector(this._selector), values: db.toSelector(this._values), upsert: this._upsert, multiple: this._multiple, collection: this._collection._name};
  };
  this.response = function(r) { return renderer.count(r); };
};

function collection_insert(object, collection)
{
  this._object = object;
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'insert', object: db.toSelector(this._object), collection: this._collection._name};
  };
  this.response = function(r) 
  { 
    if (!$.isArray(r)) { r = [r]; }
    var isOrAre = r.length == 1 ? ' is' : ' are';
    var ids = ''
    for(var i = 0; i < r.length; ++i)
    {
      ids += r[i]['$oid'] + ', ';
    }
    ids = ids.substring(0, ids.length - 2);
    return renderer.single('insert successful, the id' + isOrAre + ': ' + ids); 
  };
};

function collection_distinct(field, query, collection)
{
  this._field = field;
  this._query = query;
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collection', command: 'distinct', field: this._field, query: this._query, collection: this._collection._name};
  };
  this.response = function(values) { return renderer.simpleList(values); };
};