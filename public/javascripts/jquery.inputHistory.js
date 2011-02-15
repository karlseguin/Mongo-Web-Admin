(function($) {
  var defaults = {max: 100, target: null};
  $.fn.inputHistory = function(opts) 
  {
    if (!opts) { opts = {}; }
    if (opts.command == 'add')
    {
      return this.each(function() { this.inputHistory.add(opts); });
    }
    if (opts.command == 'selectPrevious')
    {
      return this.each(function() { this.inputHistory.selectPrevious(); })
    }
    if (opts.command == 'selectNext')
    {
      return this.each(function() { this.inputHistory.selectNext(); })
    }
    var options = $.extend({}, defaults, opts); 
    return this.each(function() 
    {
      if (this.inputHistory) { return false; }
      var $container = $(this);
      var count = 0;
      var index = 0;
      var unsaved = '';
      var self =
      {
        initialize: function() 
        {
          $container.delegate('#' + $container.attr('id') + ' > div', 'click', self.  clicked); 
        },
        add: function(opts)
        {
          var $item = $('<div>').addClass(opts.type);
          $item.append($('<span>').text(opts.text));
          if (opts.time)
          {
            $item.append($('<span>').addClass('time').text(opts.time));
          }
          $container.append($item);
          $container.scrollTop($container[0].scrollHeight);
          if (++count >= options.max) { self.trim(count - options.max); }
          index = 0;
        },
        trim: function(number)
        {
          for(var i = 0; i < number; ++i)
          {
            $container.children(':first').remove();
          }
        },
        clicked: function()
        {
          var value = $(this).find('span:first').text()
          options.target.commandInput({command: 'set', text: value});
        },
        selectPrevious: function()
        {
          if (index == 0)
          {
            unsaved = options.target.val();
          }
          var i = count - (index + 1);  
          if (i < 0) { return; }
          ++index;
          $container.children(':eq(' + i + ')').click();
          options.target.setSelectionRange(0,0);
        },
        selectNext: function()
        {
          var i = count - (index - 1);  
          if (i == count) { index = 0; }
          if (i >= count) { options.target.commandInput({command: 'set', text: unsaved}); return; }
          --index;
          $container.children(':eq(' + i + ')').click();
        }
      };
      this.inputHistory = self;
      self.initialize();
    });
  };
})(jQuery);
