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
            target.removeClass('scrolled').removeClass('scrolled-end');
            if (target.scrollLeft() > 0 ){
                target.addClass('scrolled');
            }
            if (target.scrollRight() < 2){
                target.addClass('scrolled-end');
            }
            console.log(target.scrollRight());
        }

    $( window ).resize(addScrollable);
    $( window ).resize(removeScrollable);
    $( document ).ready(addScrollable);

    $( '.responsive-table' ).on('scroll', scrollShadower);
    $( '.responsive-table' ).on('touchmove', scrollShadower);

 
    /* PI search start*/

    var mobileBreakpoint = 768;
    var matches = [];

    (function() {

        function extendDefaults(source, properties) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }

        this.DS = function() {

            var defaults = {
                    button: '.pi-nav-search__button',
                    searchArea: '.pi-section_full.full-pi',
                    input: '.pi-nav-search__input',
                    inputWrapper: '.pi-nav-search',
                    clearButton: '.pi-nav-search__clear',
                    actions: '.pi-nav-search-actions',
                    result: '.pi-nav-search-result',
                    notFound: '.pi-nav-search__not-found',
                    actionNext: '.pi-nav-search-actions__next',
                    actionPrev: '.pi-nav-search-actions__prev'
                },
                options = {};

            var position = 0;

            if (arguments[0] && typeof arguments[0] === "object") {
                options = extendDefaults(defaults, arguments[0]);
            } else { options = defaults; }

            var button = document.querySelector(options.button),
                searchArea = document.querySelector(options.searchArea),
                input = document.querySelector(options.input),
                inputWrapper = document.querySelector(options.inputWrapper),
                clearButton = document.querySelector(options.clearButton),
                actions = document.querySelector(options.actions),
                result = document.querySelector(options.result),
                notFound = document.querySelector(options.notFound),
                actionNext = document.querySelector(options.actionNext),
                actionPrev = document.querySelector(options.actionPrev);

            function hide() {
                for (var i = 0; i < arguments.length; i++) { arguments[i].style.display = 'none'; }
            }

            function show() {
                for (var i = 0; i < arguments.length; i++) { arguments[i].style.display = 'block'; }
            }

            function init() {
                button.addEventListener('click', makeSearch);
                clearButton.addEventListener('click', clear);
                input.addEventListener('keypress', function(e) { e.keyCode == 13 && makeSearch() });
                input.addEventListener('input', function() {
                    if (this.value != '') {
                        if (screen.width <= mobileBreakpoint) {
                            button.style.right = '52px';
                        } else {
                            button.style.right = '40px';
                        }
                        show(clearButton);
                    } else {
                        hide(clearButton, actions, result);
                    }
                });
                input.addEventListener('focus', function() {
                    show(button, document.querySelector('.pi-nav-search-input-overlay'));
                    hide(notFound, result, actions);
                    input.value != '' && show(clearButton);
                    input.style.paddingRight = '50px';
                    if (screen.width <= mobileBreakpoint) { input.style.paddingRight = '60px'; }
                    //if (screen.width <= mobileBreakpoint && window.pageYOffset < 120) { window.scrollTo(0, 120); }
                })
            }

            function getSearchQuery(input) {
                var searchQuery = [];
                if (input.value == '') {
                    console.log('Empty input');
                }
                //searchQuery = input.value;
                //return searchQuery.match(/\S+/g);
                searchQuery.push(input.value);
                return searchQuery;
            }

            var textNodes = [];

            function walkTroughNodes(node, re) {
                if (node) {
                    node = node.firstChild;
                    while (node != null) {
                        if (node.nodeType == 3) {
                            if (node.textContent.match(re)) {
                                textNodes.push(node);
                            }
                        } else if (node.nodeType) {
                            walkTroughNodes(node, re);
                        }
                        node = node.nextSibling;
                    }
                }
            }

            function resetHighlighted() {
                var highlighted = document.getElementsByClassName("highlight");
                while (highlighted.length > 0) {
                    highlighted[0].style.backgroundColor = 'transparent';
                    highlighted[0].classList.remove("highlight");
                }
            }

            function scrollToHighlighted(element) {
                element.style.backgroundColor = '#ff9632';
                var offset = $(element).offset().top;
                window.scrollTo(0, offset);
                screen.width <= mobileBreakpoint ? window.scrollBy(0,-200) : window.scrollBy(0,-50);
            }

            function countMatches() {
                matches = document.getElementsByClassName('highlight');
                if (matches.length <= 0) {
                    show(notFound);
                    hide(button, clearButton, result, actions);
                } else {
                    show(actions, result);
                    hide(button);
                    document.querySelector('.pi-nav-search-result__quantity').textContent = matches.length;
                    var firstMatch = matches[0];
                    scrollToHighlighted(firstMatch);
                    position = 1;
                    document.querySelector('.pi-nav-search-result__position').textContent = position;
                }
            }

            function makeSearch() {
                resetHighlighted();
                var re,
                    words = getSearchQuery(input);

                if (words.length > 0) {
                    for (var i = 0; i < words.length; i++) {    // Go through search area for each word
                        /*if (words[i].length > 4) {
                         re = new RegExp(words[i], "gi");

                         } else {*/
                        re = new RegExp ('\\b' + words[i] + '\\b', "gi");   // \b - word boundary
                        //}

                        walkTroughNodes(searchArea, re);
                        for (j = textNodes.length - 1; j >= 0; j--) {
                            var dummy = document.createDocumentFragment(),
                                node = textNodes[j],
                                span = document.createElement('span');

                            span.innerHTML = node.textContent.replace(re, function (match) {
                                return '<span class="highlight">' + match + '</span>';
                            });
                            dummy.appendChild(span);

                            node.parentNode.replaceChild(dummy, node);
                            textNodes.pop();
                        }
                    }

                    afterSearch();
                }
                function afterSearch() {
                    input.setAttribute('data-searching', true);
                    input.style.paddingRight = '120px';

                    if (screen.width <= mobileBreakpoint) {
                        input.style.paddingRight = '165px';
                        $('.pi-nav-mobile-switcher').hide().removeClass('active');
                        $('.pi-nav-list').hide();   // Need do hide it before scrolling into highlighted element
                        $('.pi-nav').removeClass('expanded').css({
                            "top": "0",
                            "padding-bottom": "0"
                        });
                        $('.pi-nav-search').addClass('pi-nav-search_sticky');
                        $('body').removeClass('no-vertical-scroll');
                    }

                    $('.pi-section').each(function(index, element) { $(element).hide(); });
                    $('.pi-section_full').show();

                    countMatches();

                    document.activeElement.blur();

                    var piNavItems = $('.pi-nav-list-item');
                    $(piNavItems[2]).addClass('active');
                    $(piNavItems).not($(piNavItems)[2]).removeClass('active');
                    location.hash = $(piNavItems[2]).data('section-name');
                    checkSticky();
                    $('.pi-nav-holder-helper').css('overflow-y', 'visible');
                }
            }

            function clear() {
                input.value = '';
                input.style.paddingRight = '50px';
                document.querySelector('.pi-nav-search-result__quantity').textContent = '';
                hide(clearButton, result, actions, document.querySelector('.pi-nav-search-input-overlay'));
                show(button);
                resetHighlighted();
                button.style.right = '20px';
                position = 1;
                document.querySelector('.pi-nav-search-result__position').textContent = position;
                screen.width <= mobileBreakpoint && $('.pi-nav-holder-helper').css('overflow-y', 'scroll');

                if (screen.width <= mobileBreakpoint && input.dataset.searching == 'true') {
                    var piNavSwitcher = $('.pi-nav-mobile-switcher');
                    $(piNavSwitcher).show().removeClass('active');
                    pageYOffset > $('.pi-nav').offset().top && $(piNavSwitcher).addClass('sticky');
                    $('.pi-nav-search').hide().removeClass('pi-nav-search_sticky');
                    input.setAttribute('data-searching', false);
                }
            }

            actionNext.addEventListener('click', function() {
                if (position < matches.length) {
                    position++;
                    document.querySelector('.pi-nav-search-result__position').textContent = position;
                    matches[position - 1].style.backgroundColor = '#ff9632';
                    scrollToHighlighted(matches[position - 1]);
                    if (position != 0) {
                        matches[position - 2].style.backgroundColor = '#ff0'; // return background for previous match element
                    }

                }
            });

            actionPrev.addEventListener('click', function() {
                if (position != 1) {
                    position--;
                    document.querySelector('.pi-nav-search-result__position').textContent = position;
                    scrollToHighlighted(matches[position - 1]);
                    matches[position].style.backgroundColor = '#ff0';
                    matches[position - 1].style.backgroundColor = '#ff9632';
                }
            });


            return {
                init: init,
                clear: clear
            };

        };
    })();


    var ds = new DS();
    ds.init();

    /* PI search end */



    /* PI navigation menu START */

    var navItems = $('.pi-nav-list-item').toArray();

    // Assign section names to data attrs for those that don't have it
    $('.pi-nav-list-item').each(function(index, element) {
        if (!$(element).data('section-name')) {
            var sectionName = $(this).text().toLowerCase().replace(/ /g, '-');
            $(this).attr('data-section-name', sectionName);
        }
    });
    $('.pi-section').each(function(index, element) {
        var sectionName = $(navItems[index]).data('section-name');
        $(element).attr('data-section-name', sectionName);
    });

    $('.pi-section-nav-item a').on('click', function() {
        window.scrollTo(0,0);
    });

    function applyHash() {
        if (!!location.hash) {
            var hashes = location.hash.split('#');
            var firstHash = location.hash.split('#')[1];
            if (firstHash.indexOf('/') >= -1) {
                firstHash = firstHash.replace('/', '\\/'); // Double backslash for jQuery
            }
            $('.pi-nav-list [data-section-name='+ firstHash + ']').addClass('active');
            $('.pi-nav-list-item').not('[data-section-name='+ firstHash + ']').removeClass('active');
            $('.pi-section').each(function(index, element) {
                $(element).hide();
                $('.pi-content [data-section-name='+ firstHash + ']').show();
            });
            if (hashes.length > 2) {
                var secondHash = location.hash.split('#')[2];
                $('[data-chapter]').each(function(index, element) {
                    if ($(element).data('chapter') == secondHash) {
                        element.scrollIntoView();
                        if (screen.width <= mobileBreakpoint) {
                            stickyBlockHeight = $('.header').height() + $('.pi-nav').height() + 10;
                            console.log(stickyBlockHeight);
                            window.scrollBy(0, -stickyBlockHeight);
                        }
                    }
                });
            }
        } else {
            $('.pi-section_full').show();
        }
        //isiTray.toggle();
    }

    window.addEventListener('hashchange', function() {
        applyHash();
    });

    applyHash();  // At document.ready

    $('.pi-nav-list-item').on('click', function() {
        var sectionName = $(this).data('section-name');
        location.hash = sectionName;
        if (sectionName.indexOf('/') >= -1) {
            sectionName = sectionName.replace('/', '\\/'); // Double backslash for jQuery
        }
        $(this).addClass('active');
        $('.pi-nav-list-item').not(this).removeClass('active');

        $('.pi-section').each(function(index, element) {
            $(element).hide();
            $('[data-section-name='+ sectionName + ']').show();
        });

        ds.clear();

        if (screen.width <= mobileBreakpoint) {
            var piNavSwitcher = $('.pi-nav-mobile-switcher');
            $(piNavSwitcher).removeClass('active sticky').css('top', '0');
            $('body').removeClass('no-vertical-scroll');
            $('.pi-nav-search').hide();
            $('.pi-nav-list').hide();
            $('.pi-nav').removeClass('expanded').css({
                'top': '0',
                'padding-bottom': '0'
            });
            window.scrollTo(0,230);  // Scroll to the top of a selected section.
        } else {
            document.getElementsByTagName('body')[0].scrollIntoView();
        }
    });

    /* PI navigation menu END */
});