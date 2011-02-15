var renderer =
{
  //worst part of this system, must be fixed!
  generic: function(data)
  {
    if (!$.isArray(data)) { data = [data]; }
    
    var headers = {};
    for(var i = 0; i < data.length; ++i)
    {
      for(var column in data[i])  { headers[column] = 1; }
    }
    
    var table = document.createElement('table');
    for(var i = 0; i < data.length; ++i)
    {
      var row = table.insertRow();
      for(var header in headers)
      {
        var cell = row.insertCell(-1);
        cell.innerHTML = renderer.getValue(data[i][header]);
      }
    }
    var thead = table.createTHead();
    var row = thead.insertRow();
    for(var header in headers)
    {
      var cell = row.insertCell(-1);
      cell.innerHTML = header;
    }
    return table;
  },
  getValue: function(object)
  {
    if (object && typeof object == 'object') 
    { 
      if ($.isArray(object))
      {
        var string = '';
        $.each(object, function(i)
        {
          string += renderer.getValue(object[i]) + ',';
        });
        return string;
      }
      if (object['$oid']) { return object['$oid']; }
    }
    return object;
  },
  simpleList: function(items)
  {
    var html = '';
    for(var i = 0; i < items.length; ++i) { html += '<p>' + items[i] + '</p>'; }
    return html;
  }
  
};