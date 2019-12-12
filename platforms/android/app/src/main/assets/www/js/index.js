/*
 *
 * Copyright (c) 2018-2020, Nyrion. All rights reserved.
 * nyrion.ca/license
 * This file is licensed under the Nyrion Proprietary License, which can be found in the accompanying "LICENSE.md" file.
 * The "LICENSE.md" file must accompany any and all files which contain this above copyright notice.
 * The above copyright notice shall not be removed or altered in any way without explicit permission from Nyrion.
 *
 */

/* eslint-disable */

//===========================================================================
// XXTEA
//===========================================================================

/**
 * XXTEA - github.com/xxtea/xxtea-js/
 * @version 10.24.2016 - 24 Oct 2016
 * @license XXTEA github.com/xxtea/xxtea-js/blob/master/LICENSE.md
 */
(function(l){function r(a,g){var e=a.length,c=e<<2;if(g){var b=a[e-1];c-=4;if(b<c-3||b>c)return null;c=b}for(b=0;b<e;b++)a[b]=String.fromCharCode(a[b]&255,a[b]>>>8&255,a[b]>>>16&255,a[b]>>>24&255);e=a.join("");return g?e.substring(0,c):e}function n(a,g){var e=a.length,c=e>>2;0!==(e&3)&&++c;if(g){var b=Array(c+1);b[c]=e}else b=Array(c);for(c=0;c<e;++c)b[c>>2]|=a.charCodeAt(c)<<((c&3)<<3);return b}function p(a,g,e,c,b,d){return(e>>>5^g<<2)+(g>>>3^e<<4)^(a^g)+(d[c&3^b]^e)}function t(a){4>a.length&&(a.length=
4);return a}function q(a){if(/^[\x00-\x7f]*$/.test(a))return a;for(var g=[],e=a.length,c=0,b=0;c<e;++c,++b){var d=a.charCodeAt(c);if(128>d)g[b]=a.charAt(c);else if(2048>d)g[b]=String.fromCharCode(192|d>>6,128|d&63);else if(55296>d||57343<d)g[b]=String.fromCharCode(224|d>>12,128|d>>6&63,128|d&63);else{if(c+1<e){var h=a.charCodeAt(c+1);if(56320>d&&56320<=h&&57343>=h){d=((d&1023)<<10|h&1023)+65536;g[b]=String.fromCharCode(240|d>>18&63,128|d>>12&63,128|d>>6&63,128|d&63);++c;continue}}throw Error("Malformed string");
}}return g.join("")}function u(a,g){if(void 0===g||null===g||0>g)g=a.length;if(0===g)return"";if(/^[\x00-\x7f]*$/.test(a)||!/^[\x00-\xff]*$/.test(a))return g===a.length?a:a.substr(0,g);if(65535>g){var e=g;for(var c=Array(e),b=0,d=0,h=a.length;b<e&&d<h;b++){var f=a.charCodeAt(d++);switch(f>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:c[b]=f;break;case 12:case 13:if(d<h)c[b]=(f&31)<<6|a.charCodeAt(d++)&63;else throw Error("Unfinished UTF-8 octet sequence");break;case 14:if(d+1<h)c[b]=
(f&15)<<12|(a.charCodeAt(d++)&63)<<6|a.charCodeAt(d++)&63;else throw Error("Unfinished UTF-8 octet sequence");break;case 15:if(d+2<h)if(f=((f&7)<<18|(a.charCodeAt(d++)&63)<<12|(a.charCodeAt(d++)&63)<<6|a.charCodeAt(d++)&63)-65536,0<=f&&1048575>=f)c[b++]=f>>10&1023|55296,c[b]=f&1023|56320;else throw Error("Character outside valid Unicode range: 0x"+f.toString(16));else throw Error("Unfinished UTF-8 octet sequence");break;default:throw Error("Bad UTF-8 encoding 0x"+f.toString(16));}}b<e&&(c.length=
b);e=String.fromCharCode.apply(String,c)}else{e=g;c=[];b=Array(32768);d=f=0;for(h=a.length;f<e&&d<h;f++){var k=a.charCodeAt(d++);switch(k>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:b[f]=k;break;case 12:case 13:if(d<h)b[f]=(k&31)<<6|a.charCodeAt(d++)&63;else throw Error("Unfinished UTF-8 octet sequence");break;case 14:if(d+1<h)b[f]=(k&15)<<12|(a.charCodeAt(d++)&63)<<6|a.charCodeAt(d++)&63;else throw Error("Unfinished UTF-8 octet sequence");break;case 15:if(d+2<h)if(k=((k&7)<<18|(a.charCodeAt(d++)&
63)<<12|(a.charCodeAt(d++)&63)<<6|a.charCodeAt(d++)&63)-65536,0<=k&&1048575>=k)b[f++]=k>>10&1023|55296,b[f]=k&1023|56320;else throw Error("Character outside valid Unicode range: 0x"+k.toString(16));else throw Error("Unfinished UTF-8 octet sequence");break;default:throw Error("Bad UTF-8 encoding 0x"+k.toString(16));}32766<=f&&(f+=1,b.length=f,c[c.length]=String.fromCharCode.apply(String,b),e-=f,f=-1)}0<f&&(b.length=f,c[c.length]=String.fromCharCode.apply(String,b));e=c.join("")}return e}function v(a,
g){if(void 0===a||null===a||0===a.length)return a;a=q(a);g=q(g);var e=n(a,!0),c=t(n(g,!1)),b=e.length,d=b-1,h,f;var k=e[d];var m=0;for(f=Math.floor(6+52/b)|0;0<f;--f){m=m+2654435769&4294967295;var l=m>>>2&3;for(h=0;h<d;++h)b=e[h+1],k=e[h]=e[h]+p(m,b,k,h,l,c)&4294967295;b=e[0];k=e[d]=e[d]+p(m,b,k,d,l,c)&4294967295}return r(e,!1)}function w(a,g){if(void 0===a||null===a||0===a.length)return a;g=q(g);var e=n(a,!1),c=t(n(g,!1)),b=e.length,d=b-1,h,f;var k=e[0];for(h=2654435769*Math.floor(6+52/b)&4294967295;0!==
h;h=h-2654435769&4294967295){var l=h>>>2&3;for(f=d;0<f;--f)b=e[f-1],k=e[f]=e[f]-p(h,k,b,f,l,c)&4294967295;b=e[d];k=e[0]=e[0]-p(h,k,b,0,l,c)&4294967295}return u(r(e,!0))}"undefined"==typeof l.btoa&&(l.btoa=function(){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");return function(g){var e;var c=e=0;var b=g.length;var d=b%3;b-=d;var h=b/3<<2;0<d&&(h+=4);for(h=Array(h);c<b;){var f=g.charCodeAt(c++)<<16|g.charCodeAt(c++)<<8|g.charCodeAt(c++);h[e++]=a[f>>18]+a[f>>12&
63]+a[f>>6&63]+a[f&63]}1==d?(f=g.charCodeAt(c++),h[e++]=a[f>>2]+a[(f&3)<<4]+"=="):2==d&&(f=g.charCodeAt(c++)<<8|g.charCodeAt(c++),h[e++]=a[f>>10]+a[f>>4&63]+a[(f&15)<<2]+"=");return h.join("")}}());"undefined"==typeof l.atob&&(l.atob=function(){var a=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,
22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1];return function(g){var e=g.length;if(0!==e%4||/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/=]/.test(g))return"";var c="="==g.charAt(e-2)?1:"="==g.charAt(e-1)?2:0;var b=e;0<c&&(b-=4);var d=Array(3*(b>>2)+c);for(c=b=0;c<e;){var h=a[g.charCodeAt(c++)];if(-1==h)break;var f=a[g.charCodeAt(c++)];if(-1==f)break;d[b++]=String.fromCharCode(h<<2|(f&48)>>4);h=a[g.charCodeAt(c++)];
if(-1==h)break;d[b++]=String.fromCharCode((f&15)<<4|(h&60)>>2);f=a[g.charCodeAt(c++)];if(-1==f)break;d[b++]=String.fromCharCode((h&3)<<6|f)}return d.join("")}}());l.XXTEA={utf8Encode:q,utf8Decode:u,encrypt:v,encryptToBase64:function(a,g){return l.btoa(v(a,g))},decrypt:w,decryptFromBase64:function(a,g){return void 0===a||null===a||0===a.length?a:w(l.atob(a),g)}}})(this||(0,eval)("this"));

