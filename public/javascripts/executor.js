var executor = 
{
  rawExecute: function(command)
  {
    $('#input').val(command).trigger('trigger');
  },
  execute: function(text)
  {
    var command = executor.special[text];
    try { command = eval(text); }
    catch(error) {  }
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
  }
};
executor.special = 
{
  'quit();': executor.quit,
  'show dbs;': executor.showDbs,
  'show collections;': executor.showCollections,
  'db.getCollectionNames();': executor.showCollections,
};