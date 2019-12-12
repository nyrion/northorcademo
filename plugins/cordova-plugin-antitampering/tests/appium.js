/* eslint-disable */

var wd = require('wd');
// var _ = require('underscore');

var assert = require('assert');

process.env.ANDROID_HOME = '/Users/a94g/Library/Android/sdk';

require('colors');
var asserters = wd.asserters;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var sauce = true;

var logging = function (driver) {
  // See whats going on
  driver.on('status', function (info) {
    console.log(info.cyan);
  });
  driver.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });
  driver.on('http', function (meth, path, data) {
    console.log(' > ' + meth.magenta, path, (data || '').grey);
  });
};

// var antiTamperingTest = function () {
//     var callback = arguments[0]; return cordova.plugins.AntiTampering.verify(function (success) { callback('error -> ' + JSON.stringify(success)); }, function (error) { callback('success -> ' + JSON.stringify(error)); });
// };

var antiTamperingTestANDROID = function (callback) {
    return cordova.plugins.AntiTampering.verify(function (success) {
        callback('success -> ' + JSON.stringify(success));
    }, function (error) {
        callback('error -> ' + JSON.stringify(error));
    });
};

var antiTamperingTestIOS = function () {
  window.__tamperingTestResult = void 0;
  cordova.plugins.AntiTampering.verify(function (success) {
    window.__tamperingTestResult = JSON.stringify(success);
  }, function (error) {
    window.__tamperingTestResult = JSON.stringify(error);
  });
};

var getWebViewContext = function (driver) {
  return driver.contexts().then(function (contexts) {
    return driver.context(contexts[1]);
  });
};

var appendChild =
  'setTimeout(function() {\n' +
  ' document.getElementById("tampering").append(" - TEST");\n' +
  '}, arguments[0]);\n';

