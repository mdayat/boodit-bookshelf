function BookForm(title = "", author = "", year = "", isComplete = false) {
  const checked = isComplete ? "checked" : "";
  const formEl = document.createElement("form");
  formEl.setAttribute("class", "book-form-modal");
  formEl.innerHTML = `
    <label for="title">Title</label>
    <input
      type="text"
      id="title"
      name="title"
      placeholder="Title..."
      value="${title}"
      autocomplete="off"
      required
    />

    <label for="author">Author</label>
    <input
      type="text"
      id="author"
      name="author"
      placeholder="Author..."
      value="${author}"
      autocomplete="off"
      required
    />

    <label for="year">Year</label>
    <input
      type="number"
      id="year"
      name="year"
      value="${year}"
      autocomplete="off"
      required
    />

    <div>
      <input type="checkbox" id="isComplete" name="isComplete" ${checked} />
      <label for="isComplete">Completed</label>
    </div>

    <button type="submit" class="btn-primary">Add Book</button>
  `;

  const currentYear = new Date().getFullYear();
  formEl.querySelector("[name='year']").setAttribute("max", currentYear);
  return formEl;
}

function DeleteBookAlert(title) {
  const divEl = document.createElement("div");
  divEl.setAttribute("class", "delete-book-modal");
  divEl.innerHTML = `
    <p>
      Delete <strong>"${title}"</strong> From Book List?
    </p>

    <button type="button" class="btn-primary">
      Yes
    </button>
  `;
  return divEl;
}

function CreateBookItemChild(title, author, year) {
  return `
    <img
      src="./assets/images/book-template.jpg"
      alt="${title}"
      loading="lazy"
    />

    <div>
      <h2 class="title">${title}</h2>
      <div class="author">
        <address><span>${author}</span></address>
        <time datetime="${year}">${year}</time>
      </div>

      <div>
        <button type="button" aria-label="Update Book" class="update-book-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
            />
          </svg>
        </button>

        <button type="button" aria-label="Delete Book" class="delete-book-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
            />
          </svg>
        </button>
      </div>
    </div>
  `;
}

function CreateBookCard({ id, title, author, year }) {
  const articleEl = document.createElement("article");
  articleEl.setAttribute("id", id);
  articleEl.setAttribute("class", "book-item");
  articleEl.innerHTML = CreateBookItemChild(title, author, year);

  const updateBookBtn = articleEl.getElementsByClassName("update-book-btn")[0];
  const deleteBookBtn = articleEl.getElementsByClassName("delete-book-btn")[0];

  updateBookBtn.addEventListener("click", updateBook);
  deleteBookBtn.addEventListener("click", deleteBook);
  return articleEl;
}

function checkEmptyBook() {
  return localStorage.getItem("books") === null;
}

function renderEmptyBook(msg) {
  const emptyMsg = document.createElement("h2");
  emptyMsg.setAttribute("class", "empty-book");
  emptyMsg.innerText = msg;
  document.getElementsByClassName("book-list")[0].appendChild(emptyMsg);
}

function renderBooks(tabView) {
  const isEmpty = checkEmptyBook();
  if (isEmpty) return renderEmptyBook("Ups! you don't have any book list here");

  const bookListEl = document.getElementsByClassName("book-list")[0];
  const bookList = JSON.parse(localStorage.getItem("books"));

  while (bookListEl.firstElementChild instanceof HTMLElement) {
    bookListEl.removeChild(bookListEl.firstElementChild);
  }

  for (const book of bookList) {
    if (tabView === "completed") {
      if (!book.isComplete) continue;
    } else {
      if (book.isComplete) continue;
    }

    const bookCard = CreateBookCard(book);
    bookListEl.appendChild(bookCard);
  }
}

function addBook() {
  const formEl = BookForm();
  openModal(formEl);

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const newBook = {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      year: Number(document.getElementById("year").value),
      isComplete: document.getElementById("isComplete").checked,
    };

    newBook.id = new Date().getTime();
    const bookListEl = document.getElementsByClassName("book-list")[0];
    const isEmpty = checkEmptyBook();

    if (isEmpty) {
      const newBookList = [];
      newBookList.push(newBook);
      bookListEl.removeChild(bookListEl.firstElementChild);
      localStorage.setItem("books", JSON.stringify(newBookList));
    } else {
      const bookList = JSON.parse(localStorage.getItem("books"));
      bookList.push(newBook);
      localStorage.setItem("books", JSON.stringify(bookList));
    }

    const newBookCard = CreateBookCard(newBook);
    const tabView = getTabView();
    if (tabView === "completed" && newBook.isComplete) {
      bookListEl.appendChild(newBookCard);
    } else if (tabView === "uncompleted" && !newBook.isComplete) {
      bookListEl.appendChild(newBookCard);
    }

    formEl.reset();
    closeModal();
  });
}

