var executor = 
{
  invalid: {},
  rawExecute: function(command)
  {
    $('#input').val(command).trigger('trigger');
  },
  execute: function(text)
  {
    var command = executor.getCommand(text);
    if (command == executor.invalid)
    {
      $('#history').inputHistory({command: 'add', type: 'error', text: text})
      return;
    }
    if (!command || !command.mongo_serialize)
    {
      $('#history').inputHistory({command: 'add', type: 'ok', text: text})
      return;      
    }
    var parameters = command.mongo_serialize();
    parameters['authenticity_token'] = authenticity_token;
    var start = new Date();
    $.ajax(
    {
      url: '/' + parameters['endpoint'] + '/' + parameters['command'],
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(parameters),
      dataType: 'json',
      success: function(r)
      {
        executor.executed('ok', command.response(r), start);
      },
      error: function(r)
      {
        executor.executed('error', renderer.single(r.responseText), start);
      },
    });
    return true;
  },
  getCommand: function(text)
  {
    for(var i = 0; i < executor.specials.length; ++i)
    {
      var matches = executor.specials[i].exec(text);
      if (matches != null)
      {
        var callback =  executor.callbacks[i];
        return (callback.loadParams) ? callback.loadParams(matches) : callback;
      }
    }
    try {  with(window){ return eval(text)}; }
    catch(error) { return executor.invalid;  }
  },
  
  executed: function(status, value, start)
  {
    var $input = $('#input');
    var text = $input.val();  
    $input.commandInput({command: 'unlock'});
    $('#history').inputHistory({command: 'add', type: status, text: text, time: new Date() - start + ' ms'});
    if (!(value instanceof jQuery) || !value.is('#grid'))
    {
      $('#pager').hide(); 
    }
    $('#results').html(value);
    $('#input').focus();
  },
  
  quit:
  {
    mongo_serialize: function() { return {endpoint: 'database', command: 'quit'} },
    response: function(r) { context.erase();}
  },
  useDb:
  {
    loadParams: function(params)
    {
      this._name = params[1];
      return this;
    },
    mongo_serialize: function(name) { return {endpoint: 'database', command: 'use', name: this._name } },
    response: function(r)
    {
      context.select(r.name, r.collections)
      $('#database').val(r.name);
    }  
  },
  connect:
  {
    loadParams: function(params)
    {
      this._host = params[1];
      this._port = params[3];
      return this;
    },
    mongo_serialize: function() { return {endpoint: 'database', command: 'connect', host: this._host, port: this._port} },
    response: function(r) { context.initialize(r.host, r.port, r.databases);}
  },
  clear:
  {
    mongo_serialize: function() {return {endpoint: 'database', command: 'noop' } },
    response: function(r) { return '';}
  },
};
executor.specials = [/clear\(\);/, /quit\(\);/, /show dbs;/, /show collections;/, /use (\w+);/, /connect\(\s*['"](.*?)["'](\s*,\s*(\d*))?\s*\);/]; 
executor.callbacks = [executor.clear, executor.quit, db.listDatabases(), db.getCollectionNames(), executor.useDb, executor.connect];