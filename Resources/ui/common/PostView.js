function PostView(image) {

  var self = Titanium.UI.createScrollView({
    contentWidth : 'auto',
    contentHeight : 'auto',
    top : 0,
    bottom : 0,
    showVerticalScrollIndicator : true,
    showHorizontalScrollIndicator : true
  });

  var imageView = Ti.UI.createImageView({
    top : 10,
    width : 250,
    height : 250,
    image : image,
  });

  self.add(imageView);
  
  var titleText = Titanium.UI.createTextField({
      color : '#336699',
      top : 270,
      left : 35,
      width : 250,
      height : 40,
      hintText : 'お店',
      font : {
          fontSize : 14,
          fontFamily : 'Marker Felt',
          fontWeight : 'bold'
      },
      keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
      borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
  });
  
  self.add(titleText);

  var textArea = Titanium.UI.createTextArea({
    color : '#336699',
    height : 70,
    width : 250,
    top : 320,
    font : {
      fontSize : 14,
      fontFamily : 'Marker Felt',
      fontWeight : 'bold'
    },
    textAlign : 'left',
    keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
    returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
    borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    borderRadius : 5,
    borderWidth: 1,
    borderColor:'#bbb',
  });

  self.add(textArea);

  var postButton = Ti.UI.createButton({
    color : '#000000',
    title : '送信',
    top : 400,
    height : 30,
    width : 60,
  });

  self.add(postButton);

  postButton.addEventListener('click', function() {
    if (textArea.value != '') {
      var Cloud = require('ti.cloud');
      
      // longitudeなどの桁数変えたらOKなのか調査
      Cloud.Places.create({
        country: "Japan",
        name: titleText.value,
      }, function (e) {
        if (e.success) {
          var place = e.places[0];

          Cloud.Statuses.create({
            place_id: place.id,
            message: textArea.value,
            photo: image,
          }, function (e) {
            if (e.success) {
              var status = e.statuses[0];
              Ti.API.info(status);

              alert("送信されました");

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
      
    }
    else {
      alert("メッセージを入力してください");
    }
  });

  self.setImage = function(image) {
    imageView.image = image;
  }

  self.postData = function(image, data) {
  }

  return self;
}

module.exports = PostView;
