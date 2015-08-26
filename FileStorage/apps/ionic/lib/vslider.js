
(function(ionic) {
    'use strict';

    ionic.views.vSlider = ionic.views.View.inherit({
        initialize: function (options) {
            var slider = this;

            // utilities
            var noop = function() {}; // simple no operation function
            var offloadFn = function(fn) { setTimeout(fn || noop, 0); }; // offload a functions execution

            // check browser capabilities
            var browser = {
                addEventListener: !!window.addEventListener,
                touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
                transitions: (function(temp) {
                    var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
                    for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
                    return false;
                })(document.createElement('swipe'))
            };


            var container = options.el;

            // quit if no root element
            if (!container) return;
            var element = container.children[0];
            var slides, slidePos, height, length;
            options = options || {};
            var index = parseInt(options.startSlide, 10) || 0;
            var speed = options.speed || 300;

            function setup() {

                // do not setup if the container has no height
                if (!container.offsetHeight) {
                    return;
                }

                // cache slides
                slides = element.children;
                length = slides.length;

                // create an array to store current positions of each slide
                slidePos = new Array(slides.length);

                // determine height of each slide
                height = container.offsetHeight || container.getBoundingClientRect().height;

                element.style.height = (slides.length * height) + 'px';

                // stack elements
                var pos = slides.length;
                while(pos--) {

                    var slide = slides[pos];

                    slide.style.height = height + 'px';
                    slide.setAttribute('data-index', pos);

                    if (browser.transitions) {
                        slide.style.top = (pos * -height) + 'px';
                        move(pos, index > pos ? -height : (index < pos ? height : 0), 0);
                    }

                }

                if (!browser.transitions) element.style.top = (index * -height) + 'px';

                container.style.visibility = 'visible';

                options.slidesChanged && options.slidesChanged();
            }

            function prev(slideSpeed) {

                if (index) slide(index - 1, slideSpeed);

            }

            function next(slideSpeed) {

                if (index < slides.length - 1) slide(index + 1, slideSpeed);

            }

            function circle(index) {

                // a simple positive modulo using slides.length
                return (slides.length + (index % slides.length)) % slides.length;

            }

            function slide(to, slideSpeed) {

                // do nothing if already on requested slide
                if (index == to) return;

                if (browser.transitions) {

                    var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

                    var diff = Math.abs(index - to) - 1;

                    // move all the slides between index and to in the right direction
                    while (diff--) move( circle((to > index ? to : index) - diff - 1), height * direction, 0);

                    to = circle(to);

                    move(index, height * direction, slideSpeed || speed);
                    move(to, 0, slideSpeed || speed);

                } else {

                    to = circle(to);
                    animate(index * -height, to * -height, slideSpeed || speed);
                    //no fallback for a circular continuous if the browser does not accept transitions
                }

                index = to;
                offloadFn(options.callback && options.callback(index, slides[index]));
            }

            function move(index, dist, speed) {

                translate(index, dist, speed);
                slidePos[index] = dist;

            }

            function translate(index, dist, speed) {

                var slide = slides[index];
                var style = slide && slide.style;

                if (!style) return;

                style.webkitTransitionDuration =
                    style.MozTransitionDuration =
                        style.msTransitionDuration =
                            style.OTransitionDuration =
                                style.transitionDuration = speed + 'ms';

                style.webkitTransform = 'translate(0,' + dist + 'px)' + 'translateZ(0)';
                style.msTransform =
                    style.MozTransform =
                        style.OTransform = 'translateY(' + dist + 'px)';

            }

            function animate(from, to, speed) {

                // if not an animation, just reposition
                if (!speed) {

                    element.style.top = to + 'px';
                    return;

                }

                var start = +new Date();

                var timer = setInterval(function() {

                    var timeElap = +new Date() - start;

                    if (timeElap > speed) {

                        element.style.top = to + 'px';

                        if (delay) begin();

                        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                        clearInterval(timer);
                        return;

                    }

                    element.style.top = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

                }, 4);

            }

            // setup auto slideshow
            var delay = options.auto || 0;
            var interval;

            function begin() {

                interval = setTimeout(next, delay);

            }

            function stop() {

                delay = options.auto || 0;
                clearTimeout(interval);

            }


            // setup initial vars
            var start = {};
            var delta = {};
            var isScrolling;

            // setup event capturing
            var events = {

                handleEvent: function(event) {
                    if(event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
                        event.touches = [{
                            pageX: event.pageX,
                            pageY: event.pageY
                        }];
                    }

                    switch (event.type) {
                        case 'mousedown': this.start(event); break;
                        case 'touchstart': this.start(event); break;
                        case 'touchmove': this.touchmove(event); break;
                        case 'mousemove': this.touchmove(event); break;
                        case 'touchend': offloadFn(this.end(event)); break;
                        case 'mouseup': offloadFn(this.end(event)); break;
                        case 'webkitTransitionEnd':
                        case 'msTransitionEnd':
                        case 'oTransitionEnd':
                        case 'otransitionend':
                        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
                        case 'resize': offloadFn(setup); break;
                    }

                    if (options.stopPropagation) event.stopPropagation();

                },
                start: function(event) {

                    var touches = event.touches[0];

                    // measure start values
                    start = {

                        // get initial touch coords
                        x: touches.pageX,
                        y: touches.pageY,

                        // store time to determine touch duration
                        time: +new Date()

                    };

                    // used for testing first move event
                    isScrolling = undefined;

                    // reset delta and end measurements
                    delta = {};

                    // attach touchmove and touchend listeners
                    if(browser.touch) {
                        element.addEventListener('touchmove', this, false);
                        element.addEventListener('touchend', this, false);
                    } else {
                        element.addEventListener('mousemove', this, false);
                        element.addEventListener('mouseup', this, false);
                        document.addEventListener('mouseup', this, false);
                    }
                },
                touchmove: function(event) {

                    // ensure swiping with one touch and not pinching
                    // ensure sliding is enabled
                    if (event.touches.length > 1 ||
                        event.scale && event.scale !== 1 ||
                        slider.slideIsDisabled) {
                        return;
                    }

                    if (options.disableScroll) event.preventDefault();

                    var touches = event.touches[0];

                    // measure change in x and y
                    delta = {
                        x: touches.pageX - start.x,
                        y: touches.pageY - start.y
                    };

                    // determine if scrolling test has run - one time test
                    if ( typeof isScrolling == 'undefined') {
                        isScrolling = !!( isScrolling || Math.abs(delta.x) > Math.abs(delta.y) );
                    }

                    // if user is not trying to scroll vertically
                    if (!isScrolling) {

                        // prevent native scrolling
                        event.preventDefault();

                        // stop slideshow
                        stop();

                        // increase resistance if first or last slide
                        delta.y =
                            delta.y /
                            ( (!index && delta.y > 0 ||         // if first slide and sliding top
                            index == slides.length - 1 &&     // or if last slide and sliding bottom
                            delta.y < 0                       // and if sliding at all
                            ) ?
                                ( Math.abs(delta.y) / height + 1 )      // determine resistance level
                                : 1 );                                 // no resistance if false

                        // translate 1:1
                        translate(index - 1, delta.y + slidePos[index - 1], 0);
                        translate(index, delta.y + slidePos[index], 0);
                        translate(index + 1, delta.y + slidePos[index + 1], 0);

                        options.onDrag && options.onDrag();
                    }

                },
                end: function() {

                    // measure duration
                    var duration = +new Date() - start.time;

                    // determine if slide attempt triggers next/prev slide
                    var isValidSlide =
                        Number(duration) < 250 &&         // if slide duration is less than 250ms
                        Math.abs(delta.y) > 20 ||         // and if slide amt is greater than 20px
                        Math.abs(delta.y) > height / 2;      // or if slide amt is greater than half the height

                    // determine if slide attempt is past start and end
                    var isPastBounds = (!index && delta.y > 0) ||      // if first slide and slide amt is greater than 0
                        (index == slides.length - 1 && delta.y < 0); // or if last slide and slide amt is less than 0

                    // determine direction of swipe (true:bottom, false:top)
                    var direction = delta.y < 0;

                    // if not scrolling vertically
                    if (!isScrolling) {

                        if (isValidSlide && !isPastBounds) {

                            if (direction) {

                                move(index - 1, -height, 0); // we need to get the next in this direction in place

                                move(index, slidePos[index] - height, speed);
                                move(circle(index + 1), slidePos[circle(index + 1)] - height, speed);
                                index = circle(index + 1);

                            } else {
                                move(index + 1, height, 0); // we need to get the next in this direction in place

                                move(index, slidePos[index] + height, speed);
                                move(circle(index - 1), slidePos[circle(index - 1)] + height, speed);
                                index = circle(index - 1);

                            }

                            options.callback && options.callback(index, slides[index]);

                        } else {

                            move(index - 1, -height, speed);
                            move(index, 0, speed);
                            move(index + 1, height, speed);

                        }

                    }

                    // kill touchmove and touchend event listeners until touchstart called again
                    if(browser.touch) {
                        element.removeEventListener('touchmove', events, false);
                        element.removeEventListener('touchend', events, false);
                    } else {
                        element.removeEventListener('mousemove', events, false);
                        element.removeEventListener('mouseup', events, false);
                        document.removeEventListener('mouseup', events, false);
                    }

                    options.onDragEnd && options.onDragEnd();
                },
                transitionEnd: function(event) {

                    if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                        if (delay) begin();

                        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                    }

                }

            };

            // Public API
            this.update = function() {
                setTimeout(setup);
            };
            this.setup = function() {
                setup();
            };

            this.enableSlide = function(shouldEnable) {
                if (arguments.length) {
                    this.slideIsDisabled = !shouldEnable;
                }
                return !this.slideIsDisabled;
            };

            this.slide = this.select = function(to, speed) {
                // cancel slideshow
                stop();

                slide(to, speed);
            };

            this.prev = this.previous = function() {
                // cancel slideshow
                stop();

                prev();
            };

            this.next = function() {
                // cancel slideshow
                stop();

                next();
            };

            this.stop = function() {
                // cancel slideshow
                stop();
            };

            this.start = function() {
                begin();
            };

            this.autoPlay = function(newDelay) {
                if (!delay || delay < 0) {
                    stop();
                } else {
                    delay = newDelay;
                    begin();
                }
            };

            this.currentIndex = this.selected = function() {
                // return current index position
                return index;
            };

            this.slidesCount = this.count = function() {
                // return total number of slides
                return length;
            };

            this.kill = function() {
                // cancel slideshow
                stop();

                // reset element
                element.style.height = '';
                element.style.top = '';

                // reset slides so no refs are held on to
                slides && (slides = []);

                // removed event listeners
                if (browser.addEventListener) {

                    // remove current event listeners
                    element.removeEventListener('touchstart', events, false);
                    element.removeEventListener('webkitTransitionEnd', events, false);
                    element.removeEventListener('msTransitionEnd', events, false);
                    element.removeEventListener('oTransitionEnd', events, false);
                    element.removeEventListener('otransitionend', events, false);
                    element.removeEventListener('transitionend', events, false);
                    window.removeEventListener('resize', events, false);

                }
                else {

                    window.onresize = null;

                }
            };

            this.load = function() {
                // trigger setup
                setup();

                // start auto slideshow if applicable
                if (delay) begin();


                // add event listeners
                if (browser.addEventListener) {

                    // set touchstart event on element
                    if (browser.touch) {
                        element.addEventListener('touchstart', events, false);
                    } else {
                        element.addEventListener('mousedown', events, false);
                    }

                    if (browser.transitions) {
                        element.addEventListener('webkitTransitionEnd', events, false);
                        element.addEventListener('msTransitionEnd', events, false);
                        element.addEventListener('oTransitionEnd', events, false);
                        element.addEventListener('otransitionend', events, false);
                        element.addEventListener('transitionend', events, false);
                    }

                    // set resize event on window
                    window.addEventListener('resize', events, false);

                } else {

                    window.onresize = function () { setup(); }; // to play nice with old IE

                }
            };

        }
    });

})(ionic);