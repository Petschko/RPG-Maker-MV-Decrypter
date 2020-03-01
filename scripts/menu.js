/**
 * Author: Peter Dragicevic [peter@petschko.org]
 * Authors-Website: https://petschko.org/
 * Date: 19.02.2020
 * Time: 19:03
 */

(function() {
	'use strict';

	var eventAddMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
	var menus = [];

	/**
	 * Returns the current anchor from the URL
	 *
	 * @returns {string} - Anchor or empty string if none
	 */
	function getAnchorFromUrl() {
		return window.location.hash.substr(1);
	}

	/**
	 * Adds a silent anchor to avoid scrolling
	 *
	 * @param {string} anchor - Anchor
	 */
	function addSilentAnchor(anchor) {
		if(history.replaceState)
			history.replaceState(null, '', '#' + anchor);
		else
			window.location.hash = '#' + anchor; // Fallback
	}

	/**
	 * Removes a CSS-Class
	 *
	 * @param {string} elementClasses - Element CSS-Classes
	 * @param {string} removeClass - Class to remove
	 * @returns {string} - New CSS-Classes
	 */
	function removeCssClass(elementClasses, removeClass) {
		var newClassNames = '';
		var classes = elementClasses.split(' ');

		// Check if element is in array else exit
		if(classes.indexOf(removeClass) === -1)
			return elementClasses;

		for(var i = 0; i < classes.length; i++) {
			if(classes[i] !== removeClass)
				newClassNames += classes[i] + ' ';
		}

		return newClassNames.trim();
	}

	/**
	 * Adds a CSS-Class, it never adds an existing class twice
	 *
	 * @param {string} elementClasses - Element CSS-Classes
	 * @param {string} addClass - Class to add
	 * @returns {string} - New CSS-Classes
	 */
	function addCssClass(elementClasses, addClass) {
		var classes = elementClasses.split(' ');

		if(classes.indexOf(addClass) !== -1)
			return elementClasses;

		return (elementClasses + ' ' + addClass).trim();
	}

	/**
	 * Check if a the searched Class is within this class-string
	 *
	 * @param {string} elementClasses - Element CSS-Classes
	 * @param {string} searchClass - Class to check
	 * @returns {boolean} - true if the class exist else false
	 */
	function hasCssClass(elementClasses, searchClass) {
		var classes = elementClasses.split(' ');

		return (classes.indexOf(searchClass) !== -1);
	}

	/**
	 * Returns the correct function for the action of an Event-Listener
	 *
	 * @param {string} action
	 * @returns {string}
	 */
	function on(action) {
		return window.addEventListener ? action : 'on' + action;
	}

	/**
	 * Adds a Event-Listener cross-browser
	 *
	 * @param {Element|Node|HTMLElement} element
	 * @param {string} action
	 * @param {function} callable
	 */
	function addEventListener(element, action, callable) {
		element[eventAddMethod](on(action), callable);
	}


	// Menu Actions
	/**
	 * Updates all menus when clicking on anchor link
	 */
	function updateMenuFromHref() {
		var menuHref = document.getElementsByClassName('menu-link');

		if(! menuHref)
			return;

		for(var i = 0; i < menuHref.length; i++) {
			addEventListener(menuHref[i], 'click', function(e) {
				if(this.href.indexOf('#') === -1)
					return;

				// e.preventDefault();
				var anchor = this.href.split('#')[1];

				// Handle all menus
				for(var n = 0; n < menus.length; n++) {
					menus[n].updateFromAnchor(anchor);
				}
			});
		}
	}

	/**
	 * Searches Menus and adds functions on it
	 */
	function findMenus() {
		var menuElements = document.getElementsByClassName('nav-tabs');

		if(! menuElements)
			return;

		for(var i = 0; i < menuElements.length; i++)
			menus.push(new Menu(menuElements[i]));

		// Add external menu functions
		updateMenuFromHref();
	}

	/**
	 * Creates a new interactive menu
	 *
	 * @param {Element|Node|HTMLElement} menuElement - Menu-List-Element
	 * @constructor - Menu
	 */
	function Menu(menuElement) {
		this.menuItems = menuElement.getElementsByClassName('nav-link');
		this.activeIndex = -1;
		this.displayElementIds = [];

		/**
		 * Updates the Active index
		 */
		this.findActiveIndex = function() {
			for(var i = 0; i < this.menuItems.length; i++) {
				if(hasCssClass(this.menuItems[i].className, 'active')) {
					this.activeIndex = i;

					return
				}
			}

			this.activeIndex = -1;
		};

		/**
		 * Finds the active Menu-Item when a anchor is given
		 */
		this.findActiveIndexFromAnchor = function() {
			var anchor = getAnchorFromUrl();

			for(var i = 0; i < this.menuItems.length; i++) {
				if(this.getIdDisplayId(this.menuItems[i]) === anchor) {
					this.activeIndex = i;

					return;
				}
			}

			this.activeIndex = -1;
		};

		/**
		 * Updates the menu with the given anchor if found
		 *
		 * @param {string} anchor - Anchor
		 * @returns {boolean} - Was found and updated
		 */
		this.updateFromAnchor = function(anchor) {
			var found = false;

			for(var i = 0; i < this.menuItems.length; i++) {
				if(this.getIdDisplayId(this.menuItems[i]) === anchor) {
					this.activeIndex = i;
					this.updateMenuTo(this.activeIndex);
					found = true;

					break;
				}
			}

			return found;
		};

		/**
		 * Gets the Display Id of an element
		 *
		 * @param menuItem - Menu-Item
		 * @returns {string} - Display ID
		 */
		this.getIdDisplayId = function(menuItem) {
			var anchor = menuItem.getElementsByTagName('a');

			return anchor[0].href.split('#')[1];
		};

		/**
		 * Removes click ability from the links (To avoid scrolling)
		 */
		this.preventDefaultLink = function() {
			for(var i = 0; i < this.menuItems.length; i++) {
				var anchor = this.menuItems[i].getElementsByTagName('a')[0];

				addEventListener(anchor, 'click', function(e) {
					if(this.href.indexOf('#') === -1)
						return;

					e.preventDefault();
					addSilentAnchor(this.href.split('#')[1]);
				});
			}
		};

		/**
		 * Hides a container with that index
		 *
		 * @param {number} index - Index to hide
		 */
		this.hideContainer = function(index) {
			var container = document.getElementById(this.displayElementIds[index]);

			if(! container)
				return;

			container.className = addCssClass(container.className, 'hidden');
		};

		/**
		 * Shows a container with that index
		 *
		 * @param {number} index - Index to show
		 */
		this.showContainer = function(index) {
			var container = document.getElementById(this.displayElementIds[index]);

			if(! container)
				return;

			container.className = removeCssClass(container.className, 'hidden');
		};

		/**
		 * Updates the Menu and container to the index
		 *
		 * @param {number} index - New active index
		 */
		this.updateMenuTo = function(index) {
			this.activeIndex = index;

			for(var i = 0; i < this.menuItems.length; i++) {
				if(i === index) {
					this.menuItems[i].className = addCssClass(this.menuItems[i].className, 'active');
					this.showContainer(i);
				} else {
					this.menuItems[i].className = removeCssClass(this.menuItems[i].className, 'active');
					this.hideContainer(i);
				}
			}
		};

		/**
		 * Inits the Menu
		 */
		this.init = function() {
			// Check if an anchor is given
			if(getAnchorFromUrl())
				this.findActiveIndexFromAnchor();

			// If nothing is found or given still search normal
			if(this.activeIndex === -1)
				this.findActiveIndex();

			for(var i = 0; i < this.menuItems.length; i++) {
				this.displayElementIds.push(this.getIdDisplayId(this.menuItems[i]));

				// Add Listener
				addEventListener(this.menuItems[i], 'click', function(that, updateIndex) {
					return function(e) {
						that.updateMenuTo(updateIndex);
					}
				}(this, i));

				if(this.activeIndex !== i)
					this.hideContainer(i);
			}

			if(this.activeIndex === -1)
				this.updateMenuTo(0);
			else
				this.updateMenuTo(this.activeIndex);
			this.preventDefaultLink();
		};

		// Init
		this.init();
	}

	/**
	 * initialized when page is loaded
	 */
	function init() {
		findMenus();
	}

	window[window.addEventListener ? 'addEventListener' : 'attachEvent'](
		window.addEventListener ? 'load' : 'onload', init, false);
})();
