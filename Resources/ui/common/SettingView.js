function SettingView() {
  var self = Ti.UI.createView();
  
  var logoutButton = Ti.UI.createButton({
      title : "Logout",
      top : 180,
      height : 50,
      width : 200,
  });

  logoutButton.addEventListener('click', function(e){
    Ti.API.info("logout button clicked");
    
    Ti.Facebook.addEventListener('logout', function(e) {
      alert('Logged out');
      
      var tabGroup = LunchLog.activeWindow.tabGroup;
      LunchLog.tabs.activeTab = tabGroup.tabs[0];

      var ViewUtil = require('ui/common/ViewUtil');
      new ViewUtil().openLoginViewModal();

    });
    Ti.Facebook.logout();
  });
  
  self.add(logoutButton);

  return self;
}

module.exports = SettingView;
