var LunchLog = {};
LunchLog.Facebook = {};
LunchLog.Facebook.appid = 'xxx';

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with mutliple windows in a stack
(function() {
  //determine platform and form factor and render approproate components
  var osname = Ti.Platform.osname,
    version = Ti.Platform.version,
    height = Ti.Platform.displayCaps.platformHeight,
    width = Ti.Platform.displayCaps.platformWidth;
  
  //considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
  //yourself what you consider a tablet form factor for android
  var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
  
  var Window;
  if (isTablet) {
    Window = require('ui/tablet/ApplicationWindow');
  }
  else {
    // Android uses platform-specific properties to create windows.
    // All other platforms follow a similar UI pattern.
    if (osname === 'android') {
      Window = require('ui/handheld/android/ApplicationWindow');
    }
    else {
      var AppTabGroup = require('ui/common/AppTabGroup');
      
      var tabs = new AppTabGroup();
      tabs.open();

      //LunchLog.tabs = new AppTabGroup();
      //LunchLog.tabs.open();
    }
  }

})();
