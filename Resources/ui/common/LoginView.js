function LoginView() {
  var self = Ti.UI.createView();
  
  var loginButton = Ti.UI.createButton({
      title : "Facebook login",
      top : 180,
      height : 50,
      width : 200,
  });

  loginButton.addEventListener('click', function(e){
    Ti.Facebook.appid = LunchLog.Facebook.appid;
    Ti.Facebook.permissions = ['publish_stream, read_stream'];
    
    Ti.Facebook.addEventListener('login', function(e) {
      if (e.success) {
        
        Ti.API.info(e.data);

        var user_data = e.data

        var Cloud = require('ti.cloud');
 
        Cloud.SocialIntegrations.externalAccountLogin({
          type : 'facebook',
          token : Ti.Facebook.accessToken
        }, function(e) {
          if (e.success) {
            var user = e.users[0];
            
            Ti.Facebook.requestWithGraphPath('me?fields=picture', {}, 'GET', function(e) {
                if (e.success) {
                  var result = JSON.parse(e.result);

                  Cloud.Users.update({
                      first_name: user_data.first_name,
                      last_name:  user_data.last_name,
                      custom_fields: {
                          picture: result.picture
                      }
                  }, function (e) {
                      if (e.success) {
                          Ti.API.info(e.users[0]);
                      } else {
                          alert('Error:\\n' +
                              ((e.error && e.message) || JSON.stringify(e)));
                      }
                  });
                  
           
                } else if (e.error) {
                    alert(e.error);
                } else {
                    alert('Unknown response');
                }
            });

          } else {
            alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
          }
        });
 
        LunchLog.activeWindow.close();

      } else if (e.error) {
        alert(e.error);
      } else if (e.cancelled) {
        alert("Canceled");
      }
    });

    Ti.Facebook.authorize();
  });
  
  self.add(loginButton);

  return self;
}

module.exports = LoginView;
