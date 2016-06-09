# Http

The Http module is used within Affront to make Http requests. The extra benefit of using the Http module (as opposed to an external Http library) is that the Http module conveniently sets Store items with the results from the Http requests. This means that in a single invocation you can:

1. Make an Http request
2. Get the Http response data and set it in a Store Item, which leads automatically to:
3. A notification is sent out to the listeners who have subscribed to listen for notifications from the Store item

Yes, you could "roll your own" but you'd have to do all 3 yourself.

## BaseUri

You can get or set the ```BaseUri``` property of the Http module so that you do not have to enter the base uri with each subsequent Http request.

## MinimumKeyedRequestThreshold

You can get or set the ```MinimumKeyedRequestThreshold``` property of the Http module. If the ```MinimumKeyedRequestThreshold``` property has a positive non-zero number it specifies the minimum # of milliseconds that the Http module will withhold GET requests for a keyed request. Keyed requests specify the key for which a Store item will be set with the results of the GET request. The idea is to use the Store as a limited-time cache for requested data.

## Request Methods

The supported Http methods are:

* GET
* POST
* PUT
* DELETE
* PATCH

Only GET provides support for request caching using the ```MinimumKeyedRequestThreshold``` property.
 