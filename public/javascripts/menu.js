var menu = 
{
  logout: 
  {
    clicked: function() { executor.rawExecute('quit();'); }
  },
  about:
  {
    clicked: function() { $.dialog.load('/home/about'); }
  },
  info:
  {
    show: function() { $.dialog.load('/ui/connect', null, menu.info.showing); },
    showing: function($html)
    {
      var $form = $html.find('form').submit(function()
      {
        var host = $form.find('input[name=host]').val();
        var port = $form.find('input[name=port]').val();
        $.dialog.close();
        executor.rawExecute('connect("' + host + '",' + port + ');');
        return false;
      });
    },
    context: function(type, context)
    {
      var text = context.host ? context.host + ':' + context.port : 'click here to connect';
      $('#info').text(text);
    }
  },
  database:
  {
    change: function()
    {
      var value = $(this).val();
      if (!value){return;}
      executor.rawExecute('use ' + value + ';');
    },
    context: function(type, context)
    {
      if (type != 'new') { return; } 

      var $database = $('#database');
      $database.children().remove();
      if (!context.databases || context.databases.length == 0) 
      { 
        $database.hide(); 
        return; 
      }

      $database.append($('<option>').attr('value', '').text('select a database'));
      for(var i = 0; i < context.databases.length; ++i)
      {
        $database.append($('<option>').text(context.databases[i]));
      }
      $database.show();
    }
  }
};
context.register(menu.info.context);
context.register(menu.database.context);