/* PI Menu */

$(document).ready(function() {

    /*PI tables scroll*/
    var respTable = $('.table-holder .responsive-table');

    $.fn.extend({
      scrollRight: function(property) {
        return this[0].scrollWidth - (this[0].scrollLeft + this[0].clientWidth) + 1;
      }
    });

    function hasScrolbar(element){
         return element.get(0).scrollWidth > element.width();
    }

    function addScrollable(){
        for (var i = 0; i < respTable.length; i++) {
            var elem = $(respTable[i]);
            if(hasScrolbar(elem)){
                elem.parent('.table-holder').addClass('scrollable');
            }
        }
        console.log('addScrollable');
    }

    function removeScrollable(){
        var elems = $('.scrollable');
        for (var i = 0; i < elems.length; i++) {
            var elem = $(elems[i]);
            if(!hasScrolbar(elem.children('.responsive-table'))){
                elem.removeClass('scrollable');
            }
        }
        console.log('removeScrollable');
    }

    function scrollShadower(e){
            var target = $(e.target);
            if (target.scrollLeft() > 0 && !target.hasClass('scrolled')){
                target.addClass('scrolled');
            }
            else if (target.scrollRight() < 2 && !target.hasClass('scrolled-end')){
                target.addClass('scrolled-end');
            }
            else if (target.scrollLeft() <= 0 && target.hasClass('scrolled')){
                target.removeClass('scrolled');
            }
           else if (target.scrollRight() >= 2 && target.hasClass('scrolled-end')){
                target.removeClass('scrolled-end');
            }
            console.log(target.scrollRight());
        }

    $( window ).resize(addScrollable);
    $( window ).resize(removeScrollable);
    $( document ).ready(addScrollable);

    $( '.responsive-table' ).on('scroll', scrollShadower);
    /*$( '.responsive-table' ).on('touchmove', scrollShadower);*/

 
});