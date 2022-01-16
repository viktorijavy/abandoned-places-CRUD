(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  
 

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
      center: place.geometry.coordinates, // starting position [lng, lat]
      zoom: 10 // starting zoom
  });
  
  new mapboxgl.Marker()
      .setLngLat(place.geometry.coordinates)
      .setPopup(
          new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                  `<h3>${place.title}</h3><p>${place.location}</p>`
              )
      )
      .addTo(map)