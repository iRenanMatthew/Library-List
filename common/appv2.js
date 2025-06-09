  const currentYear = document.querySelector(".footer__year");
const year = new Date().getUTCFullYear();
currentYear.innerHTML = year;

const addBookBtn = document.querySelector(".main__btn__add");
const cancelBookBtn = document.querySelector(".dialog__btn__cancel");
const addBookDialog = document.querySelector(".main__content__dialog");
const mainContent = document.querySelector(".main__content");
const bookForm = document.querySelector("#bookForm");
const dialogOverlay = document.querySelector(".dialog__overlay");
const updateReadStatus = document.querySelector(".updateReadStatus");
const book_title = document.querySelector("#book_title");
const book_author = document.querySelector("#book_author");
const book_pages = document.querySelector("#book_pages");
const book_status = document.querySelector("#book_read");


// START: Open dialog with 'show' class for animation

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

// END: Open dialog with 'show' class for animation


// START: Adding data

let getLocalStorageData = localStorage.getItem('Books');
let myLibrary = JSON.parse(getLocalStorageData) || [];
let mainContentHTML = ''

class Book {
  constructor(id, title, author, pages, status){
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status
  }

  readStatus(){
    return !this.status ? "Not Yet" : "Read"
  }

  pushDataList(){
    myLibrary.push(this);
  }
}


bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let randomId = generateRandomId();

 

  if(!book_title || !book_author || !book_pages || !book_status){
    return alert("Please fillup all the fields needed");
  } else {
    let formData = {
      id: randomId,
      title: book_title.value, 
      author: book_author.value,
      pages: book_pages.value,
      status: book_status.checked
    }
      
    addDataToLibrary(formData);
    book_title.value = ''
    book_author.value = ''
    book_pages.value = ''
    book_status.checked = false
  
    closeDialogWithAnimation();
  }
})

const generateRandomId = () =>{
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'

  for(let i = 0; i < 20; i++) {
    const randomId = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomId);
  }

  return result; 

}

const addDataToLibrary = (book) => {
  const dataBook = new Book(book.id, book.title, book.author, book.pages, book.status);
  dataBook.pushDataList();
  saveToLocalStorage(myLibrary);
  syncDisplay();
}

const saveToLocalStorage = (data) => {
  let dataJSON = JSON.stringify(data)
  localStorage.setItem('Books', dataJSON);
}

const syncDisplay = () => { 
  mainContentHTML = "";
  fetchData();
  myLibrary.forEach((data) => {
    const newBook = new Book(data.id, data.title, data.author, data.pages, data.status);

    mainContentHTML += `
      <div class="main__content__card card" book-id="${newBook.id}">
          <div class="card__text">
            <p><span>Title:</span> ${newBook.title}</p>
            <p><span>Author:</span> ${newBook.author}</p>
            <p><span>Pages:</span> ${newBook.pages}</p>
            <p><span>Status:</span> ${newBook.readStatus()}</p>
          </div>
          <div class="card__btn">
            <button  class="updateReadStatus">Read</button>
            <button class="removeData">Remove</button>
          </div>
      </div>`;
  });
  

  mainContent.innerHTML = mainContentHTML;
}

document.addEventListener('DOMContentLoaded', syncDisplay);

const removeBook = (id) => {
  const bookAttribute = id.target.closest('.main__content__card').getAttribute('book-id')
  const filteredBook = myLibrary.filter((data) =>  data.id !== bookAttribute)
  saveToLocalStorage(filteredBook);
  syncDisplay();
}

const updateBookStatus = (id) => {
  const bookAttribute = id.target.closest('.main__content__card').getAttribute('book-id')
  const filteredBook = myLibrary.find((data) =>  data.id === bookAttribute);

  if (filteredBook){
    filteredBook.status = !filteredBook.status;
    saveToLocalStorage(myLibrary);
    syncDisplay();
  }

}

const fetchData = () => {
  getLocalStorageData = localStorage.getItem('Books');
  myLibrary = getLocalStorageData ? JSON.parse(getLocalStorageData) : [];
}

mainContent.addEventListener('click', (e) => {
  if(e.target.classList.contains('updateReadStatus')){
    updateBookStatus(e)
  } else if (e.target.classList.contains('removeData')){
    removeBook(e)
  }
})


