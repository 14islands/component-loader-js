# component-loader

This module is a lightweight JavaScript component loader implementing and exposed as a module using ES2015 (ES6) syntax. It instantiates JavaScript classes when their name is found in the DOM.

An ES5 version is provided in the dist/es5/ folder.

Components are detected in the markup using the data-component attribute.

Example: ```<div data-component="Header">```
 
To register a component with the componentLoader, either pass it to the constructor() or the register() function as an object {componentName: classDefenition}.
 
Example: ```new ComponentLoader({Header});```

Or: ```componentLoader.register({Header});```

This approach is great for organising self contained components and very useful for CMS scenarios where components may be moved between pages at any time without modifying the JavaScript.

The componentLoader will instantiate a new component for each instance of the class in the markup.
* You can have multiple instances of the same component on a page.
* You can also have multiple components registered on the same DOM element.


## ComponentLoader Methods

**ComponentLoader.scan()**
- Scan the DOM, initialize new components and destroy removed components. Call this on page load and whenever you modify the markup - for instance after using PJAX to load new page.

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

**Component.constructor(context, data, mediator)**
- Called the first time a component is found in the markup. (note: scan() must be explicitly called on the ComponentLoader on page load)

**Component.destroy()**
- Called when an instantiated component is no longer found in the markup. (note: scan() must be explicitly called)

**Component.publish(topic, args...)**
- Publish an event to other components

**Component.subscribe(topic, callback)**
- Subscribe to an event from other components

**Component.unsubscribe(topic, callback)**
- Unsubscribe from an event from other components



## Browser support
ComponentLoader uses vanilla Javascript compatible with IE8 and up.


## Authors
- David Lindkvist [@ffdead](https://twitter.com/ffdead)
- Marco Barbosa [@MarcoBarbosa](https://twitter.com/MarcoBarbosa)
- Hjörtur Hilmarsson [@hjortureh](https://twitter.com/hjortureh)