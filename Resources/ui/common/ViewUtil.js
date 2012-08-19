function ViewUtil() {
  var self = this;

  self.openLoginViewModal = function() {
    var ApplicationWindow = require('ui/handheld/ApplicationWindow');
    var LoginView = require('ui/common/LoginView');

    var loginView = new LoginView();
    var appWin = new ApplicationWindow();

    appWin.add(loginView);
    appWin.hideNavBar();
    appWin.open({ modal : true });
  }

  return self;
}

module.exports = ViewUtil;
