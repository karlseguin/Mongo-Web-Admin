var renderer =
{
  simpleList: function(items)
  {
    var html = '';
    for(var i = 0; i < items.length; ++i) { html += '<p>' + renderer.getValue(items[i]) + '</p>'; }
    return renderer.single(html);
  },
  single: function(html)
  {
    return '<div id="single">' + html + '</div>'; 
  },
  count: function(r)
  {
    var document = r.count == 1 ? ' document' : ' documents';
    return renderer.single(r.count + document + ' were affected');
  },
  ok: function()
  {
    return renderer.single('the command completed successfully');
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
};