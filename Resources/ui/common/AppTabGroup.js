function AppTabGroup() {
    var self = Ti.UI.createTabGroup();
    LunchLog.tabs = self;

    var ApplicationWindow = require('ui/handheld/ApplicationWindow');
    var FirstView = require('ui/common/FirstView');
    var firstView = new FirstView();
    var appWin = new ApplicationWindow();
    appWin.add(firstView);
    appWin.hideNavBar();
    
    var SettingView = require('ui/common/SettingView');
    var settingView = new SettingView();
    var settingWin = new ApplicationWindow();
    settingWin.add(settingView);
    settingWin.hideNavBar();
    
    var tab1 = Ti.UI.createTab({
      title: L('home'),
      icon: '/images/house.png',
      window: appWin
    });
    appWin.containingTab = tab1;

    var tab2 = Ti.UI.createTab({
      title: L('settings'),
      icon: '/images/preferences.png',
      window: settingWin
    });
    appWin.containingTab = tab2;
    
    self.addTab(tab1);
    self.addTab(tab2);
    
    return self;
};

module.exports = AppTabGroup;