/* eslint-enable */

/* global $: true, XXTEA: true, cordova: true, Connection: true */

//===========================================================================
// App
//===========================================================================

/**
 * @classdesc Nyrion Mobile App.
 *
 * <code>app</code> is responsible for all application logic.
 */
window.app = {

    /**
     * Handler for when there is no valid Wifi connection.
     * When this occurs, we remove any existing project that is open and indicate
     * to the user in the UI that there is no connection.
     */
    noConnection: function() {
        window.app.killProject();

        $( ".discovered" ).html( window.locale( "noConnectionHtml" ) );
        $( ".icon" ).fadeIn();

        window.app.servicesCount = 0;
        window.app.services = {};
    },

    /**
     * Handler for when there is a valid Wifi connection.
     */
    hasConnection: function() {
        window.app.noProjects();
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
     * Returns whether there is a valid connection.
     *
     * @returns {!Number} <code>0</code> for no connection, <code>1</code> for cellular connection, <code>2</code> for Wifi connection.
     */
    checkConnection: function() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 2;
        states[Connection.ETHERNET] = 1;
        states[Connection.WIFI]     = 2;
        states[Connection.CELL_2G]  = 1;
        states[Connection.CELL_3G]  = 1;
        states[Connection.CELL_4G]  = 1;
        states[Connection.CELL]     = 1;
        states[Connection.NONE]     = 0;

        return states[networkState];
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

        document.addEventListener( "offline", window.app.noConnection, false ); // Listen for device offline
        document.addEventListener( "online", window.app.hasConnection, false ); // Listen for device online

        window.app.noProjectHtml = `<span class="none">${window.locale( "noProjectsFound" )}<br/><span class="helpNoProjects">${window.locale( "noProjectsTitle" )}</span></span>`;

        window.canary.logEvent( "first_open" );

        // Check that there is a valid Wifi connection
        if ( window.app.checkConnection() !== 2 ) window.app.noConnection();
        else {
            // If after 5 seconds and no relevant Bonjour services are found
            setTimeout( () => {
                $( ".loading" ).fadeOut();

                window.app.noProjects();
            }, 5000 );
        }

        // Watch for relevant Bonjour (Zeroconf) services
        function _watch() {
            if ( window.canary && window.canary.ready ) window.app.watchBonjour();
            else setTimeout( _watch, 100 );
        }
        _watch();
    }

};
window.app.initialize();