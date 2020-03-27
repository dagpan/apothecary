console.log("Hey There")

const detailsUl = document.querySelector("#details-container")
const namePlate = document.querySelector("#place-name")
const servicesUl = document.querySelector("#services-container")
const getPharmaciesBtn = document.querySelector("#get-results")
const newServiceForm = document.querySelector("#new-service-form")


let addService = false
let showDetails = true
var map
var service
var infowindow

function initMap() {
  let centerMap = {lat: 40.627103, lng: -74.029562}

  map = new google.maps.Map(document.getElementById('map'), {
          center: centerMap,
          zoom: 15
        })

    getPharmaciesBtn.addEventListener(("click"), ()=> {
                 //   Reset the markers on the current map 
        const markers = []
        createMarker(null)
                //   Reset the current map to the new location for the search
        const newMapBounds = map.getBounds() 
        const request = {
          bounds: newMapBounds,
        //  location: centerMap,
        //  radius: '1200',
          type: ['pharmacy'],
          fields: ['name', 'icon', 'rating', 'formatted_address', 'place_id', 'geometry']
        }
   
        service = new google.maps.places.PlacesService(map)
        service.nearbySearch(request, getResults)
        function getResults(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log(results)
            for (var i = 0; i < results.length; i++) {
                 //   Creates the markers on the map with the results that came in
              createMarker(results[i])
            }
          }
        }
      
        function createMarker(place) {
          if (place) {
            infowindow = new google.maps.InfoWindow()

            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
                }
    
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
                })

            markers.push(marker)

            google.maps.event.addListener(marker, 'click', function() {
                   // Adds an event listener on the markers on the map
                    //  Makes the add service button show or not
                    // showDetails = !showDetails
                if (showDetails) { addServiceBtn.style.display = "block" } else { addServiceBtn.style.display = "none" }
                let placeRating = 0
                if (place.rating) { placeRating = place.rating } else { placeRating = 0 } 
                  //   Adds an info window on the clicked marker on the map     
                infowindow.setContent('<div><p id="title">' + place.name + '</p><p id="address">' + 
                place.vicinity + '</p><p id="rating">Rating:  <strong>' + placeRating + '</strong></p></div>')
                // place.vicinity + '</p><p id="rating">Rating:  <strong>' + place.rating + '</strong></p></div>' +
                // '<div class="view-link"> <a target="_blank" jstcache="6" href="https://www.google.com/maps/search/?api=1&query='+place.geometry.location+'&query_place_id='+place.place_id+'"> <span> View on Google Maps </span> </a>')
                infowindow.open(map, this)
                    // reset the left side
                if (detailsUl.children.length > 0) { detailsUl.innerHTML = `` }
                if (servicesUl.children.length > 0) { servicesUl.innerHTML = `` }
                    //  Does a fetch to see if the pharmacy exists on the backend
                fetch(`http://localhost:3000/pharmacies/${place.place_id}`)
                 .then(response => response.json())
                 .then(pharmacyData => {
                      console.log(pharmacyData)
                   if (pharmacyData) { 
                      newServiceForm.dataset["id"] = onePharmacy.id
                      //   Adds the details of the object on the side list
                      namePlate.textContent = `${pharmacyData.name}`  
                      const detailsLi = document.createElement('li')
                      detailsLi.dataset["id"] = pharmacyData.place_id
                      detailsLi.className = "item"
                      detailsLi.innerHTML = `
                      <h3>${pharmacyData.full_address[0]}</h3>
                      <h4 id="${pharmacyData.id}">Rating:  ${pharmacyData.rating}</h4>
                      `
                      detailsUl.append(detailsLi)
                      renderServices(pharmacyData)                     
                  } else {
                      let placeRating = 0
                      if (place.rating) { placeRating = place.rating } else { placeRating = 0 }    
                          //   Gather the data to send to the backend
                      const newPharmacy = {
                              name: place.name,
                              place_id: place.place_id,
                              rating: placeRating,
                              vicinity: place.vicinity
                              }
                          //        send it to the backend
                      fetch("http://localhost:3000/pharmacies", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json", 
                                "Accept": "application/json" 
                                    },
                            body: JSON.stringify(newPharmacy)
                            })
                          .then(response => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    throw Error("Bad request")
                                }
                              })
                          .then(NewPharmacyData => {  
                                newServiceForm.dataset["id"] = NewPharmacyData.id
                                console.log(NewPharmacyData)
                                //   Adds the details of the object on the side list
                                namePlate.textContent = `${place.name}`  
                                const detailsLi = document.createElement('li')
                                detailsLi.dataset["id"] = place.place_id
                                detailsLi.className = "item"
                                detailsLi.innerHTML = `
                                <h3>${place.vicinity}</h3>
                                <h4>Rating:  ${placeRating}</h4>
                                `
                                detailsUl.append(detailsLi)
                                //   render the services the Pharmacy has on the DOM
                                const firstServiceLi = document.createElement('li')
                                firstServiceLi.id = "first"
                                firstServiceLi.innerHTML = `
                                <h4 class="item">Looks like the Pharmacy has No Services
                                Why Don't You Start By Adding One?</h4>
                                `
                                servicesUl.append(firstServiceLi)
                              })
                    }
                })

                function renderServices(onePharmacy) {
                      // Adds the services of the object on the side list    -- 
                     onePharmacy.services.forEach(element => {
                           console.log(element)
                           const servicesLi = document.createElement('li')
                           servicesLi.dataset["id"] = element.id
                           servicesLi.innerHTML = `
                           <h4 class="item">${element.description}</h4>
                           <h5 align-items="center"><button id="delete-service-btn"> Delete Me </button></h5>
                           `
                           servicesUl.append(servicesLi)
                           const deleteServiceBtn = servicesLi.querySelector("#delete-service-btn")
                           deleteServiceBtn.addEventListener("click", deleteService)
                        })
                }

                function deleteService(event) {         
                      const badLi = event.target.parentElement.parentElement
                      const badLiId = badLi.dataset.id
                      let errorMessage = "Something Went Very Wrong"
                      let customMessage = "Service Successfully Deleted"
                       //  Check id user that created the service and then 
                      //  if (response.ok) {
                      //   window.alert(`${customMessage}`)
                      //   badLi.remove()
                      // } else {
                      //   window.alert(`${errorMessage}`)
                      // }

                      fetch(`http://localhost:3000/services/${badLiId}`, {
                        method: "DELETE"
                      })
                        .then(response => {
                              if (response.ok) {
                                  window.alert(`${customMessage}`)
                                  badLi.remove()
                                  if (servicesUl.children.length === 0) { 
                                      const firstServiceLi = document.createElement('li')
                                      firstServiceLi.id = "first"
                                      firstServiceLi.innerHTML = `
                                      <h4 class="item">Looks like the Pharmacy has No Services
                                      Why Don't You Start By Adding One?</h4>
                                      `
                                      servicesUl.append(firstServiceLi)
                                    }
                                } else {
                                  window.alert(`${errorMessage}`)
                                }
                              console.log(response)
                        })
                }

                newServiceForm.addEventListener("submit", () => {
                       event.preventDefault()
                       if (servicesUl.firstElementChild.id === "first") { servicesUl.innerHTML = `` }
                     // get the form input  
                       const newService = {
                             description: event.target["description"].value,
                             user_id: 2,
                             pharmacy_id: event.target.dataset.id
                            }
                      // send data  back
                  fetch("http://localhost:3000/services", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", 
                            "Accept": "application/json" 
                           },
                        body: JSON.stringify(newService)
                        })
                     .then(response => {
                           if (response.ok) {
                               return response.json()
                           } else {
                               throw Error("Bad request")
                           }
                       })
                     .then(newServiceData => {
                          console.log(newServiceData)
                          const servicesLi = document.createElement('li')
                          servicesLi.dataset["id"] = newServiceData.id
                          servicesLi.innerHTML = `
                          <h4 class="item">${newServiceData.description}</h4>
                          <h5 align-items="center"><button id="delete-service-btn"> Delete Me </button></h5>
                          `
                          servicesUl.append(servicesLi)
                          const deleteServiceBtn = servicesLi.querySelector("#delete-service-btn")
                          deleteServiceBtn.addEventListener("click", deleteService)
                      })
                     .catch(error => alert(error))
                     newServiceForm.reset()
                     modalNewService.style.display = "none"
                })
            })
          } else {
              //  Clear the map
                 return;
          } 
        }
    })
}
  
  
