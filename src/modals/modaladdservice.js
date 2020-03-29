//     ----------------   Pharmacy New Service Form    -------------

const modalNewService = document.querySelector("#modal-new-service")
const addServiceBtn = document.querySelector("#add-service-button")

addServiceBtn.addEventListener("click", () => {
// // Show the ADD Pharmacy Services Form
              modalNewService.style.display = "block"
})
// Hide the add pharmacy services form
modalNewService.addEventListener("click", e => {
    if (e.target.dataset.action === "close") {
        modalNewService.style.display = "none"
    }
})

