# moolib
jQuery based utility library

## PUBLIC API

###### $.mooLib.options.create

*ceating object accessor, personally use it to creating jQuery plugin options, for accessing an user input options without necessarily modify the original object or extending it*

Usage:

```javascript
  // lets say we have two object
  var firstObject = {
    city: 'Yogyakarta',
    country: 'Indonesia'
    year: 1994
  };
  
  var secondObject = {
    city: 'Jakarta',
    country: 'Indonesia',
    year: 1885
  };
  
  var thirdObject = {
    city: 'Malang',
    country: 'Indonesia',
    year: 159,
    province: 'Jawa Timur'
  };
  
  // initialize
  
  // params:
  // 1. options( Object, Array )
  var options = $.mooLib.options.create( firstObject );
  
  // options.stream will be [ firstObject ]
  
  // ***** API ***** //
  
  // .grab
  
  // params:
  // 1. propertyName( String )
  
  options.grab('city') 
  // return 'Yogyakarta'
  
  // .front
  
  // params:
  // 1. options( Object, Array )
  options.front( secondObject );
  
  options.grab('city')
  // return 'Jakarta'
  
  // options.stream will be [ secondObject, firstObject ]
  
  // Basically options is an array of 'Object' or 'Array', 
  // we first searching value starting from zero index,
  // the first 'Object' or 'Array', if the value can't be found, 
  // then it will start searching to the next array value and so on, 
  // basically '.front' is array.unshift, while '.behind' is array.push 
  
  // Demo
  var propertyName = "testingProperty";
  var array = [ "A", "B", "C" ];
  // it will search 'propertyName' in A, 
  // if propertyName exists, it will return A[ propertyName ] value
  // if not, it will searching into the next array and so on, ie: to "B", to "C"
  
  // .behind
  
  // params:
  // 1. options( Object, Array )
  options.behind( thirdObject );

  // options.stream will be [ secondObject, firstObject, thirdObject ]
  
  options.grab('province')
  // return 'Jawa Timur'
  
  // .grabEach
  // get value of propertyName in every Object available, returning an Array
  
  // params:
  // 1. propertyName( String )
  options.grabEach( 'country' );
  // will return [ 'Indonesia', 'Indonesia', 'Indonesia' ]
  // returning an Empty Array if value cant be found on every Object
  
  
  // ***** API ***** //
```


###### $.mooLib.eventDispatcher.create

*Ordinary event dispatcher, just for personal use, hehehe*

Usage:

```javascript
  // initialize
  var eventDispatcher = $.mooLib.eventDispatcher.create(),
      objTest = {};
      
  objTest.a = 1;
  
  function addCallback( value ) {
    objTest.a += value.response || 1;
  }
  
  function subCallback( value ) {
    objTest.a -= value.response || 1;
  }
  // .bind
  // bind function to a specific event
  // params:
  // 1.eventName( String )
  // 2.callback( Function ) function to be called when the event get triggered
  eventDispatcher.bind( 'add', addCallback );
  eventDispatcher.bind( 'sub', subCallback );
  
  // callback will invoked with object as the first parameter
  // and have 'response' property that filled with value
  // from dispatch parameter
  
  // .dispatch
  
  // params: 
  // eventName( String )
  // response( * )
  eventDispatcher.dispatch( 'add', 2 ); 
  objTest.a;
  // 3
  
  eventDispatcher.dispatch( 'sub', 3 );
  objTest.a;
  // 0
  
  // .unbind
  // remove event handler
  // params:
  // 1.eventName( String )
  // 2.specificCallback( Function ):Optional
  eventDispatcher.unbind( 'add' ); // will remove every callback that binding 'add' event
  eventDispatcher.unbind( 'add', addCallback ); // will remove 'addCallback' from remove handler list
  
  // .once
  // call event handler one time
  // params:
  // 1.eventName( String )
  // 2.callback( Function )
  eventDispatcher.once( 'add', addCallback );
  
  objTest.a = 1;
  
  eventDispatcher.dispatch( 'add', 3 );
  objTest.a; 
  // 4
  
  eventDispatcher.dispatch( 'add', 3 );
  objTest.a;
  // 4
  // 'addCallback' handler are removed from callback list
  
  // .multiBind
  // just .bind with object as parameter
  // params: 
  // obj( Object )
  eventDispatcher.multipleBind({
  // eventName: handler //
    'add': addCallback,
    'sub': subCallback
  });
  
  function sayHello() {
    console.log("HELLO");
  }
  
  // .bindAllWith
  // bind desired events with the same callback
  // params: 
  // 1.eventNames( Array ), array of event names
  // 2.callback( Function )
  eventDispatcher.bindAllWith([ 'add', 'sub' ], sayHello);
  
  eventDispatcher.dispatch('add', 2);
  // console "HELLO"
  objTest.a; // 6
  
  eventDispatcher.dispatch('sub', 4);
  // console "HELLO"
  objTest.a; // 2
```

###### $.mooLib.sliceArguments

*Slice Object Array Like, behave like array.slice*

see: [Array.Prototype.Slice](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

```javascript
  function test() {
    return $.mooLib.sliceArguments( arguments, 1 ); 
  }
  
  test( 1, 2, 3 );
  // will return [ 2, 3 ]
```

###### $.mooLib.applyFunction | $.mooLib.callFunction

*A Function.prototype.apply/call but not throwing error when the given argument are not a function*

Params:
- function( Function )
- context( * ), the 'this'
- arguments( * )

see: [Function.prototype.apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

Usage:

```javascript
  $.mooLib.applyFunction( function() {}, null, [ 1, 2,3 ] );
  $.mooLib.callFunction( function() {}, null, 1, 2, 3 );
```

###### $.mooLib.asyncAll

*Similiar to Promise.all, resolve when every promises has been resolved, if one promise fail, the asyncAll fail*

Usage:

```javascript
  // params:
  // 1.promises ( array of promises/function that return a promise or any type of data )
  
  // return: jQuery deferred.promise()
  
  $.mooLib.asyncAll([ jQuery.Deferred(), funcThatReturnJqueryDeferredPromise ]);
```

###### $.mooLib.deferSyncFirst.create

*Syncronious jQuery Promise that take promises as an arguments, and resolve/reject when a promise get resolved/rejected*

Usage:

```javascript
  var ArrayOfPromisesExample = [ aPromise, bPromise, cPromise ]
  // take array of jQuery promises as an argument
  var deferred = $.mooLib.deferSyncFirst( arrayOfPromisesExample );
  // if aPromise get resolved, the 'deferred' get resolved
  // if aPromise get rejected, it will run bPromise and
  // iterating with the same action trough every promises
  // if the last promise get rejected ( ie: cPromise ),
  // 'deferred' will get a rejection from cPromise
```



