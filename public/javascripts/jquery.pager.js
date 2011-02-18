(function($) {
  $.fn.pager = function(options) 
  {
    if (options.command == 'refresh')
    {
      return this.each(function() { this.pager.refresh(options.data); });
    }
    return this.each(function() 
    {
      if (this.pager) { return false; }
      var $pager = $(this);
      var data = null;
      var self =
      {
        initialize: function() 
        {
          $('#first').click(self.first);
          $('#prev').click(self.prev);
          $('#next').click(self.next);
          $('#last').click(self.last);
        },
        refresh: function(d) //an array? lame
        {
          var count = d[0];
          var length = d[1];
          if (!count || count <= length) { $pager.hide(); return; }

          $pager.show();
          var limit = d[2];
          var skip = d[3];
          var last = (Math.ceil(count / limit)-1) * limit;

          if (skip == 0) { $('#first, #prev').hide(); } else { $('#first, #prev').show(); }
          if (skip >= last) { $('#next, #last').hide(); } else { $('#next, #last').show(); }
          
          data = {count: count, limit: limit, current: skip, last: last};
        },
        first: function()
        {
          self.gridTo(0);
        },
        prev: function()
        {
          self.gridTo(data.current - data.limit);
        },
        next: function()
        {
          self.gridTo(data.current + data.limit);
        },
        last: function()
        {
          self.gridTo(data.last);
        },
        gridTo: function(to)
        {
          $('#grid').resultGrid({command: 'page', to: to});
        }
      };
      this.pager = self;
      self.initialize();
    });
  };
})(jQuery);