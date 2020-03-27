//     ----------------   ADD SERVICE FORM   -------------
// Show the Add Service Form
const modalService = document.querySelector("#modalservice")
document.querySelector("#add-service-button").addEventListener("click", () => {
  modalService.style.display = "block"
})
// Hide the Add Service Form
modalService.addEventListener("click", e => {
  if (e.target.dataset.action === "close") {
    modalService.style.display = "none"
  }
})