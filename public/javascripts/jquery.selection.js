(function($) {
  $.fn.selectionStart = function() 
  {
    return this[0].selectionStart;
  };
  $.fn.setSelectionRange = function(from, to)
  {
    return this.each(function()
    { 
      this.setSelectionRange(from, to);
    });
  };
})(jQuery);