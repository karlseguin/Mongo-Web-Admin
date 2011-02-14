(function($) {
  var defaults = {delay: 4000, width: 400, height: 255, autoShow: false, title: null, destroyOnClose: false};
  $.fn.dialog = function(options) 
  {
    if(options.command == 'close')
    {
      return this.each(function() { this.dialog.close(); });
    }
    var opts = $.extend({}, defaults, options); 
    return this.each(function() 
    {
      if (this.dialog) { return false; }
      var $content = $(this);
      var $this = $('<div>').append(this);
      var $header = null;
      var self =
      {
        initialize: function() 
        {
          $content.css('padding', '0px 10px');
          $header = $('<div>').addClass('header r').html('<span></span><a></a>');
          $this.appendTo($('body')).hide().addClass('dialog r').css({ zIndex: 100, width: opts.width, height: opts.height });
          $this.prepend($header);
          $this.css({ position: 'absolute' });
          self.setTitle(opts.title);
          if (opts.autoShow) { self.show(); }
        },
        show: function() 
        {
          self.bindEvents();
          self.position();
          $.dialog.showOverlay();
          $this.show();
        },
        close: function() 
        {
          self.unbindEvents();
          $.dialog.hideOverlay();
          if (opts.destroyOnClose) { $this.remove(); }
          else { $this.hide(); }
        },
        getDimensions: function() 
        {
          var el = $(window);
          var h = $.browser.opera && $.browser.version > '9.5' && $.fn.jquery <= '1.2.6' ? document.documentElement['clientHeight'] : el.height();
          return [h, el.width()];
        },
        position: function() 
        {
          var dimensions = self.getDimensions();
          $this.center();
          $this.css('top', '140px');
        },
        bindEvents: function() 
        {
          $(window).bind('resize', self.position);
          $header.find('a').bind('click', self.close);
          $(document).bind('keydown', function(e)  { if (e.keyCode == 27) { self.close(); } });
        },
        unbindEvents: function() 
        {
          $(window).unbind('resize');
          $header.find('a').unbind('click');
        },
        setTitle: function(title) 
        {
          if (title) { $header.find('span').text(title); }
        },
        setBody: function(body) 
        {
          if (body) { $content.html(body); }
        },
        heightAdjust: function() 
        {
          $this.height($content.height() + $header.height() + 30);
        }
      };
      $this[0].dialog = self;
      self.initialize();
    });
  };
})(jQuery);

$.dialog =
{
  $overlay: null,
  load: function(url, data, callback)
  {
    $.get(url, data, function(html){$.dialog.loaded(html, callback)}, 'html');
  },
  loaded: function(html, callback)
  {
    var $html = $(html);
    var $title = $html.find('.title');
    $title.remove();
    if (callback) { callback($html); }
    $html.appendTo('body').dialog({autoShow: true, destroyOnClose: true, title: $title.text()});
    
  },
  showOverlay: function()
  {
    if ($.dialog.$overlay == null)
    {
      $.dialog.$overlay = $('<div class="dialogOverlay">').appendTo('body');
    }
    $.dialog.$overlay.show();
  },
  hideOverlay: function()
  {
    $.dialog.$overlay.hide();
  },
  close: function()
  {
    $('.dialog').dialog({command: 'close'});
    $.dialog.hideOverlay();
  }
}
  
$.fn.center = function() 
{
  this.css('position', 'absolute');
  this.css('top', ($(window).height() - this.height()) / 2 + $(window).scrollTop() + 'px');
  this.css('left', ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + 'px');
  return this;
};
