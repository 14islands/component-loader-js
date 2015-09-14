/**
 * ComponentLoader Class
 *
 * Instantiates JavaScript Classes when their name is found in the DOM using attribute data-component=""
 *
 */
class ComponentLoader {

	/**
	 * Constructor for the ComponentLoader
	 * @class
	 * @public
	 * @param {Object} components - Optional collection of available components: {componentName: classDefinition}
	 * @param {Node} context - Optional DOM node to search for components. Defaults to document.
	 */
	constructor(components = {}, context = document) {
		this.contextEl = context;
		this.initializedComponents = {};
		this.numberOfInitializedComponents = 0;
		this.components = {};
		this.topics = {};
		this.register(components);
	}


	/**
	 * Add component(s) to collection of available components
	 * @public
	 * @param {Object} components - Collection of components: {componentName: classDefinition}
	 */
	register(components = {}) {
		Object.keys(components).forEach( (componentName) => {
			this.components[componentName] = components[componentName];
		});
	}

	/**
	 * Remove component from collection of available components
	 * @public
	 * @param {String} componentName - Name of the component to remove
	 */
	unregister(componentName) {
		delete this.components[componentName];
	}

	/**
	 * Mediator functionality.
	 * Stores the topic and callback given by the component.
	 * for further reference.
	 * @param  {String} topic      Topic string
	 * @param  {Function} callback Callback function that would be triggered.
	 */
	subscribe(topic, callback, context) {

		// Is this a new topic?
		if ( !this.topics.hasOwnProperty(topic) ) {
			this.topics[topic] = [];
		}

		// Store the subscriber callback
		this.topics[topic].push( { context: context, callback: callback } );

	}

	/**
	 * Mediator functionality.
	 * Removes the stored topic and callback given by the component.
	 * @param  {String}   topic    Topic string
	 * @param  {Function} callback Callback function that would be triggered.
	 * @return {Boolean}            True on success, False otherwise.
	 */
	unsubscribe(topic, callback) {
		// Do we have this topic?
		if (!this.topics.hasOwnProperty(topic)) {
			return false;
		}

		// Find out where this is and remove it
		for (let i = 0, len = this.topics[topic].length; i < len; i++) {
			if (this.topics[topic][i].callback === callback) {
				this.topics[topic].splice(i, 1);
				return true;
			}
		}

		return false;
	}

	/**
	 * [publish description]
	 * @param  {[type]} topic [description]
	 * @return {[type]}       [description]
	 */
	publish(topic) {
		// Check if we have subcribers to this topic
		if (!this.topics.hasOwnProperty(topic)) {
			return false;
		}

		// don't slice on arguments because it prevents optimizations in JavaScript engines (V8 for example)
		// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
		// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
		const args = new Array(arguments.length - 1);
		for (var i = 0; i < args.length; ++i) {
				args[i] = arguments[i + 1]; // remove first argument
		}

		// Loop through them and fire the callbacks
		for (let i = 0, len = this.topics[topic].length; i < len; i++) {
			let subscription = this.topics[topic][i];
			// Call it's callback
			if (subscription.callback) {
				subscription.callback.apply(subscription.context, args);
			}
		}

		return true;
	}

	/**
	 * Scan the DOM, initialize new components and destroy removed components.
	 * @public
	 * @param {Object} data - Optional data object to pass to the component constructor
	 */
	scan(data = {}) {
		const activeComponents = {},
		      elements = this.contextEl.querySelectorAll("[data-component]");

		([]).forEach.call(elements, (el) => {
			this._scanElement(el, activeComponents, data);
		});

		if (this.numberOfInitializedComponents > 0) this.cleanUp_(activeComponents);
	}


	/**
	 * Find all components registered on a specific DOM element and initialize them if new
	 * @private
	 * @param {Element} el - DOM element to scan for components
	 * @param {Object} activeComponents - All componentIds currently found in the DOM
	 * @param {Object} data - Optional data object to pass to the component constructor
	 */
	_scanElement(el, activeComponents, data) {
		// check of component(s) for this DOM element already have been initialized
		let elementId = el.getAttribute("data-component-id");

		if (!elementId) {
			// give unique id so we can track it on next scan
			elementId = this._generateUUID();
			el.setAttribute('data-component-id', elementId);
		}

		// find the name of the component instance
		const componentList = el.getAttribute("data-component").match(/\S+/g);
		componentList.forEach( (componentName) => {

			const componentId = `${componentName}-${elementId}`;
			activeComponents[componentId] = true;

			// check if component not initialized before
			if (!this.initializedComponents[componentId]) {
				this._initializeComponent(componentName, componentId, el, data)
			}

		});
	}


	/**
	 * Call constructor of component and add instance to the collection of initialized components
	 * @private
	 * @param {String} componentName - Name of the component to initialize. Used to lookup class definition in components collection.
	 * @param {String} componentId - Unique component ID (combination of component name and element ID)
	 * @param {Element} el - DOM element that is the context of this component
	 * @param {Object} data - Optional data object to pass to the component constructor
	 */
	_initializeComponent(componentName, componentId, el, data) {
		const component = this.components[componentName];

		if (typeof component !== 'function')
			throw `ComponentLoader: unknown component '${componentName}'`;

		let instance = new component(el, data, this);

		this.initializedComponents[componentId] = instance;
		this.numberOfInitializedComponents++;
	}


	/**
	 * Call destroy() on a component instance and remove it from the collection of initialized components
	 * @private
	 * @param {String} componentId - Unique component ID used to find component instance
	 */
	_destroyComponent(componentId) {
		const instance = this.initializedComponents[componentId];
		if (instance && typeof instance.destroy === 'function')
			instance.destroy();

		// safe to delete while object keys while loopinghttp://stackoverflow.com/questions/3463048/is-it-safe-to-delete-an-object-property-while-iterating-over-them
		delete this.initializedComponents[componentId];
		this.numberOfInitializedComponents--;
	}


	/**
	 * Destroy inaitialized components that no longer are active
	 * @private
	 * @param {Object} activeComponents - All componentIds currently found in the DOM
	 */
	cleanUp_(activeComponents = {}) {
		Object.keys(this.initializedComponents).forEach( (componentId) => {
			if (!activeComponents[componentId]) {
				this._destroyComponent(componentId);
			}
		});
	}


	/**
	 * Generates a rfc4122 version 4 compliant unique ID
	 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	 * @private
	 */
	_generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
}

// Export AMD, CommonJS/ES6 module or assume global namespace
if (typeof define !== 'undefined' && define.amd) {
	define([], ComponentLoader);
}
else if (typeof module !== 'undefined' && module.exports) {
	module.exports = ComponentLoader;
}
else {
	window.ComponentLoader = ComponentLoader;
}