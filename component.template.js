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
	Components.TemplateComponent = function (context) {
			
		// public api object
		var api	= {};

		/**
		 * Private function
		 **/
		function myPrivateFunction() {
			console.log('TemplateComponent.myPrivateFunction')
		};

		/**
		 * Initializes the header component 
		 * 
		 **/
		api.init = function () {			
			console.log('TemplateComponent.init');
		};

		/**
		 * Function called by the component loader when it's time to render
		 *
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
	ComponentLoader.register("templatecomponent", Components.TemplateComponent);
	

}(jQuery));

