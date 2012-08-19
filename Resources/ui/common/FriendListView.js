function FriendListView() {
  
  var self = Ti.UI.createView();
  
  var data = [];
  var tableView = Ti.UI.createTableView();

  var Cloud = require('ti.Cloud');
  
  Cloud.Users.showMe(function (e) {
    if (e.success) {
      var me = e.users[0];
    
      Cloud.Friends.search({
          user_id: me.id
      }, function (e) {
        if (e.success) {
          Ti.API.info(e);

          for (var i = 0; i < e.users.length; i++) {
            var row = Ti.UI.createTableViewRow({
              className : "NomalCell",
              height : 100
            });
            
            var user = e.users[i];
  
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
  
            row.add(userNameLabel);
            row.add(userPicture);
            
            data.push(row);
          
          }
  
          tableView.data = data;
  
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
      });
    
    } else {
      alert('Error:\\n' +
          ((e.error && e.message) || JSON.stringify(e)));
    }
  });
  
  self.add(tableView);

  return self;
}

module.exports = FriendListView;
