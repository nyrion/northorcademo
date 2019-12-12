//===========================================================================
// Canary
//===========================================================================

/**
 * @classdesc Canary. Reference by window.canary.
 *
 * Canary is responsible for authenticating with "Google Firebase" based on the platform.
 *
 * Supports basic methods that become available when the @ready parameter becomes <code>true</code>.
 * Call with <code>initialize()</code>.
 * Supported Methods:
 *     - Analytics Event Logging
 *     - Error Logging (To Firestore Database)
 *     - Performance Tracing
 */
window.canary = {

    ready: false,

    config: {
        orca: { // North Orca
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        }
    },

    /**
     * The type of device used, or <code>web</code> otherwise.
     *
     * @returns {!string} Device type.
     */
    device: null,

    /**
     * Start Performance Tracing for <code>name</code>.
     *
     * @param  {!string} name - The name to use.
     *
     * @example
     * let trace = canary.trace( "my_trace" );
     * // code to test performance for
     * trace.stop();
     *
     * @return {!Object} An instance to use. When done trace, call <code>stop()</code>.
     */
    trace: function( name ) {
        try {
            let inst = window.canary.performance.trace( name );
                inst.start();

            return inst;
        } catch( e ) {}
        return {stop: () => {}};
    },

    /**
     * Log an Analytics Event for <code>name</code>.
     *
     * @param {!string} name - The name to use.
     */
    logEvent: function( name ) {
        try{ window.canary.analytics.logEvent( name ); } catch( e ){}
    },

    /**
     * Log an Error with <code>error</code> to the "Firestore" database.
     *
     * @param  {!string} error - The error message.
     * @param  {Function} successCb - The function to be called on successful error report.
     * @param  {Function} errorCb - The function to be called when the error report fails.
     */
    logError: function( error, successCb, errorCb ) {
        try {
            cordova.getAppVersion.getVersionNumber().then( ( version ) => {
                _continue( version );
            } );
        } catch( e ){ _continue( "unknown" ); }

        function _continue( version ) {
            window.canary.db.collection( "logs" ).add( {
                uuid: "orca",
                message: error,
                platform: window.canary.device,
                version: version,
                timecode: Date.now(),
                userAgent: navigator.userAgent
            } )
            .then( function( doc ) {
                if ( successCb ) successCb( doc )
                window.canary.logEvent( "error_report_sent" ); // Log with "Analytics" that an error occurred.
            } )
            .catch( function( e ) {
                if ( errorCb ) errorCb( e );
                window.canary.logEvent( "error_report_failed" ); // Log with "Analytics" that an error occurred.
            } );
        }
    },

    /**
     * Initialize Canary. Will continually wait for "Firebase" to be ready.
     */
    initialize: function() {
        if ( !window.canary.device ) {
            let device;
            if ( /Android/i.test( navigator.userAgent ) ) device = "android";
            else if ( /iPhone|iPad|iPod|iOS/i.test( navigator.userAgent ) ) device = "ios";
            else device = "web";
            window.canary.device = device;
        }

        if ( !window.canary.ready && window.canary.config && window.firebase && window.firebase.performance && window.firebase.analytics && window.firebase.firestore ) {
            window.firebase.initializeApp( window.canary.config["orca"] );
            window.canary.analytics = window.firebase.analytics();
            window.canary.performance = window.firebase.performance();
            window.canary.db = window.firebase.firestore();

            window.canary.ready = true;
        } else setTimeout( window.canary.initialize, 10 );
    }

};
window.canary.initialize();