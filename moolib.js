(function( $ ) {
  'use strict';

  $.mooLib = {};

  $.mooLib.createID = function( name ) {
    return {
      name: name
    };
  };

  $.mooLib.isCreationOf = function( obj, id ) {
    return obj && typeof obj === 'object' && obj.ID === id;
  };

  $.mooLib.options = {};
  $.mooLib.options.ID = $.mooLib.createID();

  $.mooLib.options.create = function( options ) {
    var privateObj =  {},
        obj = {};

    obj.optionStream = [];

    obj.ID = $.mooLib.options.ID;

    $.extend( obj, {
      // grab each option property where propertyName === name
      // returning an array of the resulting value
      grabEach: function( name ) {
        var stream = obj.optionStream,
            options = [];

        stream.forEach( function( obj ) {
          var option = grabOption( name, obj );

          options.push( option );
        });

        return options;
      },

      // get returned property value where propertyName of each obj === name
      // returning new instanceof Options and pushing each returned property as the option stream
      getEach: function( name ) {
        var stream = obj.grabEach( name ),
            options = $.mooLib.options.create();

        stream.forEach( function( obj ) {
          options.behind( obj );
        });

        return options;
      },

      // arr is array
      // try to create new Options instance where each array value will be added as Options stream
      tryToCreate: function( arr ) {
        if ( $.isArray(arr) ) {
          return $.mooLib.options.create( arr );
        }

        return arr;
      },

      // just ordinary push value
      behind: function( input ) {
        input = this.tryToCreate( input );

        if ( input && typeof input === "object" || $.mooLib.isCreationOf( input, $.mooLib.options.ID ) ) {
          obj.optionStream.push( input );
        }

        return obj;
      },

      // unshift value to the stream
      front: function( input ) {
        input = this.tryToCreate( input );

        if ( input && typeof input === "object" || $.mooLib.isCreationOf( input, $.mooLib.options.ID ) ) {
          obj.optionStream.unshift( input );
        }

        return obj;
      },

      // grab value
      // ie: $name === 'a.b'
        // will look for property 'a'
        // and if the returned 'a' are object or Options instance, will for 'b' in the object context
        // the returning value of 'b' will be pushed to the new option stream instance
        // if the first option stream didnt have 'a' or 'a.b'
        // it will look for it on the next option stream
      grab: function( name ) {
        var value;

        obj.optionStream.every( function( obj ) {
          value = grabOption( name, obj );

          if ( value !== undefined ) {
            return false;
          }

          return true;
        });

        return value;
      }
    });

    populateOptionStream( obj, options );

    function populateOptionStream( obj, options ) {
      if ( $.isArray(options) ) {
        options.forEach( function( option ) {
          obj.behind( option );
        });
      } else {
        obj.behind( options );
      }
    }
    // name can be "string" or [ "string", "string", "string" ]
    // obj can be plain object or instanceof Options
    function grabOption( name, obj ) {
      if ( !name ) {
        return;
      } else if ( typeof name === 'string' ) { // name == "a.b" will become [ "a", "b" ]
        name = name.split('.');
      }

      if ( $.mooLib.isCreationOf( obj, $.mooLib.options.ID ) ) {
        return obj.grab( name );
      } else if ( !name.length || !obj || typeof obj !== "object" ) {
        return undefined
      } else if ( name.length === 1 ) { // name == [ "a" ], get "a" property from the obj
        return obj[ name ];
      } else {
        // recursion
        return grabOption( name.slice(1), obj[ name[0] ] );
      }
    };

    return obj;
  };

  $.mooLib.eventDispatcher = {};

  $.mooLib.eventDispatcher.basicEvent = {};
  $.mooLib.eventDispatcher.basicEvent.ID = $.mooLib.createID();
  $.mooLib.eventDispatcher.basicEvent.create = function() {
    var obj = {};

    obj.callbacks = [];

    $.extend( obj, {
      bind: function( callback ) {
        if ( $.isFunction( callback ) ) {
          obj.callbacks.push( callback );
        }
      },

      unbind: function( callback ) {
        if ( $.isFunction( callback ) ) {
          $.each( obj.callbacks, function( key, definedCallback ) {
            if ( definedCallback === callback ) {
              obj.callbacks.splice( key, 1 );
            }
          });
        } else {
          obj.callbacks = [];
        }

        return obj;
      },

      once: function( callback ) {
        var newCallback;

        if ( $.isFunction( callback ) ) {
          newCallback = function( data ) {
            callback.call( this, data );

            obj.unbind( newCallback );
          };

          obj.bind( newCallback );
        }

        return obj;
      },

      dispatch: function( data, context ) {
        var i = obj.callbacks.length,
            callback;

        while ( i-- ) {
          callback = obj.callbacks[i];

          if ( callback ) {
            callback.call( context, {
              response: data
            });
          }
        }

        return obj;
      }
    });

    return obj;
  };

  $.mooLib.eventDispatcher.ID = $.mooLib.createID();
  $.mooLib.eventDispatcher.create = function() {
    var obj = {};

    obj.eventContainer = {};

    $.extend( obj, {
      createEventContainer: function( eventName ) {
        if ( !(eventName in obj.eventContainer) ) {
          obj.eventContainer[ eventName ] = $.mooLib.eventDispatcher.basicEvent.create();
        }

        return obj.eventContainer[ eventName ];
      },

      bindAllWith: function( eventNames, callback ) {
        if ( $.isArray( eventNames ) ) {
          $.each( eventNames, function( key, eventName ) {
            obj.bind( eventName, callback );
          });
        }

        return obj;
      },

      multipleBind: function( events ) {
        if ( $.isPlainObject( events ) ) {
          $.each( events, function( eventName, callback ) {
            obj.bind( eventName, callback );
          });
        }

        return obj;
      },

      once: function( eventName, func ) {
        var evtContainer = obj.createEventContainer( eventName );

        return evtContainer.once( func );
      },

      bind: function( eventName, func ) {
        var evtContainer = obj.createEventContainer( eventName );

        return evtContainer.bind( func );
      },

      unbind: function( eventName, callback ) {
        var evtContainer = obj.createEventContainer( eventName );

        evtContainer.unbind( callback );

        return obj;
      },

      dispatch: function( eventName, data ) {
        if ( eventName in obj.eventContainer ) {
          obj.eventContainer[ eventName ].dispatch( data );
        }

        return obj;
      }
    });

    return obj;
  };

  $.mooLib.sliceArguments = function( args, startFrom, endFrom ) {
    return Array.prototype.slice.call( args, startFrom, endFrom );
  };

  $.mooLib.applyFunction = function( func, context, args ) {
    if ( $.isFunction(func) ) {
      return func.apply( context, args );
    }
  };

  $.mooLib.callFunction = function( func, context ) {
    return $.mooLib.applyFunction( func, context, $.mooLib.sliceArguments( arguments, 2 ) );
  };

  $.mooLib.timeoutInterval = function( func, interval ) {
    var data = {
          id: null,
          dontResume: false
        };

    data.dontResume = $.mooLib.callFunction( func, null, clear );

    go();

    function go() {
      if ( !data.dontResume ) {
        data.id = setTimeout( function() {
          data.dontResume = $.mooLib.callFunction( func, null, clear );

          go();
        }, interval );
      }
    }

    function clear() {
      clearTimeout( data.id );
    }
  };

  $.mooLib.asyncAll = function( promises ) {
    var deferred = $.Deferred(),
        i = 0,
        output = [],
        promisesLength;

    var resolve = function( key, data ) {
      output[ key ] = data;

      i++;

      if ( i === promisesLength ) {
        deferred.resolve( output );
      }
    };

    if ( !$.isArray(promises) ) {
      promises = [ promises ];
    }

    promisesLength = promises.length;

    if ( !promisesLength ) {
      deferred.resolve();

      return deferred.promise();
    }

    $.each( promises, function( key, promise ) {
      $.when( $.isFunction(promise) && promise() || promise )
      .then( function( output ) {
        resolve( key, output );
      })
      .progress( function( data ) {
        deferred.notify( data );
      })
      .fail( function( data ) {
        deferred.fail( data );
      });
    });

    return deferred.promise();
  };

  $.mooLib.deferSyncFirst = {};
  $.mooLib.deferSyncFirst.ID = $.mooLib.createID();
  $.mooLib.deferSyncFirst.create = function( promises ) {
    var obj = {};

    obj.ID = $.mooLib.deferSyncFirst.ID;
    obj.i = 0;
    obj.deferred = $.Deferred();
    obj.promises = getPromises( obj, promises );

    $.extend( obj, {
      load: function() {
        var defer = obj.deferred,
            promisesLength = obj.promises.length,
            promise;

        if ( defer.state() !== "resolved" && obj.i < promisesLength  ) {
          promise = this.promises[ obj.i++ ];

          $.when( $.isFunction(promise) && promise() || promise )
          .then( function( output ) {
            defer.resolve( output );
          })
          .progress( function( data ) {
            defer.notify({
              type: "progress",
              data: data
            });
          })
          .fail( function( data ) {
            if ( obj.i < promisesLength && defer.state() !== "resolved" ) {
              defer.notify({
                type: "failure",
                data: data
              });

              obj.load();
            } else {
              defer.fail( data );
            }
          });
        }

        return obj;
      }
    });

    obj.load();

    function getPromises( obj, promises ) {
      return !$.isArray( promises ) ? [ promises ] : promises;
    }

    return obj;
  };

  $.mooLib.deferSyncFirstPromise = function( promises ) {
    return $.mooLib.deferSyncFirst.create( promises ).deferred.promise();
  };

  $.mooLib.createHolder = function( callback, stopCallback ) {
    var properties = {},
        methods = {};

    properties.length = 1;

    methods.pleaseWait = function() {
      properties.length = properties.length + 1;

      return this;
    };

    methods.pleaseGo = function() {
      properties.length = properties.length - 1;

      if ( !properties.length && typeof callback === 'function' ) {
        callback();
      }
    };

    methods.stopCallbacks = [];

    methods.onStop = function( callback ) {
      if ( typeof callback === 'function' ) {
        methods.stopCallbacks.push( callback );
      }
    };

    methods.stop = function() {
      methods.stopCallbacks.forEach( function( callback ) {
        callback();
      });

      methods.timeoutIds.forEach( function( id ) {
        clearTimeout( id );
      });

      methods.intervalIds.forEach( function( id ) {
        clearInterval( id );
      });

      if ( typeof stopCallback === 'function' ) {
        stopCallback();
      }

      methods = null;
    };

    methods.timeoutIds = [];

    methods.timeout = function( callback, duration ) {
      var id = setTimeout( callback, duration );

      methods.timeoutIds.push( id );

      return id;
    };

    methods.intervalIds = [];

    methods.interval = function( callback, duration ) {
      var id = setInterval( callback, duration );

      methods.intervalIds.push( id );

      return id;
    };

    return {
      interval: methods.interval,
      timeout: methods.timeout,
      onStop: methods.onStop,
      stop: methods.stop,
      pleaseWait: methods.pleaseWait,
      pleaseGo: methods.pleaseGo
    };
  };

  $.mooLib.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.WebkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.MozRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.MsRequestAnimationFrame;
  // check css transform support
  (function() {
    var $element = $( "<div>" ),
        value = "",
        preserve3d = "";

    $element.css({
      transformStyle: "preserve-3d",
      transform: "translateZ(150px)"
    });

    $.mooLib.support3d = false;
    $.mooLib.support2d = false;
    $.mooLib.preserve3d = false;

    document.body.appendChild( $element[0] );

    preserve3d = $element.css( "transform-style" );
    value = $element.css( "transform" );

    if ( preserve3d === "preserve-3d" ) {
      $.mooLib.preserve3d = true;
    }

    if ( value.match("matrix3d") ) {
      $.mooLib.support3d = true;
      $.mooLib.support2d = true;
    } else {
      $element.css({
        transform: "translateX(150px)"
      });

      value = $element.css( "transform" );

      if ( value.match("matrix") ) {
        $.mooLib.support2d = true;
      }
    }

    document.body.removeChild( $element[0] );
  })();

})( jQuery );
