var executor = 
{
  rawExecute: function(command)
  {
    $('#input').val(command).trigger('trigger');
  },
  execute: function(text)
  {
    var command = executor.getCommand(text);
    if (!command || !command.mongo_serialize)
    {
      $('#history').inputHistory({command: 'add', type: 'error', text: text})
      return;
    }
    var start = new Date();
    var parameters = command.mongo_serialize();
    $.get('/' + parameters['endpoint'] + '/' + parameters['command'], parameters, function(r){executor.executed('ok', command.response(r), start);}, 'json')
      .error(function(r){executor.executed('error', r.responseText, start);});
    return true;
  },
  getCommand: function(text)
  {
    for(var i = 0; i < executor.specials.length; ++i)
    {
      var matches = executor.specials[i].exec(text);
      if (matches != null)
      {
        return executor.callbacks[i].with(matches);
      }
    }
    try { return eval(text); }
    catch(error) { return null;  }
  },
  
  executed: function(status, value, start)
  {
    var $input = $('#input');
    var text = $input.val();  
    $input.commandInput({command: 'unlock'});
    $('#history').inputHistory({command: 'add', type: status, text: text, time: new Date() - start + ' ms'});
    $('#results').html(value);
  },
  
  quit:
  {
    with: function(params){return this;},
    mongo_serialize: function()
    {
      return {endpoint: 'database', command: 'quit'}
    },
    response: function(r)
    {
      context.erase();
    }
  },
  showDbs:
  {
    with: function(params){return this;},
    mongo_serialize: function()
    {
      return {endpoint: 'database', command: 'list'}
    },
    response: function(databases)
    {
      var html = '';
      for(var i = 0; i < databases.length; ++i) { html += '<p>' + databases[i] + '</p>'; }
      return html;
    }  
  },
  showCollections:
  {
    with: function(params){return this;},
    mongo_serialize: function()
    {
      return {endpoint: 'database', command: 'collections'}
    },
    response: function(collections)
    {
      var html = '';
      for(var i = 0; i < collections.length; ++i) { html += '<p>' + collections[i] + '</p>'; }
      return html;
    }  
  },
  useDb:
  {
    with: function(params)
    {
      this._name = params[1];
      return this;
    },
    mongo_serialize: function(name)
    {
      return {endpoint: 'database', command: 'use', name: this._name }
    },
    response: function(r)
    {
      context.select(r.name, r.collections)
      $('#database').val(r.name);
    }  
  }
};
executor.specials = [/quit\(\);/, /show dbs;/, /show collections;/, /db.getCollectionNames\(\);/, /use (\w+);/]; 
executor.callbacks = [executor.quit, executor.showDbs, executor.showCollections, executor.showCollections, executor.useDb];