function FriendInfoView(user) {
  Ti.API.info(user);
  
  var self = Ti.UI.createView();
  
  var userNameLabel = Titanium.UI.createLabel({
    text : user.last_name + " " + user.first_name,
    font : {
      fontSize : 14,
      fontWeight : 'bold'
    },
    color : '#576996',
    top : 15,
    left : 70,
    height : 20,
    width : 'auto'
  });
  
  var userPicture = Ti.UI.createImageView({
    image : user.custom_fields.picture, 
    width : 50,
    height : 50,
    top : 40,
    left : 35,
  });
         
  var addFriendButton = Ti.UI.createButton({
      title : "友達申請する",
      top : 40,
      height : 30,
      width : 150,
      left : 90
  });

  self.add(userNameLabel);
  self.add(addFriendButton);
  self.add(userPicture);

  var Cloud = require('ti.Cloud');
  
  addFriendButton.addEventListener('click', function(e) {

    Cloud.Friends.add({
        user_ids: user.id
    }, function (e) {
        if (e.success) {
            alert('Friend(s) added');
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
  });

  
  Cloud.Friends.requests(function (e) {
      if (e.success) {
          alert('Success:\\n' +
              'Count: ' + e.friend_requests.length);
          for (var i = 0; i < e.friend_requests.length; i++) {
              var user = e.friend_requests[i].user;
              alert('id: ' + user.id + '\\n' +
                  'first name: ' + user.first_name + '\\n' +
                  'last name: ' + user.last_name);
          }
      } else {
          alert('Error:\\n' +
              ((e.error && e.message) || JSON.stringify(e)));
      }
  });

  return self;
}

module.exports = FriendInfoView;
