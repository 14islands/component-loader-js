component-loader
================

A generic lightweight framework for instantiating JavaScript component based on whether they are found in the markup.

Components are detected in the markup using a CSS class name of the format js-component-{component name}

Example: <div class="js-component-header" >
 
To register a component with the componentLoader the register function needs to be called with a parameter for {CSS component name} and {constructor function}
 
Example: ´´componentLoader.register("header", components.Header);´´

This approach is extra useful for CMS scenarios where components may be moved between pages at any time.

** Note:** You can have multiple instances of the same component on a page. The componentLoader will instantiate a new component for each instance of the class in the markup. Be sure to test your components for this scenario.

Methods
=====
**componentLoader.initializeComponents()**
- To detect and load components on the page

**componentLoader.register()**
- To register a component

**componentLoader.checkForNewComponents**
- To detect new components injected after page load

Global component namespace
=====
**window.components**
- The default global namespace for your components. You can change this to anything you like - there are no dependencies on this namespace in the componentLoader.

Dependencies
====
jquery-1.4+


Authors
====
- Hjörtur Hilmarsson
- David Lindkvist
- Marco Barbosa
- Paul Lewis
