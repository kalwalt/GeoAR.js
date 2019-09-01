const loadPlaces = function(coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    const method = 'api';
    let place_count = 0;
    let tot;
    let name;

    const PLACES = [
        {
            name: 'gigi',
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data
            }
        },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return PLACES;
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: '',
        clientSecret: '',
        version: '',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};



window.onload = () => {
    const scene = document.querySelector('a-scene');
    // first get current user location
    var gui = new dat.GUI();
    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {
            // than use it to load from remote APIs some places nearby
            loadPlaces(position.coords)
              .then((places) => {
                //console.log(places.lenght);
                if(places.lenght < 1) {
                console.log("no places!")
              } else {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    const box = document.createElement('a-box');
                    //console.log(place);

                    const addBox = function(place, position) {
                    place.location.lat = position.coords.lat;
                    place.location.lng = position.coords.lng;
                    place.push();
                    };
                    const params = {
                      addBox: addBox()
                    };
                    gui.add( params, 'addBox' );

                    box.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    box.setAttribute('color:','yellow');
                    console.log('model at: ${latitude}, ${longitude}');
                    box.setAttribute('scale', '20, 20');
                    box.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));
                    scene.appendChild(box);
                  });
                }
            })
    },
    (err) => console.error('Error in retrieving position', err),
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 27000,
    }

  );
};
