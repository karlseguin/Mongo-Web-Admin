$(document).ready(function()
{
  var $history = $('#history');
  var $input = $('#input').commandInput({trigger: execute, history: $history});
  var $history = $history.inputHistory({target: $input});
  $('#collections').delegate('li', 'click', explorer.collections.clicked);
  $(window).resize(setHeight);
  setHeight();
  
  function setHeight()
  {
    var height = $(window).height() - $('#menu').height() - $input.height() - 30;
    $('#explorer').height(height);
    $input.width($history.width()-20);
  };
});

function execute(text)
{
  var command = {}
  try { command = eval(text); }
  catch(error) { }
  
  if (!command.mongo_serialize)
  {
    $('#history').inputHistory({command: 'add', type: 'error', text: text})
    return;
  }
  var start = new Date();
  var parameters = command.mongo_serialize();
  $.get('/collection/' + parameters['command'], parameters, function(r){executed('ok', command.response(r), start);}, 'json')
    .error(function(r){executed('error', r.responseText, start);});
  return true;
};

function executed(status, value, start)
{
  var $input = $('#input');
  var text = $input.val();  
  $input.commandInput({command: 'unlock'});
  $('#history').inputHistory({command: 'add', type: status, text: text, time: new Date() - start + ' ms'});
  $('#results').html(value);
}



var explorer = {};
explorer.collections = 
{
  context: function(type, context)
  {
    var $collections = $('#collections');
    if (type == 'new') { $collections.hide(); return; }
    if (type != 'database' || !context.collections) { return; }
    
    var $ul = $collections.find('ul');
    $ul.children().remove();
    for (var i = 0; i < context.collections.length; ++i)
    {
      $ul.append($('<li>').text(context.collections[i]));
    }
    $collections.show();
  },
  clicked: function()
  {
    $('#input').val('db.' + $(this).text() + '.info();').trigger('trigger');
  }
}
context.register(explorer.collections.context)