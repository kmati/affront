# Store

There is a single store of data that is to be used as a core part of Affront. This is the [Store](./index.js). The Store is at the core of Affront in that the [Http module](../Http) as well as the [Router](../Router.js) affect the data that is to be used in the client-side app. Not only so, but the components and other client-side code may also set items in the Store.

## Getting and Setting Items

You can get and set items into the Store using the following methods (among others):

```
* getItem(key, version) -> StoreItem
* setItem(key, value) -> StoreItem
```