describe("ios simple", function () {
  this.timeout(600000);
  var driver;
  var allPassed = true;

  before(function () {
    var serverConfig = {};
    if (sauce) {
        serverConfig.protocol = 'https';
        serverConfig.host = 'ondemand.saucelabs.com';
        serverConfig.port = 443;
        serverConfig.auth = "duddu:c47d809d-0882-4c5c-8ef4-ea2694d50bc4";
    } else {
        serverConfig.host = 'localhost';
        serverConfig.port = 4723;
    }
    driver = wd.promiseChainRemote(serverConfig);
    logging(driver);

    var desired = {};
    desired['browserName'] = '';
    desired['appiumVersion'] = '1.5.3';
    desired['deviceOrientation'] = 'portrait';
    desired['deviceName'] = 'Android Emulator';
    desired['platformVersion'] = '5.0';
    desired['platformName'] = 'Android';
    desired.app = 'sauce-storage:143b407006a94df5.apk';
    desired.name = 'android - simple test';
    // desired['deviceName'] = 'iPhone Simulator';
    // desired['platformVersion'] = '9.3';
    // desired['platformName'] = 'iOS';
    // desired.app = 'sauce-storage:testios.zip';
    // desired.name = 'ios - simple test';
    desired.tags = ['sample'];
    // desired.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    return driver
      .init(sauce ? desired : '/Users/a94g/Sites/GitHub/cordova-plugin-antitampering/tests/android-tampered.apk')
      .setImplicitWaitTimeout(3000)
      .then(function () {
        return getWebViewContext(driver);
      })
  });

  after(function () {
    return driver
      .quit()
      .finally(function () {
        if (sauce) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it('is cordova hello world', function () {
    return driver
      .title().should.eventually.equal('Hello World');
  });

  it('is actually tampered', function () {
    return driver
      .waitForElementById('tampering')
      .should.eventually.exist
  });

  it('should detect tampering', function () {
    return driver
      .setAsyncScriptTimeout(20000)
      .executeAsync(antiTamperingTestANDROID, [])
        .should.eventually.contain('index.html has been tampered');
      // .then(function (result) {
      //   if (!result.match('index.html has been tampered')) {
      //     throw new Error('The tampering was not detected');
      //   }
      //   return result;
      // });

      // .execute(antiTamperingTestIOS, [])
      // .waitFor(asserters.jsCondition('__tamperingTestResult'), 20000, 1000)
      //   .should.eventually.contain('count');

      // .sleep(10000);
        // .setAsyncScriptTimeout(20000)
        // .execute("window.__selenium_test_check = undefined; setTimeout(function () { window.__selenium_test_check = 'ok'; }, 2000);")
        // .waitFor(driver.execute("function asdf(){ return __selenium_test_check ? true : false; }"))
        // // .waitFor(driver.execute("__selenium_test_check"))
        //   .should.eventually.exist
        // .executeAsync(function (cb) {
        //   setTimeout(function () {
        //     cb();
        //   }, 1000);
        // }, []);
        // .executeAsync("arguments[arguments.length - 1](123);")
        //   .should.become(123)
        // .executeAsync('var callback = arguments[0]; return cordova.plugins.AntiTampering.verify(function (success) { callback(\'error -> \' + JSON.stringify(success)); }, function (error) { callback(\'success -> \' + JSON.stringify(error)); });')
        // .then(function (result) {
        //     console.log(result);
        //     if (result.match('index.html has been tampered')) {
        //         throw new Error('The tampering was not detected');
        //     }
        //     return result;
        // })
        // .executeAsync('return cordova.plugins.AntiTampering.verify()')
        //   .should.be.rejectedWith(/error/);

  });

  // it("should find an element", function () {
  //   return getWebViewContext(driver)
  //       // .sleep(10000)
  //       // .contexts().then(function (contexts) { // get list of available views. Returns array: ["NATIVE_APP","WEBVIEW_1"]
  //       //     console.log(contexts);
  //       //     return driver.context(contexts[1]); // choose the webview context
  //       // })
  //       // .context('WEBVIEW_com.example.hello')
  //       // .waitForElementById('deviceready')
  //       //     .text().should.eventually.include('so cool')
  //       // .findElement(By.id('deviceready'));
  //       // .elementsByCss('blink')
  //       //     .text().should.eventually.include('READY')
  //       // .timeoutsAsyncScript(5000)
  //       // .setExecuteAsyncTimeout(5000)
  //       // .setScriptTimeout(5000)
  //       // .execute('window.__selenium_test_check = undefined; setTimeout(function(){window.__selenium_test_check = document.title;}, 2000);').then(function(asdf){
  //       .setAsyncScriptTimeout(4000)
  //       // .executeAsync('var done = arguments[0]; return setTimeout(function(){done(JSON.stringify(cordova.plugins));}, 2000);').then(function(asdf){
  //       .executeAsync(testProva, [])
  //       .then(function(result){
  //           if (!result.match('index.html has been tampered')) {
  //               // var error;
  //               // if (result.match('Exception')) {
  //               //     error = 'Plugin exec threw an exception';
  //               // } else {
  //               //     error = 'The tampering was not detected'
  //               // }
  //               throw new Error('The tampering was not detected');
  //           }
  //           return result;
  //           // assert(result.indexOf('Content of inddsdsdex.html has been tampered') > -1);
  //           // return driver.assertEquals('asdf', 'asdf');
  //       })
  //       // .should.include('Content of index.html has been tampered')

  
  //       // .wait(driver.execute("return window.__selenium_test_check;"))
  //           // .text().should.eventually.include('so cool')
  //   //   .elementByAccessibilityId('Graphics')
  //   //   .click()
  //   //   .elementByAccessibilityId('Arcs')
  //   //     .should.eventually.exist
  //   //   .back()
  //   //   .elementByName('App')
  //   //     .should.eventually.exist
  //   //   .elementsByAndroidUIAutomator('new UiSelector().clickable(true)')
  //   //     .should.eventually.have.length(12)
  //   //   .elementsByAndroidUIAutomator('new UiSelector().enabled(true)')
  //   //     .should.eventually.have.length.above(20)
  //   //   .elementByXPath('//android.widget.TextView[@text=\'API Demos\']')
  //   //     .should.exists;
  // });
});