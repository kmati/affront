# Component Modules

The components all derive from the ```ComponentBase``` class. The ```ComponentBase``` class provides the basic functionality that defines a component in Affront. Please note that a component is a logical abstraction that is bound to a client-side route and does not have to be visible.

To implement a component, all you need to do is create a class that extends one of the following classes:

* NonVisualComponent: for non-visual components
* ViewComponent: for visual components that do not use templates
* TemplateViewComponent: for visual components that use templates


## Routing and Components: Why?

The idea behind associating components with client-side routes is simple: it allows you to specify which sections of a single page app should appear for different client-side routes. When the route changes the components will be rendered or hidden based on the route matching.


## Cardinality

There can be more than 1 component instance of the same Component. This is because a Component is a class.

## Component Hierarchy

The base class for all components is ```ComponentBase``` and all components, ultimately, derive from it. The full hierarchy of components is as follows:

```
                ComponentBase
                      |
                      |
                      v
        +-------------+-------------+
        |                           |
        |                           |
        v                           v
 NonVisualComponent           ViewComponent
                                    |
                                    |
                                    v
                           TemplateViewComponent
```

When you create a Component, you should derive from any of the classes shown above.

### NonVisualComponent

Derive from the NonVisualComponent if you want a component to respond to Store notifications and NOT perform UI functionality. Though there is nothing explicitly limiting you from using the NonVisualComponent for UI rendering, it would not be the easiest way of doing things.

### ViewComponent

Derive from the ViewComponent if you want a component to perform UI rendering and that responds to Store notifications. However, there is no templating provided at this level. If you have a simple UI and don't need templating then you can use this class.

### TemplateViewComponent

Derive from the TemplateViewComponent if you want a component to perform UI rendering with templates and that responds to Store notifications. More than likely, this is what you will want to derive from if you have an UI.

The templating is done using [mustache.js](https://github.com/janl/mustache.js) so whatever you can do in mustache, you can do in Affront. For reference on mustache template substitution see the [mustache man page](http://mustache.github.io/mustache.5.html).
