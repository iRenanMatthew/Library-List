const currentYear = document.querySelector(".footer__year");
const year = new Date().getUTCFullYear();
currentYear.innerHTML = year;

const addBookBtn = document.querySelector(".main__btn__add");
const cancelBookBtn = document.querySelector(".dialog__btn__cancel");
const addBookDialog = document.querySelector(".main__content__dialog");
const mainContent = document.querySelector(".main__content");
const bookForm = document.querySelector("#bookForm");

// Open dialog with 'show' class for animation

addBookBtn.addEventListener("click", () => {
  if (typeof addBookDialog.showModal === "function") {
    addBookDialog.classList.add("show");
    addBookDialog.showModal();
  } else {
    alert("Sorry, your browser doesn't support the dialog element.");
  }
});

// Close dialog on cancel button, prevent propagation
cancelBookBtn.addEventListener("click", closeDialogWithAnimation);

// Function to close the dialog after animation
function closeDialogWithAnimation() {
  addBookDialog.classList.add("hide"); // Add the hide class
  setTimeout(() => {
    addBookDialog.classList.remove("show", "hide"); // Remove both classes after animation
    addBookDialog.close(); // Close the dialog
  }, 200); // Match this duration with the CSS animation time
}

// Close dialog when clicking outside
window.onclick = function (e) {
  if (e.target == addBookDialog) {
    closeDialogWithAnimation();
  }
};

let myLibrary = [];
let mainContentHTML = "";

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.readStatus = function () {
  const result = this.read ? "Read" : "Not Yet";
  return console.log(result);
};

Book.prototype.pushList = function () {
  myLibrary.push(this);
};

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let book_title = document.querySelector("#book_title");
  let book_author = document.querySelector("#book_author");
  let book_pages = document.querySelector("#book_pages");
  let book_read = document.querySelector("#book_read");

  if (!book_title || !book_author || !book_pages || !book_read) {
    alert("Please Insert Required Forms");
  } else {
    if (!book_read.value) {
      book_read.value = false;
    } else {
      book_read.value = true;
    }

    addBooktoLibrary(
      book_title.value,
      book_author.value,
      book_pages.value,
      book_read.value
    );
  }

  book_title.value = "";
  book_author.value = "";
  book_pages.value = "";
  book_read.value = "";
  closeDialogWithAnimation();
});

function addBooktoLibrary(title, book, pages, read) {
  let reader = new Book(title, book, pages, read);
  reader.pushList();
  console.log(reader);
  console.log(myLibrary);
  updateList();
}
function updateList() {
  myLibrary.forEach(({ title, author, pages, read }) => {
    mainContentHTML += `
    <div class="main__content__card card">
        <div class="card__text">
              <p><span>Title:</span> ${title}</p>
              <p><span>Author:</span> ${author}</p>
              <p><span>Pages:</span> ${pages} pages</p>
              <p><span>Status:</span> ${read}</p>
            </div>
            <div class="card__btn">
              <button>Read</button>
              <button>Remove</button>
            </div>
          </div>`;
  });
  mainContent.innerHTML += mainContentHTML;
}
