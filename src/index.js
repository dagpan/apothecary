console.log("Hey There")

const detailsUl = document.querySelector("#details-container")
const namePlate = document.querySelector("#place-name")
const servicesUl = document.querySelector("#services-container")
const getPharmaciesBtn = document.querySelector("#get-results")
const newServiceForm = document.querySelector("#new-service-form")
const newUserForm = document.querySelector("#new-user-form")
const loginForm = document.querySelector("#login-form")
const userNamePlace = document.querySelector("#user-name")
const modalLogin = document.querySelector("#modal-login")
const registerBtn = document.querySelector("#register-button")
const newUser = document.querySelector("#register-user")

let userDataArray = []
let userFirstNames = {}
let userNamesArray = []
let registerNew = false
let addService = false
let showDetails = true
let map
let service
let infowindow

//  INITIAL USER FETCH TO PREPARE FOR LOGIN

fetch("http://localhost:3000/users")
     .then(response => {
           if (response.ok) {
              return response.json()
            } else {
              throw Error("Bad request")
            }
      })
     .then(userData => {  
           console.log(userData)
           userData.forEach((user) => {
                 userNamesArray.push(user.user_name)
                 userFirstNames[user.user_name] = user.first_name
           })
           userDataArray = userData
           console.log(userFirstNames)
           console.log(userNamesArray)
           console.log(userDataArray)
      })

function initMap() {
    let centerMap = {lat: 40.627103, lng: -74.029562}

    map = new google.maps.Map(document.getElementById('map'), {
          center: centerMap,
          zoom: 15
        })

        // Get the login pop up to show
    modalLogin.style.display = "block"
          
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
                place.vicinity + '</p><p id="rating">Rating:  <strong>' + placeRating + '</strong></p></div>'+
                '<div class="view-link"> <a target="_blank" jstcache="6" href="https://www.google.com/maps/search/?api=1&query='+place.geometry.location+'&query_place_id='+place.place_id+'"> <span> View on Google Maps </span> </a>')
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
                      newServiceForm.dataset["id"] = pharmacyData.id
                      //   Adds the details of the object on the side list
                      namePlate.textContent = `${pharmacyData.name}`  
                      const detailsLi = document.createElement('li')
                      detailsLi.dataset["id"] = pharmacyData.place_id
                      detailsLi.className = "item"
                      detailsLi.innerHTML = `
                      <h3>${pharmacyData.full_address}</h3>
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

                newServiceForm.addEventListener("submit", () => {
                       event.preventDefault()
                       if (servicesUl.firstElementChild.id === "first") { servicesUl.innerHTML = `` }
                     // get the form input  
                       const newService = {
                             description: event.target["description"].value,
                             user_id: userNamePlace.dataset.id,
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
                          servicesLi.dataset["userid"] = newServiceData.user_id
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

registerBtn.addEventListener("click", () => {
  // hide & seek with the Register Form
  registerNew = !registerNew
  if (registerNew) {
      newUser.style.display = "block"
  } else {
      newUser.style.display = "none"
  }
}) 
                  //-------------   User Login FORM   -------------
loginForm.addEventListener("submit", () => {
        event.preventDefault()
        const emptyUserNameMessage = "You need to Provide A UserName" 
        const noUserNameMessage = "The UserName You Provided, Does Not Exist In Our Records. Please Try Again or Register"
                          // get the form input  
        const userNameFromForm = event.target["name"].value
        if (userNameFromForm.length > 0) {
                     // look for that user at the results of the initial fetch 
            if (userNamesArray.includes(userNameFromForm)) {
                let currentUser = userDataArray.find(user => user.user_name === userNameFromForm)
                userNamePlace.textContent = `Welcome ${currentUser.first_name}`
                userNamePlace.dataset["id"] = currentUser.id
                loginForm.reset()
                modalLogin.style.display = "none"    
            } else {
                window.alert(`${noUserNameMessage}`)
                loginForm.reset()
            }
        } else {
            window.alert(`${emptyUserNameMessage}`)
            location.reload(true)     
        }               
})

newUserForm.addEventListener("submit", (event) => {
      event.preventDefault()
      const emptyFieldMessage = "You Left One Or More Fields Empty. Please Try Again" 
      const firstName = event.target["firstname"].value
      const lastName = event.target["lastname"].value
      const userName = event.target["username"].value
      if (firstName.length > 0) {
          if (lastName.length > 0) {
              if (userName.length > 0) {
                    // get the form input  
                 const newUserFromForm = {
                       first_name: firstName,
                       last_name: lastName,
                       user_name: userName
                        }
                      // send data  back
                 fetch("http://localhost:3000/users", {
                       method: "POST",
                       headers: {
                               "Content-Type": "application/json", 
                               "Accept": "application/json" 
                               },
                       body: JSON.stringify(newUserFromForm)
                        })
                    .then(response => {
                          if (response.ok) {
                              return response.json()
                          } else {
                              throw Error("Bad request")
                          }
                        })
                    .then(newUserData => {
                          console.log(newUserData)
                          userNamePlace.textContent = `Welcome ${firstName}`
                          userNamePlace.dataset["id"] = newUserData.id
                        })
                    .catch(error => alert(error))
                  newUserForm.reset()
                  modalLogin.style.display = "none"
              } else {
                window.alert(`${emptyFieldMessage}`)
                newUserForm.reset()
              }
          } else {
            window.alert(`${emptyFieldMessage}`)
            newUserForm.reset()
          }
      } else {
        window.alert(`${emptyFieldMessage}`)
        newUserForm.reset()
      }
})

function deleteService(event) {         
    const badLi = event.target.parentElement.parentElement
    const badLiId = badLi.dataset.id
    const errorMessage = "Something Went Very Wrong"
    const allGoodMessage = "Service Successfully Deleted"
    const notSameUserMessage = "It Seems That You Did Not Create This Service. Deleting Is Reserved For The Creator"
    const userLoggedIn = userNamePlace.dataset.id
    const userServiceCreator = badLi.dataset.userid
    if (userLoggedIn === userServiceCreator) {
        fetch(`http://localhost:3000/services/${badLiId}`, {
              method: "DELETE"
              })
           .then(response => {
                 if (response.ok) {
                     window.alert(`${allGoodMessage}`)
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
    } else {
    window.alert(`${notSameUserMessage}`)
    }
}

