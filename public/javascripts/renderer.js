var renderer =
{
  generic: function(data)
  {
    if (!$.isArray(data)) { data = [data]; }
    
    var headers = {};
    for(var i = 0; i < data.length; ++i)
    {
      for(var column in data[i])  { headers[column] = 1; }
    }
    
    var table = document.createElement('table');
    table.id = 'list';
    for(var i = 0; i < data.length; ++i)
    {
      var row = table.insertRow(-1);
      for(var header in headers)
      {
        var cell = row.insertCell(-1);
        cell.innerHTML = '<div>' + renderer.getValue(data[i][header]) + '</div>';
      }
    }
    var thead = table.createTHead();
    var row = thead.insertRow(0);
    for(var header in headers)
    {
      var cell = row.insertCell(-1);
      cell.innerHTML = '<div>' + header + '</div>';
    }
    return table;
  },
  getValue: function(object)
  {
    if (!object) { return '';}
    if (object && typeof object == 'object') 
    { 
      if (object['$oid']) { return object['$oid']; }
      return JSON.stringify(object);      
    }
    return object;
  },
  simpleList: function(items)
  {
    var html = '';
    for(var i = 0; i < items.length; ++i) { html += '<p>' + items[i] + '</p>'; }
    return renderer.single(html);
  },
  single: function(html)
  {
    return '<div id="single">' + html + '</div>'; 
  }
};