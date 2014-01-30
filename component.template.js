/**
 * Template Component
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

/*
 * Component scope
 */
(function ($) {	
	
	/*
	 * Demo Component
	 */
	components.TemplateComponent = function (context) {
			
		// public api object
		var api	= {};

		/**
		 * Private function
		 **/
		function myPrivateFunction() {
			console.log('TemplateComponent.myPrivateFunction')
		};

		/**
		 * Initializes the component - Called by ComponentLoader for each instance found on page.
		 * 
		 **/
		api.init = function () {			
			console.log('TemplateComponent.init');
		};

		/**
		 * Function called by the component loader when it's time to render
		 *  - only called if component was :visible
		 * This function is not called if component is display:none - for instance hidden in an inactive tab-controller. 
		 * Call ComponentLoader.notifyAll() to trigger all hidden components to render when visibility changes.
		 **/
		api.render = function () {			
			console.log('TemplateComponent.render');
			myPrivateFunction();
		};
		
		// returns public methods 
		// to the world outside
		return api;
		
	}; 
	
	/*
	 * Register the component 
	 */
	ComponentLoader.register("templatecomponent", components.TemplateComponent);
	

}(jQuery));

