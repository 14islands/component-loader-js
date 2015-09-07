# component-loader

This module is a lightweight JavaScript component loader implementing and exposed as a module using ES2015 (ES6) syntax. It instantiates JavaScript classes when their name is found in the DOM.

An ES5 version is provided in the dist/es5/ folder.

Components are detected in the markup using the data-component attribute.

Example: ```<div data-component="Header">```
 
To register a component with the componentLoader, either pass its class to the constructor() or the register() function as an object {componentName: classDefenition}. You can register multiple components at the same time.
 
Example: ```new ComponentLoader({Header});``` or ```componentLoader.register({Header});```


_or using ES5 syntax: ```new ComponentLoader({Header: Header});```_


This approach is great for organising self contained components and very useful for CMS scenarios where components may be moved between pages at any time without modifying the JavaScript.

The componentLoader will instantiate a new component for each instance of the class in the markup.

* You can have multiple instances of the same component on a page.
* You can also have multiple components registered on the same DOM element.


## ComponentLoader Methods

**ComponentLoader.constructor(componentsHash, context)**
- Constructor. 

- `componentHash` - Optional collection of available components: {componentName: classDefinition}
- `context` - Optional DOM node to search for components. Defaults to document.


**ComponentLoader.scan(data)** 
- Scan the DOM, initialize new components and destroy removed components. Call this on page load and whenever you modify the markup - for instance after using PJAX to load new page.

- `data` - is optional and will be passed to the component constructor.

**ComponentLoader.register(componentsHash)**
- Add component(s) to collection of available components

**ComponentLoader.unregister(componentName)**
- Remove component from collection of available components

**ComponentLoader.publish(topic, args...)**
- Publish an event to other components

**ComponentLoader.subscribe(topic, callback, context)**
- Subscribe to an event from other components

**ComponentLoader.unsubscribe(topic, callback)**
- Unsubscribe from an event from other components



## Component Methods

A base Component is provided which can be extended to get access to the following methods:

**Component.constructor(context, data, mediator)**
- Called the first time a component is found in the markup. (note: a `scan()` must be explicitly called on the ComponentLoader for a component to be detected). 

- `context` - DOM node that contains the component markup
- `data`- data object from ComponentLoader.scan()
- `mediator` - instance of ComponentLoader for pub/sub
- **NOTE:** Simply call `super(...arguments);` at the top of your constructor if you are extending the provided base component.


**Component.destroy()**
- Called when an instantiated component is no longer found in the markup. (note: a `scan()` must be explicitly called for this method to be triggered)

**Component.publish(topic, args...)**
- Publish an event to other components

**Component.subscribe(topic, callback)**
- Subscribe to an event from other components

**Component.unsubscribe(topic, callback)**
- Unsubscribe from an event from other components

**Component.scan()**
- Alias for `ComponentLoader.scan()`



## Browser support
ComponentLoader uses vanilla Javascript compatible with IE8 and up.


## Authors
- David Lindkvist [@ffdead](https://twitter.com/ffdead)
- Marco Barbosa [@MarcoBarbosa](https://twitter.com/MarcoBarbosa)
- Hjörtur Hilmarsson [@hjortureh](https://twitter.com/hjortureh)