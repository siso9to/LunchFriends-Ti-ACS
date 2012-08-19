function HistoryView() {
    //create object instance, a parasitic subclass of Observable
    var self = Ti.UI.createView();
    
    var addAnnotaions = function() {
      if(Titanium.Network.online == false){
          return;
      }
    
      var Cloud = require('ti.cloud');
      
      Cloud.Users.showMe(function (e) {
        if (e.success) {
          var user = e.users[0];
          
          Cloud.Statuses.search({
            user_id: user.id
          }, function (e) {
            if (e.success) {
              var thumbs = [];
              var annotations = [];
              var mapview;
              
              var statuses = e.statuses;

              Titanium.Geolocation.distanceFilter = 10;
              Ti.Geolocation.purpose = 'To obtain user location for tracking distance traveled.';
              Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
             
              Ti.Geolocation.getCurrentPosition(function(e){
                if (e.error) {
                  alert(e.error);
                  return;
                }
                else {    
                  mapview = Ti.Map.createView({
                    top:0,
                    height:380,
                    mapType:Titanium.Map.STANDARD_TYPE,
                    animate:true,
                    regionFit:true,
                    region:{
                      latitude:e.coords.latitude,
                      longitude:e.coords.longitude,
                      altitude:e.coords.altitude,
                      latitudeDelta:0.04,
                      longitudeDelta:0.04,
                    },
                    userLocation:true,
                  });
                    
             
                  self.add(mapview);
                  
                  var thumb;
                  
                  for (var i = 0; i < statuses.length; i++) {
                    var status = statuses[i];
                     
                    Ti.API.info(status);
                      
                    var photo_name = '';
                    
                    if (status.photo) {
                        photo_name = status.photo.urls.small_240;
                  
                        var image = Titanium.UI.createImageView({
                          image: photo_name,
                        }).toImage();
                        
                        var thumb = Titanium.UI.createImageView({
                          image: image.imageAsThumbnail(80),
                        }).toImage();
                        
                        thumbs.push(thumb);
                    }
                    
                    Ti.API.info(status.place);

                    var annotation = Titanium.Map.createAnnotation({
                            subtitle:status.message,
                            latitude: status.place.latitude,
                            longitude: status.place.longitude,
                            pincolor:Titanium.Map.ANNOTATION_GREEN,
                            animate:true,
                    });
                    
                    if (status.place.name) {
                        annotation.title = status.place.name;
                    }
                    else {
                        annotation.title = 'タイトル無し';
                    }
             
                    annotations.push({
                        annotation: annotation,
                        latitude  : status.place.latitude,
                        longitude : status.place.longitude
                    });
             
                    mapview.addAnnotation(annotation);
             
                    if (i == 0) {
                        mapview.selectAnnotation(annotation, true);
                    }
                  }
                }
                
                var coverFlow = Titanium.UI.iOS.createCoverFlowView({
                    images: thumbs,
                    top: 280,
                    backgroundColor: '#fff',
                    zIndex: 5,
                    opacity: 0.75,
                });
                coverFlow.addEventListener('change',function(e) {
                    Titanium.API.info("image changed: "+e.index+', selected is '+coverFlow.selected);
                    
                    mapview.selectAnnotation(annotations[e.index].annotation, true);
                    mapview.setLocation({
                        latitude: annotations[e.index].latitude,
                        longitude: annotations[e.index].longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,
                    });
                });
                self.add(coverFlow);
                
                mapview.show();
              });
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
    };
    
    addAnnotaions();

    return self;
}

module.exports = HistoryView;
