$(document).ready(function()
{
  $('#menu ul li:first').css('border-left', '2px solid #ddd');
  $('#database').change(menu.database.change).val(context.database);
  $('#logoutLink').click(menu.logout.clicked);
  $('#aboutLink').click(menu.about.clicked);
  $('#info').click(menu.info.show)
});
var menu = {};
menu.logout =
{
  clicked: function()
  {
    executor.rawExecute('quit();');
  }
};

menu.about =
{
  clicked: function()
  {
    $.dialog.load('/home/about');
  }
};
menu.info = 
{
  show: function()
   {
     $.dialog.load('/home/connect', null, menu.info.showing);
   },
   showing: function($html)
   {
     var $form = $html.find('form').submit(function()
     {
       $.post('/home/connecting', $form.serialize(), menu.info.success, 'json').error(menu.info.error)
       return false;
     });
   },
   success: function(r)
   {
     context.new(r.host, r.port, r.databases);
     $.dialog.close();
   },
   error: function(r)
   {
     context.new(null, null, null);
     alert('Failed to connect: ' + r.responseText);
   },
   context: function(type, context)
   {
     var text = context.host ? context.host + ':' + context.port : 'click here to connect';
     $('#info').text(text);
   }
};
context.register(menu.info.context);

menu.database = 
{
  change: function()
  {
    var value = $(this).val();
    if (!value){return;}
    $.get('/database/use', {name: value}, menu.database.changed, 'json');
  },
  changed: function(r)
  {
    context.select(r.name, r.collections)
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
};
context.register(menu.database.context);