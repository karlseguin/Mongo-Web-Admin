var context = 
{
  _listeners: [],
  initialize: function(host, port, databases)
  {
    this.host = host;
    this.port = port;
    this.databases = databases;
    this.trigger('new');
  },
  select: function(name, collections)
  {
    this.database = name;
    this.collections = collections;
    this.trigger('database');
  },
  register: function(callback)
  {
    this._listeners.push(callback);
  },
  trigger: function(event)
  {
    for(var i = 0; i < this._listeners.length; ++i)
    {
      this._listeners[i](event, this)
    }
  },
  erase: function()
  {
    this.host = null;
    this.port = null;
    this.databases = null;
    this.database = null;
    this.collections = null;
    this.trigger('new');
    this.trigger('database');
  }
};