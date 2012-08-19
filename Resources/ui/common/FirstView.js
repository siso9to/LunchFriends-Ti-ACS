function FirstView() {
    var self = Ti.UI.createView({});
    
    if (Ti.Facebook.loggedIn == false) {
      var ViewUtil = require('ui/common/ViewUtil');
      new ViewUtil().openLoginViewModal();
    }

    var logo = Titanium.UI.createImageView({
        image: 'images/logo.png',
        top:20,
        height : 87,
        width : 280,
    });
    
    self.add(logo);

    var cameraButton = Titanium.UI.createButton({
        backgroundImage : 'images/camera.png',
        top : 150,
        height : 52,
        width : 52,
    });

    var mapButton = Ti.UI.createButton({
        backgroundImage : 'images/world.png',
        top : 220,
        height : 52,
        width : 52,
    });

    var listButton = Ti.UI.createButton({
        backgroundImage : 'images/folder.png',
        top : 290,
        height : 52,
        width : 52,
    });
    
    var friendRequestsButton = Ti.UI.createButton({
        title: "友達申請",
        top : 150,
        height : 52,
        right: 25,
        width : 100,
    });
    
    var friendListButton = Ti.UI.createButton({
        title: "友達リスト",
        top : 220,
        height : 52,
        right: 25,
        width : 100,
    });

    self.add(cameraButton);
    self.add(mapButton);
    self.add(listButton);
    self.add(friendRequestsButton);
    self.add(friendListButton);

    friendListButton.addEventListener('click', function(e) {
        var ApplicationWindow = require('ui/handheld/ApplicationWindow');
        var FriendListView = require('ui/common/FriendListView');

        var friendListView = new FriendListView();
        var appWin = new ApplicationWindow();

        appWin.add(friendListView);
        appWin.showNavBar();
        LunchLog.tabs.activeTab.open(appWin);
    });

    friendRequestsButton.addEventListener('click', function(e) {
        var ApplicationWindow = require('ui/handheld/ApplicationWindow');
        var FriendRequestsView = require('ui/common/FriendRequestsView');

        var friendRequestsView = new FriendRequestsView();
        var appWin = new ApplicationWindow();

        appWin.add(friendRequestsView);
        appWin.showNavBar();
        LunchLog.tabs.activeTab.open(appWin);
    });

    mapButton.addEventListener('click', function(e) {
        var ApplicationWindow = require('ui/handheld/ApplicationWindow');
        var HistoryView = require('ui/common/HistoryView');

        var historyView = new HistoryView();
        var appWin = new ApplicationWindow();

        appWin.add(historyView);
        appWin.showNavBar();
        LunchLog.tabs.activeTab.open(appWin);

    });

    listButton.addEventListener('click', function(e) {
        var ApplicationWindow = require('ui/handheld/ApplicationWindow');
        var ListView = require('ui/common/ListView');

        var listView = new ListView();
        var appWin = new ApplicationWindow();

        appWin.add(listView);
        appWin.showNavBar();

        LunchLog.tabs.activeTab.open(appWin);
    });
    var sourceSelect = Titanium.UI.createOptionDialog({
        options : ['撮影する', 'アルバムから選ぶ', 'キャンセル'],
        cancel : 2,
        title : '写真を添付'
    });

    sourceSelect.addEventListener('click', function(e) {

        switch( e.index ) {
            case 0:
                Titanium.Media.showCamera({
                    success : function(event) {
                        var cropRect = event.cropRect;
   
                        var image = event.media;
                     
                        var ApplicationWindow = require('ui/handheld/ApplicationWindow');
                        var PostView = require('ui/common/PostView');
                        var postView = new PostView(image);
                        var appWin = new ApplicationWindow();
                                                
                        appWin.add(postView);
                        appWin.showNavBar();
                     
                        LunchLog.tabs.activeTab.open(appWin);
                    },
                    cancel : function() {
                        alert('canceled');
                    },
                    error : function(error) {
                        alert(error);
                    },
                    saveToPhotoGallery : true,
                    allowEditing : true,
                    mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
                });
   
                break;
            case 1:
                Titanium.Media.openPhotoGallery({
                    success : function(event) {
                        var image = event.media;

                        var ApplicationWindow = require('ui/handheld/ApplicationWindow');
                        var PostView = require('ui/common/PostView');
                        var postView = new PostView(image);
                        var appWin = new ApplicationWindow();
                                                
                        appWin.add(postView);
                        appWin.showNavBar();

                        LunchLog.tabs.activeTab.open(appWin);
                    },
                    error : function(error) {
                        alert(error);
                    },
                    cancel : function() {
                        alert('canceled');
                    },
                    // 選択直後に拡大縮小移動をするか否かのフラグ
                    allowEditing : true,
                    // 選択可能なメディア種別を配列で指定
                    mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
                });

                break;
            case 2:
                break;
        }

    });

    cameraButton.addEventListener('click', function() {
        sourceSelect.show();
    });
    return self;
}

module.exports = FirstView;
