//===========================================================================
// email-validator-pro (npm)
//===========================================================================

/**
 * email-validator-pro - github.com/grafluxe/email-validator-pro
 * @license email-validator-pro github.com/grafluxe/email-validator-pro/blob/master/LICENSE.md
 */

//===========================================================================
// is-reachable (npm)
//===========================================================================

/**
 * is-reachable - github.com/sindresorhus/is-reachable
 * @license is-reachable github.com/sindresorhus/is-reachable/blob/master/license
 */

/* global $: true, cordova: true, Connection: true */

//===========================================================================
// Lodash (npm)
//===========================================================================

/**
 * Lodash - github.com/lodash/lodash
 * @license Lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 */

//===========================================================================
// App
//===========================================================================

/**
 * @classdesc North Orca App.
 *
 * <code>app</code> is responsible for all application logic.
 */
window.app = {

    /**
     * @classdesc Utility Methods. Reference by window.app.utils.
     *
     * @hideconstructor
     */
    utils: {

        /**
         * @classdesc IO WebStorage Methods. Reference by window.app.utils.webstorage.
         *
         * @hideconstructor
         */
        webstorage: {
            /**
             * Returns the entire contents of <code>localStorage</code> and passes each key/value pair
             * through <code>iterator</code> then returns the <code>localStorage</code> object.
             *
             * @param {Function} iterator - The function for iterating through results.
             *
             * @returns {!object} The contents of <code>localStorage</code>, or if empty <code>undefined</code>.
             */
            all: function( iterator ) {
                let l = ( !window.app.utils.nil( localStorage ) ) ? window.app.utils.size( localStorage ) : 0;

                if ( window.app.utils.isFunction( iterator ) ) {
                    for ( let i = l; i--; ) {
                        iterator( localStorage.key( i ), localStorage.getItem( localStorage.key( i ) ) );
                    }
                }
                return localStorage;
            },

            /**
             * Clears all the contents of <code>localStorage</code>.
             */
            empty: function() {
                localStorage.clear();
            },

            /**
             * If it exists, returns the <code>key</code> that has the value <code>withValue</code>
             * in <code>localStorage</code>. If no <code>withValue</code> is specified then returns <code>key</code> if it exists.
             *
             * @param {!string} key - The key to retrieve.
             * @param {*} withValue - The value to search for.
             *
             * @returns {!object} The contents of <code>key</code> in <code>localStorage</code> if it is found, or if not found <code>undefined</code>.
             */
            getItem: function( key, withValue ) {
                if ( !window.app.utils.nil( withValue ) && window.app.utils.webstorage.has( key, withValue ) ) {
                    return localStorage.getItem( key );
                }
                return localStorage.getItem( key );
            },

            /**
             * If it exists, returns the <code>key</code> that has the value <code>withValue</code>
             * in <code>localStorage</code> as true. If no <code>withValue</code> is specified, then returns true.
             *
             * @param {!string} key - The key to retrieve.
             * @param {*} withValue - The value to search for.
             *
             * @returns {!boolean} True if <code>key</code> with value <code>withValue</code> in <code>localStorage</code> if it is found, or if not found false.
             */
            has: function( key, withValue ) {
                key = $n.io.webstorage.get( key );

                if ( !window.app.utils.nil( key ) ) {
                    if ( !window.app.utils.nil( withValue ) ) {
                        if ( key === withValue ) return true
                        return false;
                    }
                    return true;
                }
                return false;
            },

            /**
             * If it exists, removes the <code>key</code> that has the value <code>withValue</code>
             * in <code>localStorage</code>.
             *
             * @param {!string} key - The key to retrieve and remove.
             * @param {*} withValue - The value to search for.
             *
             * @returns {!boolean} True if <code>key</code> and if specified <code>withValue</code> was removed, otherwise false.
             */
            remove: function( key, withValue ) {
                if ( !window.app.utils.nil( withValue ) && $n.io.webstorage.has( key, withValue ) ) {
                    localStorage.removeItem( key );
                    return true;
                } else if ( $n.io.webstorage.has( key ) ) {
                    localStorage.removeItem( key );
                    return true;
                }
                return false;
            },

            /**
             * If it exists, rename the <code>key</code> and if specified only when the value is equal to <code>onlyIfValue</code>
             * in <code>localStorage</code>.
             *
             * @param {!string} key - The key to retrieve and remove.
             * @param {!string} newKey - The value to replace <code>key</code> with.
             * @param {*} onlyIfValue - Only rename <code>key</code> to <code>newKey</code> if the value of <code>key</code> is equal to this.
             *
             * @returns {!boolean} True if <code>key</code> and if specified <code>onlyWithValue</code> was renamed, otherwise false.
             */
            rename: function( key, newKey, onlyIfValue ) {
                if ( window.app.utils.webstorage.has( key ) && !window.app.utils.nil( newKey ) ) {
                    let value = $n.io.webstorage.get( key );

                    if ( !window.app.utils.nil( onlyIfValue ) ) {
                        if ( onlyIfValue !== value ) return false;
                    }
                    window.app.utils.webstorage.remove( key );
                    window.app.utils.webstorage.set( newKey, value );
                    return true;
                }
                return false;
            }

            /**
             * Sets the <code>key</code> with value <code>withValue</code>
             * in <code>localStorage</code>.
             *
             * @param {!string} key - The key to set.
             * @param {*} value - The value to set.
             */
            setItem: function( key, value ) {
                localStorage.setItem( key, value );
            }
        }

        /**
         * Returns true if <code>value</code> is a string, else false.
         *
         * @param {*} [value] - Value.
         *
         * @returns {!boolean} True if <code>value</code> is a string, otherwise false.
         */
        isString: function( value ) {
            is( value ) {
                if ( value === "" ) return true;
                return !!value && value.constructor === String;
            }
        },

        /**
         * Returns true if <code>value</code> is a number, else false.
         *
         * @param {*} [value] - Value.
         *
         * @returns {!boolean} True if <code>value</code> is a number, otherwise false.
         */
        isNumber: function( value ) {
            return _.isFinite( value );
        },

        /**
         * Returns true if <code>value</code> is a function, else false.
         *
         * @param {*} [value] - Value.
         *
         * @returns {!boolean} True if <code>value</code> is a function, otherwise false.
         */
        isFunction: function( value ) {
            return !!value && value.constructor === Function;
        },

        /**
         * Checks whether <code>value</code> is defined.
         *
         * @param {*} [value] - The value to check.
         *
         * @returns {!boolean} True if <code>value</code> is not defined, else false.
         */
        isNil: function( value ) {
           return _.isNil( value );
        },

        /**
         * Gets the size of <code>value</code> by returning its length.
         *
         * @param {*} value - The value to inspect.
         *
         * @returns {!number} The <code>value</code> size.
         */
        size: function( value ) {
            return _.size( value );
        },

        /**
         * Checks if <code>string</code> contains an email address.
         *
         * @param {!string} string - String.
         *
         * @example
         * window.app.utils.isEmail( "orca@orca.com" );
         * // => true
         *
         * @example
         * window.app.utils.isEmail( "orca@.com" );
         * // => false
         *
         * @returns {!string} True if <code>string</code> is an email address, else false.
         */
        isEmail: function( string ) {
            if ( !window.app.utils.isString( string ) ) throw new TypeError( `Invalid string for @string: ${string}` );

            return /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)$/i.test( string ); // eslint-disable-line no-useless-escape
        },

        /**
         * Checks if <code>string</code> contains a url.
         *
         * @param {!string} string - String.
         *
         * @example
         * window.app.utils.isURL( "https://northorca.com" );
         * // => true
         *
         * @example
         * window.app.utils.isURL( "http:northorca." );
         * // => false
         *
         * @returns {!string} True if <code>string</code> is a url, else false.
         */
        isURL: function( string ) {
            if ( !window.app.utils.isString( string ) ) throw new TypeError( `Invalid string for @string: ${string}` );

            return /^(?:\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])$/i.test( string ); // eslint-disable-line no-useless-escape
        },

        /**
         * Removes leading and trailing whitespace or specified characters from <code>string</code>.
         *
         * @param {!string} string - String.
         * @param {string} [chars=" "] - The characters to trim, defaults to whitespace.
         *
         * @example
         * window.app.utils.trim( "  orca " );
         * // => "orca"
         *
         * @returns {!string} The trimmed <code>string</code>.
         */
        trim: function( string, chars = " " ) {
            if ( !window.app.utils.isString( string ) ) throw new TypeError( `Invalid string for @string: ${string}` );
            if ( !window.app.utils.isString( chars ) ) throw new TypeError( `Invalid string for @chars: ${chars}` );

            return _.trim( string, chars );
        },

        /**
         * Converts the characters "&", "<", ">", '"', and "'" in <code>string</code> to their
         * corresponding HTML entities.
         *
         * @param {!string} string - String.
         *
         * @example
         * window.app.utils.escape( "me & you" );
         * // => "me &amp; you"
         *
         * @returns {!string} The escaped <code>string</code>.
         */
        escape: function( string ) {
            if ( !window.app.utils.is( string ) ) throw new TypeError( `Invalid string for @string: ${string}` );

            return _.escape( string );
        },

        /**
         * Escapes the RegExp special characters "^", "$", "", ".", "*", "+",
         * "?", "(", ")", "[", "]", "{", "}", and "|" in <code>string</code>.
         *
         * @param {!string} string - String.
         *
         * @example
         * window.app.utils.escapeRegExp( "[northorca](https://northorca.com/)" );
         * // => "\[northorca\]\(https://northorca\.com/\)"
         *
         * @returns {!string} The escaped <code>string</code>.
         */
        escapeRegExp: function( string ) {
            if ( !this.is( string ) ) throw new TypeError( `Invalid string for @string: ${string}` );

            return _.escapeRegExp( string );
        },

        /**
         * Function that will check whether <code>target</code> is reachable within <code>timeout</code> milliseconds
         * and on completion will fire <code>cb</code>.
         *
         * @param {!string} target - The target host.
         * @param {!timeout} [timeout=10000] - The wait time before declaring unreachable, defaults to 10 seconds.
         * @param {!Function} cb - The callback function.
         */
        isReachable: function( target, timeout = 10000, cb ) {
            if ( !window.app.utils.isString( target ) ) throw new TypeError( `Invalid string for @target: ${target}` );
            if ( !window.app.utils.isNumber( timeout ) ) throw new TypeError( `Invalid number for @timeout: ${timeout}` );
            if ( !window.app.utils.isFunction( cb ) ) throw new TypeError( `Invalid function for @cb: ${cb}` );

            ( async () => {
                let reachable = await require( "is-reachable" )( target, {"timeout": timeout} );
                cb( reachable );
            } )();
        },
    }

    /**
     * Function that will check whether <code>window.app.serverUrl</code> is reachable and on completion will fire <code>cb</code>.
     *
     * @param {Function} cb - The callback function.
     */
    checkReachability: function( cb ) {
        window.app.utils.isReachable( window.app.serverUrl, ( reachable ) => {
            if ( !window.app.utils.isFunction( cb ) ) {
                cb( reachable );
            } else console.log( "Invalid callback function used for @checkReachability." );
        } );
    },

    /**
     * Remove any existing project that is loaded.
     */
    killProject: function() {
        clearTimeout( window.app.frameTimeout );
        window.app.frameTimeout = undefined;
        window.app.$n = undefined;
        $( document.body ).css( "background-color", "#303030" );
        $( ".projectFrame" ).hide();
        $( ".projectFrame" ).off( "load" ).attr( "src", "about:blank" );
        $( ".icon, .discovered" ).show();
        window.app.hasProject = false;
    },

    /**
     * Watch for relevant Bonjour (zeroconf) services.
     * When one is found it is added to the UI and becomes "touchable/clickable" to load the project.
     * When one is removed it is removed from the UI.
     */
    watchBonjour: function() {
        window.app.servicesCount = 0;
        window.app.services = {};
        window.app.bl3 = "rlk3jr13K!L@jj12#LJ__@1";
        window.app.bonjour = cordova.plugins.zeroconf;
        window.app.bonjour.registerAddressFamily = "ipv4";
        window.app.bonjour.watchAddressFamily = "ipv4";

        window.app.bonjour.watch( "_nyrion._tcp.", "local.", function( result ) {

            if ( !result || !result.action || !result.service ) return;

            let action = result.action;
            let service = result.service;

            if ( !service ) return;

            if ( action === "resolved" ) {

                if ( !service.txtRecord || !service.txtRecord.uuid ) return;

                let data = XXTEA.decryptFromBase64( ( service.txtRecord.data ).toString(), window.app.bl3 );
                let split = ( data ) ? data.split( "**" ) : "";

                window.uuid =  ( split && split.length === 3 ) ? split[2] : "unknown";

                if ( !split || split.length !== 3 ) return;

                window.app.services[`${service.txtRecord.uuid}`] = {
                    name: service.name,
                    uuid: service.txtRecord.uuid,
                    url: `http://${service.hostname}:${service.port}/${split[0]}**${split[1]}**${window.canary.config[window.canary.device].apiKey}`
                }
                window.app.servicesCount++;

                let projectEntry = `<span data-name="${service.name}" data-uuid="${service.txtRecord.uuid}" class="projectEntry">${service.name} @ ${service.hostname}</span>`;

                $( `[data-uuid="${service.txtRecord.uuid}"]` ).remove();
                $( `[data-name="${service.name}"]` ).remove();

                if ( !window.app.hasProject ) $( ".icon" ).fadeIn();
                $( ".none" ).remove();
                if ( $( ".loading" ).is( ":visible" ) ) {
                    $( ".loading" ).fadeOut( 300, () => {
                        $( ".discovered" ).append( projectEntry );
                    } );
                } else $( ".discovered" ).append( projectEntry );

                $( ".discovered" ).off( "click" ).on( "click", () => {
                    window.canary.logEvent( "prepare_project" );
                    window.app.prepareProject( window.app.services[`${service.txtRecord.uuid}`] );
                } );
            } else if ( action === "removed" ) {
                if ( service.txtRecord && service.name ) {
                    window.app.servicesCount--;
                    if ( 0 > window.app.servicesCount ) window.app.servicesCount = 0;
                    window.app.services[`${service.txtRecord.uuid}`] = null;
                    $( `[data-uuid="${service.txtRecord.uuid}"]` ).remove();
                    $( `[data-name="${service.name}"]` ).remove();
                }

                window.app.noProjects();
                window.app.killProject();
            }
        } );
    },

    /**
     * Handler for when no projects are found.
     * If no projects are available, the UI reflects that.
     */
    noProjects: function() {
        if ( window.app.servicesCount === 0 ) {
            $( ".discovered" ).html( window.app.noProjectHtml );
            $( ".icon" ).fadeIn();

            $( ".helpNoProjects" ).on( "click", () => {
                if ( window.canary ) window.canary.logEvent( "help_no_projects" );

                let msg = {
                    title: window.locale( "noProjectsTitle" ),
                    message: window.locale( "noProjectsMessage" ),
                    buttonOk: window.locale( "noProjectsButton" ),
                    buttonCancel: window.locale( "cancel" ),
                    cb: ( idx ) => { // eslint-disable-line arrow-parens
                        if ( window.canary ) window.canary.logEvent( "help_no_projects_visited" );
                        if ( idx === 1 ) window.open( "https://nyrion.ca/cantseemyproject", "_system", "location=yes" );
                    }
                };

                navigator.notification.confirm( msg.message, msg.cb, msg.title, [msg.buttonOk, msg.buttonCancel] );
            } );
        }
    },

    /**
     * Handler for when a project is selected in the UI.
     *
     * @param {!Object} data - Project record, including url.
     */
    prepareProject: function( data ) {
        let frame = $( ".projectFrame" );

        window.app.hasProject = true;

        $( ".icon, .discovered" ).hide();

        if ( !data || !data.url ) {
            window.canary.logEvent( "project_frame_invalid_data" );
            window.app.projectFrameFailure( frame );
            return;
        }

        window.app.frameTimeout = setTimeout( () => {
            window.canary.logEvent( "project_frame_timeout" );
            window.app.projectFrameFailure( frame );
        }, 6000 );

        let trace = window.canary.trace( "frameLoad" );

        // Wait for the iframe to be loaded, check that it contains a reference to <code>Nyrion</code>.
        frame.off( "load" ).on( "load", () => {
            frame.show();
            function _check() {
                if ( window.app.frameCount >= 10 ) {
                    trace.stop();
                    window.canary.logEvent( "frame_too_slow" );
                    window.app.projectFrameFailure( frame );
                    return;
                }

                if ( !frame.get( 0 ).contentWindow.Nyrion ) {
                    setTimeout( _check, 500 );
                    if ( !window.app.frameCount ) window.app.frameCount = 0;
                    window.app.frameCount++;
                } else {
                    trace.stop();
                    window.app.projectReady( frame );
                }
            }
            _check();
        } );

        $( document.body ).css( "background-color", "#000000" );
        alert(data.url)
        frame.attr( "src", data.url );
    },

    /**
     * Handler for when the project iframe is ready and valid.
     *
     * @param {!Object} frame - A reference to the iframe element.
     */
    projectReady: function( frame ) {
        if ( !frame ) {
            window.canary.logEvent( "project_frame_no_ref" );
            window.app.projectFrameFailure( frame );
            return;
        }

        let trace = window.canary.trace( "projectReady" );

        window.app.$n = frame.get( 0 ).contentWindow.Nyrion();
        clearTimeout( window.app.frameTimeout );
        window.app.frameTimeout = undefined;

        if ( window.app.$n ) {
            let cw = frame.get( 0 ).contentWindow;
            cw.cordova = cordova;

            trace.stop();

            // Listen for "Change Project..." in iframe
            cw.$( cw.document ).on( "changeProject", () => {
                window.canary.logEvent( "change_project" );
                frame.off( "load" );
                window.app.killProject();
            } );

            // Listen for when broadcast is stopped in inframe
            cw.$( cw.document ).on( "broadcastStopped", () => {
                window.canary.logEvent( "broadcast_stopped" );
                window.app.projectFrameFailure( frame );
            } );
        } else {
            // If no reference to <code>Nyrion</code>
            trace.stop();
            frame.off( "load" );
            window.app.killProject();
        }
    },

    /**
     * Handler for when the project iframe fails.
     *
     * @param {!Object} frame - A reference to the iframe element.
     */
    projectFrameFailure: function( frame ) {
        window.app.frameCount = 0;
        if ( frame ) frame.off( "load" );
        window.app.killProject();

        let msg = {
            title: window.locale( "projectFrameFailureTitle" ),
            message: window.locale( "projectFrameFailureMessage" ),
            buttonOk: window.locale( "close" )
        };

        navigator.notification.alert( msg.message, null, msg.title, msg.buttonOk );
    },

    /**
     * App Constructor. Wait for <code>deviceready</code> event.
     */
    initialize: function() {
        document.addEventListener( "deviceready", window.app.onDeviceReady.bind( window.app ), false );
    },

    /**
     * Handler for when device is ready.
     */
    onDeviceReady: function() {
        if ( !window.canary ) {
            setTimeout( window.app.onDeviceReady, 10 );
            return;
        }

        window.app.noProjectHtml = `<span class="none">${window.locale( "noProjectsFound" )}<br/><span class="helpNoProjects">${window.locale( "noProjectsTitle" )}</span></span>`;

        window.canary.logEvent( "first_open" );

        // Check reachability of server every 60 seconds
        setInterval( () => {
            window.app.utils.checkReachability( ( reachable ) => {
                if ( reachable === true ) {
                    // 
                }
            } );
        }, 60000 );
    }

};
window.app.initialize();