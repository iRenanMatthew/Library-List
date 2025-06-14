const currentYear = document.querySelector(".footer__year");
const year = new Date().getUTCFullYear();
currentYear.innerHTML = year;

const addBookBtn = document.querySelector(".main__btn__add");
const cancelBookBtn = document.querySelectorAll(".dialog__btn__cancel");
const addBookDialog = document.querySelector(".main__content__dialog.add");
const editBookDialog = document.querySelector(".main__content__dialog.edit");
const mainContent = document.querySelector(".main__content");
const bookForm = document.querySelector("#bookForm");
const editBookForm = document.querySelector('#editBookDetails');
const dialogOverlay = document.querySelector(".dialog__overlay");
const updateBookDetails = document.querySelector(".updateBookDetails");
const book_title = document.querySelector("#book_title");
const book_author = document.querySelector("#book_author");
const book_pages = document.querySelector("#book_pages");
let book_status = document.querySelectorAll('input[name="book_status"]')
let edit_title = document.querySelector("#edit_title");
let edit_author = document.querySelector("#edit_author");
let edit_pages = document.querySelector("#edit_pages");
let edit_status = document.querySelectorAll('input[name="edit_status"]')
let selectedValue = null;




// START: Open dialog with 'show' class for animation

addBookBtn.addEventListener("click", () => openDialog(addBookDialog));

const openDialog = (dialog) => {
  if (dialog){
    dialog.classList.add('show');
    dialog.showModal();
  } else {
    alert("Sorry, your browser doesn't support the dialog element.");
  }
}

// Close dialog on cancel button, prevent propagation
cancelBookBtn.forEach((cancel)=> {
    cancel.addEventListener("click", (e) => {
    if (e.target.closest('.add')) {
      closeDialogWithAnimation(addBookDialog);
    } else if (e.target.closest('.edit')) {
      closeDialogWithAnimation(editBookDialog);
    }
  });
})

function closeDialogWithAnimation(content) {
  content.classList.add("hide"); 
  setTimeout(() => {
    content.classList.remove("show", "hide"); 
    content.close(); 
  }, 200);
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
    return this.status == "reading"
      ? "Reading"
      : this.status == "finished"
      ? "Finished"
      : "Not Read Yet";
  }

  pushDataList(){
    myLibrary.push(this);
  }
}


bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let randomId = generateRandomId();


 

  if(!book_title || !book_author || !book_pages){
    return alert("Please fillup all the fields needed");
  } else {

    book_status.forEach((radio) => {
      if (radio.checked) {
        selectedValue = radio.value;
      }
    });

    let formData = {
      id: randomId,
      title: book_title.value, 
      author: book_author.value,
      pages: book_pages.value,
      status: selectedValue
    }
      
    addDataToLibrary(formData);
    book_title.value = ''
    book_author.value = ''
    book_pages.value = ''
  
    closeDialogWithAnimation(addBookDialog);
  }
})

const loadBookDetails = (bookID) => {
  const getBookId = bookID.target.closest('.main__content__card').getAttribute('book-id');
  let filteredData = myLibrary.find((data) => data.id === getBookId);
  const {author, id, pages, status, title} = filteredData;

  editBookForm.setAttribute('book-id', id);
  edit_title.value = title
  edit_author.value = author
  edit_pages.value = pages

  
  edit_status.forEach((radio) => {
    if (radio.value === status) {
      radio.checked = true;
    }
  });

}

editBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  
  let book_id = editBookForm.getAttribute('book-id');
  let filteredBook = myLibrary.find((book) => book.id == book_id)
  filteredBook.title = edit_title.value 
  filteredBook.author = edit_author.value
  filteredBook.pages = edit_pages.value

  edit_status.forEach((radio) => {
      if (radio.checked) {
        filteredBook.status = radio.value;
      }
    });
    saveToLocalStorage(myLibrary);
    syncDisplay();
    closeDialogWithAnimation(editBookDialog)
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
            <button  class="updateBookDetails">Edit</button>
            <button class="removeData">Remove</button>
          </div>
      </div>`;
  });
  

  mainContent.innerHTML = mainContentHTML;
}

document.addEventListener('DOMContentLoaded', syncDisplay);

// Remove Book
const removeBook = (id) => {
  const bookAttribute = id.target.closest('.main__content__card').getAttribute('book-id')
  const filteredBook = myLibrary.filter((data) =>  data.id !== bookAttribute)
  saveToLocalStorage(filteredBook);
  syncDisplay();
}

// Book Read Status
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
  if(e.target.classList.contains('updateBookDetails')){
    openDialog(editBookDialog)
    loadBookDetails(e)
  } else if (e.target.classList.contains('removeData')){
    removeBook(e)
  }
})


