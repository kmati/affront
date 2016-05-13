# affront.js

Affront.js is a client-side library that aims to be:

* Simple (above all else)
* Modern
* Natively JavaScript (er, es2015, that is...)

As such Affront.js will avoid extra syntax like JSX and will, rather, favor native JavaScript templating mechanisms.

# Parts of Affront

The parts of Affront are:

1. Store
2. Router
3. Components


## Store

There is a single Store in Affront which is the so-called "single source of truth". This idea is inspired from Redux. The Store provides the following functionality:

* You can set items in the store (key/value)
* You can subscribe to receive notifications whenever items with specified keys are set
* The Store can optionally preserve version history for each change

## Router

There is a single Router in Affront which is responsible for client-side routing. When a route changes, the Router sets URL related info into the Store.

## Components

A component is basically a class that can render (or perform arbitrary function execution) based on notifications from the [Store](./lib/Store) or from changes in the route from the [Router](./lib/Router.js). Each component specifies a route upon which the component is to be invoked. This means that you can specify that Component A responds to /path/A and Component B responds to /path/B. In this case, Component A will appear when the route is /path/A while Component B is hidden.

The routes for the components follow the convention typically used in Express:

```
/static-path/:arg/other-path/:other-arg
```

where ```:arg``` and ```:other-arg``` specify route parameters.

### Cardinality

There can be more than 1 component instance of the same Component. This is because a Component is a class.

### Component Hierarchy

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

#### NonVisualComponent

Derive from the NonVisualComponent if you want a component to respond to Store notifications and NOT perform UI functionality. Though there is nothing explicitly limiting you from using the NonVisualComponent for UI rendering, it would not be the easiest way of doing things.

#### ViewComponent

Derive from the ViewComponent if you want a component to perform UI rendering and that responds to Store notifications. However, there is no templating provided at this level. If you have a simple UI and don't need templating then you can use this class.

#### TemplateViewComponent

Derive from the TemplateViewComponent if you want a component to perform UI rendering with templates and that responds to Store notifications. More than likely, this is what you will want to derive from if you have an UI.

The templating is done using [mustache.js](https://github.com/janl/mustache.js) so whatever you can do in mustache, you can do in Affront. For reference on mustache template substitution see the [mustache man page](http://mustache.github.io/mustache.5.html).

# Examples that show how to use Affront

Go to [https://github.com/kmati/affront-examples](https://github.com/kmati/affront-examples) for the examples.
