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
    var inn = $('#inn');
    function scrollShadower(e){
            var target = $(e.target);
            var parent = target.parent();
            if (target.scrollLeft() > 0 && !parent.hasClass('scrolled')){
                parent.addClass('scrolled');
            }
            else if (target.scrollRight() < 2 && !parent.hasClass('scrolled-end')){
                parent.addClass('scrolled-end');
            }
            else if (target.scrollLeft() <= 0 && parent.hasClass('scrolled')){
                parent.removeClass('scrolled');
            }
           else if (target.scrollRight() >= 2 && parent.hasClass('scrolled-end')){
                parent.removeClass('scrolled-end');
            }
            inn.text(target.scrollRight());


        }

    $( window ).resize(addScrollable);
    $( window ).resize(removeScrollable);
    $( document ).ready(addScrollable);

    $( '.responsive-table' ).on('scroll', scrollShadower);
    /*$( '.responsive-table' ).on('touchmove', scrollShadower);*/

 
});