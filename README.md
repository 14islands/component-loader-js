[![Build Status](https://travis-ci.org/14islands/component-loader-js.svg?branch=master)](https://travis-ci.org/14islands/component-loader-js)

# component-loader-js

This module is a lightweight JavaScript component loader implemented and exposed as a ES2015 (ES6) module _(an ES5 version is provided in the compiled lib/ folder)_.


## How it works
Components are detected in the markup using the `data-component` attribute and matching JavaScript components are automatically instantiated.

`<div data-component="Header">` => `new Header()`


## Benefits & Features
This approach is great for organising self contained components and very useful for CMS scenarios where components may be moved between pages at any time without modifying the JavaScript.

The componentLoader will instantiate a JavaScript component for each instance found in the markup.

```html
<div data-component="Header">
	<div data-component="MyOtherComponent"></div>
</div>
```

*Instantiates both `Header` and `MyOtherComponent`*


### Register multiple components on the same DOM element.

```html
<div data-component="Header MyOtherComponent"></div>
```


### Supports having multiple instances of the same component on a page.

```html
<div data-component="Header"></div>

<div data-component="Header"></div>
```

*Creates two unique instances of `Header`*


### Easy communication between components using built in pub/sub

```JavaScript
import {Component} from 'component-loader-js';

// publishing custom event to any registered listener
class PubComponent extends Component {
	constructor() {
		super(...arguments);
		this.el.addEventListener('click', () => {
			// trigger event when DOM element is clicked
			this.publish('custom-event', {foo: 'bar'});
		});
	}
}

// Subscribing to a custom event
class SubComponent extends Component {
	constructor() {
		super(...arguments);
		this.subscribe('custom-event', (data) => {
			// react to custom event and optional data
		});
	}
}
```


## Installing
Install using npm.

### NPM
`$ npm install component-loader-js`

```JavaScript
// import the ES2015 module
import ComponentLoader, {Component} from 'component-loader-js';
const componentLoader = new ComponentLoader();
```


## Writing a component
We provide a component base class that you can extend to be up and running in no time.

```JavaScript
import {Component} from 'component-loader-js';

class Header extends Component {

	constructor() {
		super(...arguments);
	}

	destroy() {
		super.destroy();
	}

}
```


## Registering components
 
To register a component with the componentLoader, pass it to the constructor() as an object {componentName: classDefenition}. You can register multiple components at the same time.
 
```JavaScript
new ComponentLoader({
	Header,
	MyOtherComponent
}); 
```


## Detecting/instantiating components
Use the `scan()` function to tell the component loader to scan the DOM and initialize newly detected components and destroy previously instantiated components that have been removed from the markup. 

```JavaScript
// call scan() on your ComponentLoader instance
componentLoader.scan();
```

**IMPORTANT** Make sure to call `scan()` on page load and whenever you modify the markup - for instance after using AJAX/PJAX to load a new page and replace the markup.



## Full example

Example of registering a component and scanning the document

```html
<div data-component="Header"></div>
```


```JavaScript
import ComponentLoader, {Component} from 'component-loader-js';

class Header extends Component {

	constructor() {
		super(...arguments);
		// use `this.el` to access the containing DOM element
	}

	destroy() {
		super.destroy();
	}
}

// Register component
const componentLoader = new ComponentLoader({Header});

// Scan for components on page load
document.addEventListener("DOMContentLoaded", function(event) { 
	// call scan() to instantiate any components found in the DOM
	componentLoader.scan();
});
```


## API Docs

### ComponentLoader instance methods

`ComponentLoader(componentsHash, context)`
- Constructor. 

- `componentHash` - Optional collection of available components: {componentName: classDefinition}
- `context` - Optional DOM node to search for components. Defaults to document.


`scan(data)` 
- Scan the DOM, initialize new components and destroy removed components. Call this on page load and whenever you modify the markup - for instance after using PJAX to load new page.

- `data` - is optional and will be passed to the component constructor.

`register(componentsHash)`
- Add component(s) to collection of available components

`unregister(componentName)`
- Remove component from collection of available components

`publish(topic, args...)`
- Publish an event to other components

`subscribe(topic, callback, context)`
- Subscribe to an event from other components

`unsubscribe(topic, callback)`
- Unsubscribe from an event from other components



### Component base class instance methods

A base Component is provided which can be extended to get access to the following methods:

`Component(context, data, mediator)`
- Called the first time a component is found in the markup. (note: a `scan()` must be explicitly called on the ComponentLoader for a component to be detected). 

- `context` - DOM node that contains the component markup
- `data`- data object from ComponentLoader.scan()
- `mediator` - instance of ComponentLoader for pub/sub
- **NOTE:** Simply call `super(...arguments);` at the top of your constructor if you are extending the provided base component.


`destroy()`
- Called when an instantiated component is no longer found in the markup. (note: a `scan()` must be explicitly called for this method to be triggered)

`publish(topic, args...)`
- Publish an event to other components

`subscribe(topic, callback)`
- Subscribe to an event from other components

`unsubscribe(topic, callback)`
- Unsubscribe from an event from other components

`scan()`
- Alias for `ComponentLoader.scan()`



## Browser support
ComponentLoader uses vanilla Javascript compatible with IE9 and up when using the ES5 version.

To run the ES6 version we recommend https://babeljs.io/


## Authors
- David Lindkvist [@ffdead](https://twitter.com/ffdead)
- Marco Barbosa [@MarcoBarbosa](https://twitter.com/MarcoBarbosa)
- Hjörtur Hilmarsson [@hjortureh](https://twitter.com/hjortureh)
