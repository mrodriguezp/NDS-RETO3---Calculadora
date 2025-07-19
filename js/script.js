const background = document.getElementById("background");
const calculator = document.querySelector(".calculator");

background.addEventListener("click", () => {
  calculator.classList.add("show");
});
