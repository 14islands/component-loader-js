/**
 * ScrollMask Component
 *
 * @method
 * init()
 * - Initializes the header component
 *
 * @method
 * render()
 * - Called when component is visible - if hidden while instanciating
 *
 */

/* global Components, ComponentLoader, requestAnimationFrame */

/*
 * Component scope
 */
(function ($) {
	'use strict';

	/*
	 * ScrollMask Component
	 */
	components.ScrollMask = function (context) {

		// public api object
		var api = {
			useScrollMonitor: true
		};

		var $el         = $(context),
		    $cover      = $el.find('.component-scrollmask__cover'),
		    $slider     = $el.find('.component-scrollmask__slider'),
		    lastScrollY = 0,
		    lastDelta   = 0,
		    ticking     = false,
		    dragging    = false,
		    lastMousePosition = { x: 0, y: 0 };


		function onMouseDown() {
			dragging = true;
			$el.on('mousemove', onMouseMove);
		}

		function onMouseUp() {
			dragging = false;
			$el.off('mousemove', onMouseMove);
		}

		function onMouseMove(evt) {
			lastMousePosition.x = evt.clientX;
			lastMousePosition.y = evt.clientY;
			requestTick();
		}

		/**
		 * Callback for our scroll event - just
		 * keeps track of the last scroll value
		 */
		function onScroll() {
			lastScrollY = window.scrollY;
			requestTick();
		}

		/**
		 * Calls rAF if it's not already
		 * been done already
		 */
		function requestTick() {
			if(!ticking) {
				requestAnimationFrame(update);
				ticking = true;
			}
		}

		/**
		 * Our animation callback
		 */
		function update() {
			var cTop                = $el.offset().top,
					cHeight             = $el.height(),
					marginFromTop       = 100, //$(window).innerHeight() * .05, // increase to start scrolling before top of element hits top of browser
					distanceToScroll    = cHeight * 0.66,
					delta = Math.min(1, Math.max(0, lastScrollY - cTop + marginFromTop) / distanceToScroll);

			if (dragging) {
				var x = $el.offset().left + $el.width() - lastMousePosition.x;
				$cover.css('right', x+'px');
			}
			// never dragged and new scroll delta to show
			else if (lastMousePosition.x === 0 && delta !== lastDelta) {
				$cover.css('right', 50 + (delta*50)+'%');
				lastDelta = delta;
			}

			// allow further rAFs to be called
			ticking = false;
		}

		function enable() {
			window.addEventListener('scroll', onScroll, false);
		}

		function disable() {
			window.removeEventListener('scroll', onScroll);
		}

		api.setScrollWatcher = function (watcher) {
			watcher.enterViewport(function() {
				enable();
			});
			watcher.exitViewport(function() {
				disable();
			});
		};

		/**
		 * Initializes the header component
		 *
		 **/
		api.init = function () {
			$slider.on('mousedown', onMouseDown);
			$(document).on('mouseup',   onMouseUp);
		};

		/**
		 * Function called by the component loader when it's time to render
		 *
		 **/
		// api.render = function () {
		// 	console.log('ScrollMask.render');
		// };

		// returns public methods
		// to the world outside
		return api;

	};

	/*
	 * Register the component
	 */
	componentLoader.register('scrollmask', components.ScrollMask);

}(jQuery));

