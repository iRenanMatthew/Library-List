const currentYear = document.querySelector(".footer__year");
const year = new Date().getUTCFullYear();
currentYear.innerHTML = year;

const addBookBtn = document.querySelector(".main__btn__add");
const cancelBookBtn = document.querySelector(".dialog__btn__cancel");
const addBookDialog = document.querySelector(".main__content__dialog");

addBookBtn.addEventListener("click", () => {
  addBookDialog.showModal();
  addBookDialog.classList.add("show");
});
cancelBookBtn.addEventListener("click", () => {
  addBookDialog.close();
  addBookDialog.classList.remove("show");
});

window.onclick = function (e) {
  if (e.target == addBookDialog) {
    addBookDialog.classList.remove("show");
    addBookDialog.close();
  }
};
