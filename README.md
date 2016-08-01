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
  
  // Basically options is an array of 'Object' or 'Array', 
  // we first searching value starting from zero index, 
  // the first 'Object' or 'Array', if the value can't be found, 
  // then it will start searching to the next array value and so on, 
  // basically '.front' is array.unshift, while '.behind' is array.push 
  
  // .behind
  
  // params:
  // 1. options( Object, Array )
  options.behind( thirdObject );
  
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


