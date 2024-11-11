const currentYear = document.querySelector(".footer__year");
const year = new Date().getUTCFullYear();
currentYear.innerHTML = year;

const addBookBtn = document.querySelector(".main__btn__add");
const cancelBookBtn = document.querySelector(".dialog__btn__cancel");
const addBookDialog = document.querySelector(".main__content__dialog");
const mainContent = document.querySelector(".main__content");
const bookForm = document.querySelector("#bookForm");
const dialogOverlay = document.querySelector(".dialog__overlay");

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
// window.onclick = function (e) {
//   if (e.target == addBookDialog) {
//     closeDialogWithAnimation();
//   }
// };

let myLibrary = [];
let mainContentHTML = "";

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.readStatus = function () {
  return this.read ? "Read" : "Not Yet";
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
    addBooktoLibrary(
      book_title.value,
      book_author.value,
      book_pages.value,
      book_read.checked
    );
  }

  book_title.value = "";
  book_author.value = "";
  book_pages.value = "";
  book_read.checked = false;
  closeDialogWithAnimation();
});

function addBooktoLibrary(title, author, pages, read) {
  let reader = new Book(title, author, pages, read);
  reader.pushList();
  saveLocalStorage(myLibrary);
  updateList();
}

function saveLocalStorage(data) {
  let dataList = JSON.stringify(data);
  localStorage.setItem("book", dataList);
}

function updateList() {
  mainContentHTML = "";
  let getData = localStorage.getItem("book");
  let getDataList = JSON.parse(getData) || [];
  console.log(getDataList);
  getDataList.forEach((bookData) => {
    // Re-create the Book instance from the stored data
    let newBook = new Book(
      bookData.title,
      bookData.author,
      bookData.pages,
      bookData.read
    );

    // Use the readStatus method from the Book prototype
    let readStatus = newBook.readStatus();

    mainContentHTML += `
    <div class="main__content__card card">
        <div class="card__text">
              <p><span>Title:</span> ${newBook.title}</p>
              <p><span>Author:</span> ${newBook.author}</p>
              <p><span>Pages:</span> ${newBook.pages}</p>
              <p><span>Status:</span> ${readStatus}</p>
            </div>
            <div class="card__btn">
              <button>Read</button>
              <button>Remove</button>
            </div>
          </div>`;
  });
  mainContent.innerHTML = mainContentHTML;
}

// Update List
updateList();
