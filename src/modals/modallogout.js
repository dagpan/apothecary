//     ----------------   LOGOUT FORM   -------------

const appRate = document.querySelector("#apprate")
const modalLogout = document.querySelector("#modallogout")
const LogOutBtn = document.querySelector("#log-out-button")
const rateAppBtn = document.querySelector("#rate-app-button")


LogOutBtn.addEventListener("click", () => {
      // Show the Logout Form
     let addRate = false
     modalLogout.style.display = "block"
   
     rateAppBtn.addEventListener("click", () => {
      // hide & seek with the Rate 
           addRate = !addRate
           if (addRate) {
               appRate.style.display = "block"
           } else {
               appRate.style.display = "none"
           }
      }) 
})
modalLogout.addEventListener("click", e => {
       // Hide the Logout Form
       if (e.target.dataset.action === "close") {
           modalLogout.style.display = "none"
           modalLogin.style.display = "none"
        }
})
document.querySelector("#logoff-btn").addEventListener("click", () => { location.reload(true) })
  
