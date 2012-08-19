function FriendRequestsView(user) {
  
  var self = Ti.UI.createView();
  
  var data = [];
  var tableView = Ti.UI.createTableView();

  var Cloud = require('ti.Cloud');
  
  Cloud.Friends.requests(function (e) {
    if (e.success) {
      
      for (var i = 0; i < e.friend_requests.length; i++) {
        var row = Ti.UI.createTableViewRow({
          className : "NomalCell",
          height : 340
        });
        
        var user = e.friend_requests[i].user;

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
               
        var approveFriendButton = Ti.UI.createButton({
            title : "承認する",
            top : 40,
            height : 30,
            width : 150,
            left : 90
        });
   
        approveFriendButton.addEventListener('click', function(e) {
          Cloud.Friends.approve({
              user_ids: user.id
          }, function (e) {
              if (e.success) {
                  alert('Friend(s) approved');
                  
                  Ti.API.info(e);

                  tableView.deleteRow(e.index,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP});
              } else {
                  alert('Error:\\n' +
                      ((e.error && e.message) || JSON.stringify(e)));
              }
          });
        });

        row.add(userNameLabel);
        row.add(approveFriendButton);
        row.add(userPicture);
        
        data.push(row);
      
      }

      tableView.data = data;

    } else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
  });
  
  self.add(tableView);

  return self;
}

module.exports = FriendRequestsView;
