# Control

A Control is an object that can be used as part of a visual Component which is derived from [ViewComponent](../Component/ViewComponent.js) or [TemplateViewComponent](../Component/TemplateViewComponent.js).

The main difference between a component and a control is that components are bound to routes while controls are not. The idea is that 1 component can contain multiple controls.

The second difference between components and controls is that components cannot contain other components; however, controls can. This means that 1 component can have multiple controls, each of which contains other sub-controls.

To use the controls you must derive from either of the [ViewComponent](../Component/ViewComponent.js) or the [TemplateViewComponent](../Component/TemplateViewComponent.js) classes. It is preferable to use controls with a component that derives from [TemplateViewComponent](../Component/TemplateViewComponent.js).
