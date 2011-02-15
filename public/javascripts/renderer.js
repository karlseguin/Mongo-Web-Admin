var renderer =
{
  generic: function(data)
  {
    if (!$.isArray(data)) { data = [data]; }
    
    var table = document.createElement('table');
    var headers = {};
    for(var i = 0; i < data.length; ++i)
    {
      var row = data[i];
      for(var column in row) 
      {
        headers[column] = 1;
      }
    }
    console.log(headers);
  },
  simpleList: function(items)
  {
    var html = '';
    for(var i = 0; i < items.length; ++i) { html += '<p>' + items[i] + '</p>'; }
    return html;
  }
  
};