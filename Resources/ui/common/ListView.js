function ListView() {
  var self = Ti.UI.createView();
  
  var tableView = Ti.UI.createTableView();

  var formatDate = function() {
    var date = new Date();
    var datestr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    if(date.getHours() >= 12) {
      datestr += ' ' + (date.getHours() == 12 ? date.getHours() : date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
    } else {
      datestr += ' ' + date.getHours() + ':' + date.getMinutes() + ' AM';
    }
    return datestr;
  }
  
  var formatCreatedAt = function(date) {
    var date_str = date.substr(0,19);
    
    return date_str.replace("T", " ");
    
  }

  var showList = function() {
    var data = [];

    if(Titanium.Network.online == false) {
      return;
    }
 
    var Cloud = require('ti.cloud');
 
    Cloud.Statuses.search({
    }, function (e) {
      if (e.success) {
        
        var statuses = e.statuses;
        var lastRow = statuses.length - 1;
        
        for (var i = 0; i < statuses.length; i++) {
          var status = statuses[i];
          
          var row = Ti.UI.createTableViewRow({
            className : "NomalCell",
            height : 340
          });
         
          var userLabel = Titanium.UI.createLabel({
            text : status.user.last_name + " " + status.user.first_name,
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
          
          userLabel.addEventListener('click', function(e) {
            var ApplicationWindow = require('ui/handheld/ApplicationWindow');
            var FriendInfoView = require('ui/common/FriendInfoView');
  
            var friendInfoView = new FriendInfoView(statuses[e.index].user);
            var appWin = new ApplicationWindow();
  
            appWin.add(friendInfoView);
            LunchLog.tabs.activeTab.open(appWin);
          });

          row.add(userLabel);

          var userPicture = Ti.UI.createImageView({
            image : status.user.custom_fields.picture, 
            width : 25,
            height : 25,
            top : 10,
            left : 35,
          });
         
          row.add(userPicture);
          
          var createdAtLabel = Titanium.UI.createLabel({
            text : formatCreatedAt(status.created_at),
            font : {
              fontSize : 12,
              fontWeight : 'bold'
            },
            color : '#576996',
            bottom : 5,
            right : 35,
            height : 20,
            width : 'auto'
          });
          
          row.add(createdAtLabel);
         
          if(status.message != null) {
            
            var titleLabel = Titanium.UI.createLabel({
              text : status.message,
              font : {
                fontSize : 14,
                fontWeight : 'bold'
              },
              color : '#576996',
              bottom : 20,
              left : 35,
              height : 20,
              width : 'auto'
            });
            
            row.add(titleLabel);
         
          }
         
          if(status.photo) {
            var frameLabel = Titanium.UI.createLabel({
              width : 250,
              height : 250,
              top : 40,
              left : 35,
              backgroundColor : '#BEBEBE',
              opacity : 0.2,
            });
         
            var photo = Ti.UI.createImageView({
              image : status.photo.urls.small_240, 
              width : 240,
              height : 240,
              top : 45,
              left : 40,
              zIndex : 10,
            });
         
            row.add(frameLabel);
            row.add(photo);
          }
         
          data.push(row);
 
        }

        tableView.data = data;

      } else {
        alert('Error:\\n' +
          ((e.error && e.message) || JSON.stringify(e)));
      }
    });
  
    
    var border = Ti.UI.createView({
      backgroundColor : "#576c89",
      height : 2,
      bottom : 0
    });
    
    var tableHeader = Ti.UI.createView({
      backgroundColor : "#e2e7ed",
      width : 320,
      height : 60
    });
    
    // fake it til ya make it..  create a 2 pixel
    // bottom border
    tableHeader.add(border);
    var arrow = Ti.UI.createView({
      backgroundImage : "images/whiteArrow.png",
      width : 23,
      height : 60,
      bottom : 10,
      left : 20
    });
    
    var statusLabel = Ti.UI.createLabel({
      text : "Pull to reload",
      left : 55,
      width : 200,
      bottom : 30,
      height : "auto",
      color : "#576c89",
      textAlign : "center",
      font : {
        fontSize : 13,
        fontWeight : "bold"
      },
      shadowColor : "#999",
      shadowOffset : {
        x : 0,
        y : 1
      }
    });
    
    var lastUpdatedLabel = Ti.UI.createLabel({
      text : "Last Updated: " + formatDate(),
      left : 55,
      width : 200,
      bottom : 15,
      height : "auto",
      color : "#576c89",
      textAlign : "center",
      font : {
        fontSize : 12
      },
      shadowColor : "#999",
      shadowOffset : {
        x : 0,
        y : 1
      }
    });
    
    var actInd = Titanium.UI.createActivityIndicator({
      left : 20,
      bottom : 13,
      width : 30,
      height : 30
    });
    
    tableHeader.add(arrow);
    tableHeader.add(statusLabel);
    tableHeader.add(lastUpdatedLabel);
    tableHeader.add(actInd);
    
    tableView.headerPullView = tableHeader;
    
    var pulling = false;
    var reloading = false;
    
    function beginReloading() {
      // just mock out the reload
      setTimeout(endReloading, 2000);
    }
    
    function endReloading() {
      /*
      // simulate loading
      for(var c = lastRow; c < lastRow + 10; c++) {
        tableView.insertRowBefore(0, {
          title : "Row " + c
        });
      }
      lastRow += 10;
      
      */
    
      // when you're done, just reset
      tableView.setContentInsets({
        top : 0
      },
      {
        animated : true
      });
      reloading = false;
      lastUpdatedLabel.text = "Last Updated: " + formatDate();
      statusLabel.text = "Pull down to refresh...";
      actInd.hide();
      arrow.show();
    }
    
    
    tableView.addEventListener('scroll', function(e) {
      var offset = e.contentOffset.y;
      if(offset <= -65.0 && !pulling) {
        var t = Ti.UI.create2DMatrix();
        t = t.rotate(-180);
        pulling = true;
        arrow.animate({
          transform : t,
          duration : 180
        });
        statusLabel.text = "Release to refresh...";
      } else if(pulling && offset > -65.0 && offset < 0) {
        pulling = false;
        var t = Ti.UI.create2DMatrix();
        arrow.animate({
          transform : t,
          duration : 180
        });
        statusLabel.text = "Pull down to refresh...";
      }
    });
    
    tableView.addEventListener('scrollEnd', function(e) {
      if(pulling && !reloading && e.contentOffset.y <= -65.0) {
        reloading = true;
        pulling = false;
        arrow.hide();
        actInd.show();
        statusLabel.text = "Reloading...";
        tableView.setContentInsets({
          top : 60
        }, {
          animated : true
        });
        arrow.transform = Ti.UI.create2DMatrix();
        beginReloading();
      }
    });
    
    self.add(tableView);
  
  }

  showList();

  return self;
}

module.exports = ListView;

