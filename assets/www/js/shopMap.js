/**
 * 
 */

var map = null;

function getMyLocation() {
	var posOption = {
		maximumAge : 3000,
		timeout : 50000,
		enableHighAccuracy : true
	};
	navigator.geolocation.getCurrentPosition(onSuccess, onFail, posOption);
}
function onSuccess(position) {
//	var str = "위도 : " + position.coords.latitude + "<br> 경도 : "
	//		+ position.coords.longitude;

	//$("#test").html(str);

	map = new naver.maps.Map('map', {
		center : new naver.maps.LatLng(position.coords.latitude,
				position.coords.longitude),
		zoom : 10
	});

	var marker = new naver.maps.Marker({
		position : new naver.maps.LatLng(position.coords.latitude,
				position.coords.longitude),
		map : map
	});
}
function onFail(error) {
	alert("Error code : " + error.code + "/message : " + error.message);
}
//GPS 활성화 여부
function checkAvailability(){	  
 	cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
    	 $("#test").html("GPS location is " + (available ? "available" : "not available"));
        if(!available){
           checkAuthorization();
           $("#test").html("not ready");
        }else{
            $("#test").html("GPS location is ready to use");
            getMyLocation();
        }
    }, function(error){
    	 $("#test").html("The following error occurred: "+error);
    });
}

function checkAuthorization(){
    cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
        console.log("Location is " + (authorized ? "authorized" : "unauthorized"));
        if(authorized){
            checkDeviceSetting();
        }else{
            cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
                switch(status){
                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                        console.log("Permission granted");
                        checkDeviceSetting();
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                        console.log("Permission denied");
                        // User denied permission
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                        console.log("Permission permanently denied");
                        // User denied permission permanently
                        break;
                }
            }, function(error){
                console.error(error);
            });
        }
    }, function(error){
        console.error("The following error occurred: "+error);
    });
}

function checkDeviceSetting(){
    cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
        console.log("GPS location setting is " + (enabled ? "enabled" : "disabled"));
        if(!enabled){
            cordova.plugins.locationAccuracy.request(function (success){
                console.log("Successfully requested high accuracy location mode: "+success.message);
                //여기가 GPS활성화를 했을경우(확인을 선택경우)
                //이후 geolocation API 사용~~
                getMyLocation();
            }, function onRequestFailure(error){
                //여기는 GPS활성화를 안했을경우(취소를 선택한경우)
                //geolocation API 사용하면 안됨.
                console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
                if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                    if(confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }
    }, function(error){
        console.error("The following error occurred: "+error);
    });
}


