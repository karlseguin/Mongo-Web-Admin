$(document).ready(function()
{
  var $history = $('#history');
  var $input = $('#input').commandInput({trigger: executor.execute, history: $history});
  var $history = $history.inputHistory({target: $input});
  $('#collections').delegate('li', 'click', explorer.collections.clicked);
  
  var zindex = 0;
  $('#results').delegate('#list td div', 'dblclick', function(e)
  {      
     var $div = $(this);
     if ($div.is('.expanded'))
     {
        $div.css({zIndex: zindex++});
        return false;
     }
     var offset = $div.parent().offset();      
     $div.addClass('expanded').css({top: offset.top-8, left: offset.left-1, zIndex: zindex++});
     return false;
  });
  
  $(window).keydown(function(e)
  {
     if (e.which == 27)
     {
        $('div.expanded').removeClass('expanded');
        zindex = 1;
     }
     return true;
  }).resize(setHeight);
  
  setHeight();
  function setHeight()
  {
    var height = $(window).height() - $('#menu').height() - $input.height() - 30;
    $('#explorer').height(height);
    $('#results').height(height - $('#history').height()-10);
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
    executor.rawExecute('db.' + $(this).text() + '.stats();');
  }
}
context.register(explorer.collections.context)