
function sendInfo() {
  var experience = document.getElementById('experience').value;
  var earnings = document.getElementById('earnings').value;
  var distance = document.getElementById('distance').value;
  var employees = document.getElementById('employees').value;

  if( !/^[0-9]+$/.test(experience) || !/^[0-9]+$/.test(earnings) || !/^[0-9]+$/.test(distance) || !/^[0-9]+$/.test(employees)) {
    alert("Błędne dane");
    return false;
  }
  else {
    return true;
  }
}


function pushForward(marker) {
  var info = sendInfo();

  if(info == true) {
		if(typeof marker !== 'undefined') {

      document.getElementById('score-part').style.display = "block";
      document.getElementById('score-part').scrollIntoView();

			offers = undefined;

			$.ajax({
				url: '/markers',
				type: 'GET',
				async: false,
				success: function(response) {
					console.log(response);
					offers = JSON.parse(response);
					for(var i=0; i<offers.length; i++) {
						offers[i].distance = ((marker.getLatLng()).distanceTo(offers[i].coordinates)) / 1000.0;
					}
				},
				error: function(error) {
					console.log("Ajax error has occured.");
					return;
				}
			});

			$.ajax({
				url: '/best-offer',
				type: 'GET',
				data: {
					"experience": document.getElementById('experience').value,
					"earnings": document.getElementById('earnings').value,
					"distance": document.getElementById('distance').value,
					"employees": document.getElementById('employees').value,
					"offers": JSON.stringify(offers)
				},
				contentType: 'application/json;charset=UTF-8',
				success: function(response) {
					console.log(response);
					var offer = JSON.parse(response);
					document.getElementById('best-offer-company').innerHTML = offer.name;
					document.getElementById('best-offer-adress').innerHTML = offer.address;
					document.getElementById('best-offer-profil').innerHTML = offer.position + " developer";
					document.getElementById('best-offer-earnings').innerHTML = offer.earnings + " PLN";
					document.getElementById('best-offer-employees').innerHTML = offer.employees + " pracowników";
					document.getElementById('best-offer-distance').innerHTML = (offer.distance).toFixed(2) + " km odległości";;
				},
				error: function(error) {
					console.log("Ajax error has occured.");
					return;
				}
			});
		}
		else {
			alert("Należy wybrać miejsce zamieszkania zaznaczając je na mapie");
      document.getElementById('menu-part').scrollIntoView();
		}
  }
  else {
    document.getElementById('menu-part').scrollIntoView();
  }
}

$(document).ready(function() {
    lmap = L.map('mapid').setView([50.06144, 19.93735], 12);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 25,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoieWFtaWJha3VyYTY2NiIsImEiOiJjajZ3bjI2eXExZGQ3MzJycDFpajdraHU3In0.0hDkYoX-3yPuSv6n5UgnHQ'
	}).addTo(lmap);

	liconJob = L.icon({
		iconUrl: document.URL+'job-icon',
		iconSize:     [48, 24],
		iconAnchor:   [24, 12]
	});

	$.ajax({
		url: '/markers',
		type: 'GET',
		success: function(response) {
			console.log(response);
			var offers = JSON.parse(response);
			for(var i=0; i<offers.length; i++) {
				L.marker([offers[i].coordinates[0], offers[i].coordinates[1]], {icon: liconJob}).addTo(lmap).bindPopup(offers[i].name.toString());
			}
		},
		error: function(error) {
			console.log("Ajax error has occured.");
			return;
		}
	});

	liconHome = L.icon({
		iconUrl: document.URL+'home-icon',
		iconSize:     [24, 24],
		iconAnchor:   [12, 12]
	});
	lmarkerHome = undefined;
	lmap.on('click', function(event) {
		if(typeof lmarkerHome !== 'undefined') {
			lmarkerHome.setLatLng(new L.LatLng(event.latlng.lat, event.latlng.lng));
			return;
		}
		lmarkerHome = L.marker([event.latlng.lat, event.latlng.lng], {icon: liconHome}).addTo(lmap).bindPopup("Twoje miejsce zamieszkania");
	});

	$("#confirm").click(function(){
    	return pushForward(lmarkerHome);
	});
});
