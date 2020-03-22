// your code here!
console.log("🥧")
const newBakeForm = document.querySelector("form#new-bake-form")
const getWinner = document.querySelector("li#judge-bake-button")
newBakeForm.addEventListener("submit", handleSubmit)
getWinner.addEventListener("click", judgeBakes)
fetch("http://localhost:3000/bakes")
    .then(response => response.json())
    .then(bakeData => {
          renderAllBakes(bakeData)
    })
function renderAllBakes(inputBakes) {
         inputBakes.forEach(renderBake)
         renderBakeDetails(inputBakes[0])
}
function renderBake(bake) {
   const outerUl = document.querySelector("ul#bakes-container")
   const innerLi = document.createElement("li")
   innerLi.dataset["id"] = bake.id
   innerLi.innerText = bake.name
   innerLi.className = "item"
   outerUl.append(innerLi)
   innerLi.addEventListener("click", (ev) => {
           renderBakeDetails(bake)
   })
}
function renderBakeDetails(bake) {
   const outerDiv = document.querySelector("div#detail")
   const innerHeader = outerDiv.firstElementChild
   innerHeader.innerHTML = `
    <img src=${bake.image_url} alt=${bake.name}>
    <h1>${bake.name}</h1>
    <p class="description">
       ${bake.description}
    </p>
    <form id="score-form" data-id=${bake.id}>
      <input value="10" type="number" name="score" min="0" max="10" step="1">
      <input type="submit" value="Rate">
    </form>
    `
    outerDiv.append(innerHeader)
    const rateForm = innerHeader.querySelector("form#score-form")
    rateForm.addEventListener("submit", (ev) => {
        event.preventDefault()
        const newScore = ev.target.score.value
        fetch(`http://localhost:3000/bakes/${bake.id}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 699a9ff1-88ca-4d77-a26e-e4bc31cfc261"
                     },
            body: JSON.stringify({ score: newScore })
        })
    })
    rateForm.score.value = bake.score
}
function handleSubmit(event) {
    event.preventDefault()
    const newBake = {
         name:  event.target.name.value,
         image_url:  event.target.image_url.value,
         description:  event.target.description.value
        }
    fetch("http://localhost:3000/bakes", {
       method: "POST",
       headers: {              
            "Content-Type": "application/json",
            "Accept": "application/json"
                 },
       body: JSON.stringify(newBake)
    })
    .then(response => {
        if (response.ok) {
            return response.json()
          } else {
            throw Error("Bad request")
          }
        })
    .then(newBakeData => {
        renderBake(newBakeData)
    })
//    .catch(error => alert(error))
    newBakeForm.reset()
}
function judgeBakes(event) {
    fetch("http://localhost:3000/bakes/winner")
    .then(response => response.json())
    .then(bakeWinner => {
          const winnerItem = document.querySelector(`li[data-id="${bakeWinner.id}"]`)
          winnerItem.className = "item winner"
    })
}
