function ApplicationWindow() {
  var self = Ti.UI.createWindow({
    backgroundColor : '#ffffff'
  });

  self.addEventListener('focus', function(e){
      LunchLog.activeWindow = self;
  });
  
  return self;
}

module.exports = ApplicationWindow;
