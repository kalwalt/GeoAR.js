window.onload = () => {
    const scene = document.querySelector('a-scene');
    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {
            const box = document.createElement('a-box');
            let latitude, longitude;
            latitude = position.coords.lat;
            longitude = position.coords.long;
            box.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
            box.setAttribute('color:','yellow');
            console.log('model at: ${latitude}, ${longitude}');
            box.setAttribute('scale', '20, 20');
            box.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));
            scene.appendChild(box);
    },
    (err) => console.error('Error in retrieving position', err),
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 27000,
    }

  );
};