function updateBook(event) {
  const selectedBook =
    event.currentTarget.parentElement.parentElement.parentElement;
  const bookList = JSON.parse(localStorage.getItem("books"));
  let updatedBook = bookList.find(
    (book) => book.id === Number(selectedBook.id)
  );

  const formEl = BookForm(
    updatedBook.title,
    updatedBook.author,
    String(updatedBook.year),
    updatedBook.isComplete
  );
  openModal(formEl);

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const newBook = {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      year: Number(document.getElementById("year").value),
      isComplete: document.getElementById("isComplete").checked,
    };

    const isProgressChanged = updatedBook.isComplete !== newBook.isComplete;
    const bookListEl = document.getElementsByClassName("book-list")[0];
    const currBookEl = document.getElementById(selectedBook.id);
    updatedBook = { id: updatedBook.id, ...newBook };

    if (!isProgressChanged) {
      const updatedBookCard = CreateBookCard(updatedBook);
      if (currBookEl.nextElementSibling !== null) {
        bookListEl.insertBefore(updatedBookCard, currBookEl.nextElementSibling);
      } else if (currBookEl.nextElementSibling === null) {
        bookListEl.appendChild(updatedBookCard);
      }
    }
    bookListEl.removeChild(currBookEl);

    const bookIndex = bookList.findIndex(
      ({ id }) => id === Number(selectedBook.id)
    );
    bookList.splice(bookIndex, 1, updatedBook);
    localStorage.setItem("books", JSON.stringify(bookList));

    formEl.reset();
    closeModal();
  });
}

function deleteBook(event) {
  const selectedBook =
    event.currentTarget.parentElement.parentElement.parentElement;
  const bookList = JSON.parse(localStorage.getItem("books"));
  let deletedBook = bookList.find(
    (book) => book.id === Number(selectedBook.id)
  );

  const divEl = DeleteBookAlert(deletedBook.title);
  openModal(divEl);

  divEl.lastElementChild.addEventListener("click", () => {
    const bookIndex = bookList.findIndex(
      ({ id }) => id === Number(selectedBook.id)
    );

    bookList.splice(bookIndex, 1);
    if (bookList.length === 1) {
      localStorage.removeItem("books");
      renderEmptyBook("Ups! you don't have any book list here");
    } else {
      localStorage.setItem("books", JSON.stringify(bookList));
    }

    document.getElementsByClassName("book-list")[0].removeChild(selectedBook);
    closeModal();
  });
}

function disableScroll() {
  window.scrollTo(0, 0);
  window.onscroll = () => window.scrollTo(0, 0);
}

function enableScroll() {
  window.onscroll = () => {};
}

function openModal(modalItem) {
  disableScroll();
  const modalContainer = document.getElementsByClassName("modal-container")[0];
  modalContainer.parentElement.removeAttribute("hidden");
  modalContainer.insertBefore(modalItem, modalContainer.firstElementChild);
}

function closeModal() {
  enableScroll();
  const modalContainer = document.getElementsByClassName("modal-container")[0];
  modalContainer.removeChild(modalContainer.firstElementChild);
  modalContainer.parentElement.setAttribute("hidden", "");
}

function getTabView() {
  const tabView = localStorage.getItem("tabView");
  if (tabView !== null) return tabView;

  localStorage.setItem("tabView", "completed");
  return localStorage.getItem("tabView");
}

function changeTabView(prevTabEl, currTabEl, tabView) {
  localStorage.setItem("tabView", tabView);
  prevTabEl.classList.remove("visited-tab");
  prevTabEl.classList.add("unvisited-tab");
  currTabEl.classList.remove("unvisited-tab");
  currTabEl.classList.add("visited-tab");
}

const completedTab = document.getElementById("completed-tab");
const uncompletedTab = document.getElementById("uncompleted-tab");

const tabView = getTabView();
renderBooks(tabView);
if (tabView === "completed") {
  completedTab.classList.add("visited-tab");
} else {
  uncompletedTab.classList.add("visited-tab");
}

completedTab.addEventListener("click", () => {
  changeTabView(uncompletedTab, completedTab, "completed");
  renderBooks("completed");
});
uncompletedTab.addEventListener("click", () => {
  changeTabView(completedTab, uncompletedTab, "uncompleted");
  renderBooks("uncompleted");
});

const addBookBtn = document.getElementsByClassName("add-book-btn")[0];
const closeModalBtn = document.getElementsByClassName("close-modal")[0];

addBookBtn.addEventListener("click", addBook);
closeModalBtn.addEventListener("click", closeModal);

const searchForm = document.getElementsByClassName("search-form")[0];
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchedBook = document.getElementById("search");
  const bookList = JSON.parse(localStorage.getItem("books"));

  const bookListEl = document.getElementsByClassName("book-list")[0];
  const tabView = getTabView();
  while (bookListEl.firstElementChild instanceof HTMLElement) {
    bookListEl.removeChild(bookListEl.firstElementChild);
  }

  for (const book of bookList) {
    if (tabView === "completed") {
      if (!book.isComplete) continue;
    } else {
      if (book.isComplete) continue;
    }

    const lowerCaseTitle = book.title.toLowerCase();
    const isMatched = lowerCaseTitle.includes(searchedBook.value.trim());
    const searchedBookCard = CreateBookCard(book);

    if (!isMatched) continue;
    if (tabView === "completed" && book.isComplete) {
      bookListEl.appendChild(searchedBookCard);
    } else if (tabView === "uncompleted" && !book.isComplete) {
      bookListEl.appendChild(searchedBookCard);
    }
  }

  if (bookListEl.childElementCount === 0)
    return renderEmptyBook(
      `Ups! There is no book with the title of "${searchedBook.value}"`
    );
  searchForm.reset();
});
