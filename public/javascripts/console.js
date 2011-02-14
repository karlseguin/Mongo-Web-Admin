$(document).ready(function()
{
  var $history = $('#history');
  var $input = $('#input').commandInput({trigger: executor.execute, history: $history});
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
    executor.rawExecute('db.' + $(this).text() + '.info();');
  }
}
context.register(explorer.collections.context)