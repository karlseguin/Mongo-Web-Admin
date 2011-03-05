(function($) {
  $.fn.resultGrid = function(options) 
  {
    if(options.command == 'draw')
    {
      return this.each(function() { this.resultGrid.draw(options.parameters, options.data); });
    }
    if (options.command == 'page')
    {
      return this.each(function() { this.resultGrid.page(options.to); });
    }
    return this.each(function() 
    {
      if (this.resultGrid) { return false; }
      var headers, parameters, pager = null;
      var table = this;
      var $table = $(this);
      var zindex;
      var self =
      {
        initialize: function() 
        {
          self.reset();
          $(window).keydown(self.keystroke);
        },
        reset: function()
        {
           //setitng this on the table doesn't work after the 2nd load, weird...
           $('#results').undelegate('tbody td div', 'dblclick');
           $('#results').delegate('tbody td div', 'dblclick', self.clicked);
           headers = {};
           parameters = {};
        },
        clicked: function(e)
        {
          var $div = $(this);
          if ($div.is(':not(.expanded)'))
          {
            var tableOffset = $table.offset();
            var offset = $div.parent().offset();      
            $div.addClass('expanded').css({top: offset.top-tableOffset.top-6, left: offset.left-tableOffset.left-1});
          }
          $div.css({zIndex: zindex++});
          return false;
        },
        keystroke: function(e)
        {
          if (e.which == 27)
          {
             $table.find('div.expanded').removeClass('expanded');
             zindex = 1;
          }
          return true;
        },
        draw: function(params, data)
        {
          if (!self.useExisting(params)) { self.reset(); }
          zindex = 1;
          $table.empty();
          parameters = params;
          self.loadHeaders(data.documents);
          self.loadData(data.documents);
          self.loadPager(data.count, data.documents.length, data.limit, params ? params.skip : 0);
        },
        useExisting: function(params)
        {
          if ($.resultGrid.same(headers, {})) { return true; }
          return params != null && parameters != null
                  && params.collection == parameters.collection 
                  && $.resultGrid.same(params.selector, parameters.selector)
                  && $.resultGrid.same(params.fields, parameters.fields);
        },
        loadHeaders: function(documents)
        {
          var length = documents.length;
          for(var i = 0; i < length; ++i)
          {
            for(var column in documents[i])  { headers[column] = 1; }
          }          
        },
        loadData: function(documents)
        {
          var idFirst = headers['_id'] == 1;
          var length = documents.length;
          for(var i = 0; i < length; ++i)
          {
            var row = table.insertRow(-1);
            if (idFirst) { self.createCell(row, renderer.getValue(documents[i]['_id']));}
            for(var header in headers)
            {
              if (header == '_id') { continue; }
              self.createCell(row, renderer.getValue(documents[i][header]));
            }
          }
          var thead = table.createTHead();
          var row = thead.insertRow(0);
          if (idFirst) { self.createCell(row, '_id');}
          for(var header in headers)
          {
            if (header == '_id') { continue; }
            self.createCell(row, header);
          }
        },
        createCell: function(row, value)
        {
          var cell = row.insertCell(-1);
          cell.innerHTML = '<div>' + value + '</div>';
        },
        loadPager: function(count, length, limit, skip)
        {
          if (isNaN(skip)) { skip = 0; }
          $('#pager').pager({command: 'refresh', data: [count, length, limit, skip]});
        },
        page: function(to)
        {
          var command = 'db.' + parameters.collection + '.find(';
          if (parameters.selector || parameters.fields)
          {
            command += parameters.selector ? JSON.stringify(parameters.selector) : '{}';
          }
          if (parameters.fields)
          {
            command += ', ' + JSON.stringify(parameters.fields);
          }
          command += ')';
          
          if (to)
          {
            command += '.skip(' + to + ')';
          }
          if (parameters.limit)
          {
            command += '.limit(' + parameters.limit + ')'
          }
          if (parameters.sort)
          {
            command += '.sort(' + JSON.stringify(parameters.sort) + ')';
          }
          command += ';';
          
          executor.rawExecute(command);
        }
      };
      this.resultGrid = self;
      self.initialize();
    });
  };
})(jQuery);

$.resultGrid = 
{
  display: function(data, parameters)
  {
    if (!$.isArray(data.documents) )
    {
      data.documents = [data.documents];
    }
    var $grid = $('#grid');
    if ($grid.length == 0)
    {
      $grid = $('<table id="grid">').resultGrid({});
    }
    $grid.resultGrid({command: 'draw', parameters: parameters, data: data});
    return $grid;
  },
  same: function(left, right) //doesn't belong here!
  {
    if (!right) { return false; }
    for(var p in left)
    {
      if (left[p] != right[p]) { return false; }
    }
    return true;
  }
};