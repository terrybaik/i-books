const API_KEY = "AIzaSyDlGa6Lw5jvCTzE4owZXWFP8cLaYc2eK0c";
const searchInput = document.getElementById("searchBooks");
const searchForm = document.getElementById("searchForm");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageNum = document.getElementById('pageNum');

// Anime Scroll Top
function scrollTop(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// dynamic query
let startResult = 0;
const maxResult = 40;
let currentPage = 1;

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentPage = 1;
  startResult = 0;
  fetchAPI(searchInput.value, startResult, currentPage);
})
prevBtn.addEventListener('click', () => {
  if (startResult > 0) {
    startResult -= maxResult;
    currentPage -= 1;
    fetchAPI(searchInput.value, startResult, currentPage);
    scrollTop();
  }
})


nextBtn.addEventListener('click', () => {
  startResult += maxResult;
  currentPage += 1;
  fetchAPI(searchInput.value, startResult, currentPage);
  scrollTop()
})

// Fetch API
async function fetchAPI(query, startIndex, page) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=${maxResult}&startIndex=${startIndex}`;

  // Current Page
  pageNum.innerHTML = page;
    if (page == 1) {
      prevBtn.style.display = 'none'
    } else {
      prevBtn.style.display = '';
    }
    
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const data = await response.json();
    displayBooks(data.items);
    document.getElementById('previous').style.display = '';
  } catch (error) {
    console.error(error);
  }
}



// Display Books
function displayBooks(books) {
  const booksContainer = document.getElementById('books');
  booksContainer.innerHTML = ''; 

  
  books.forEach((book) => {
    const { title, authors, description, imageLinks, publishedDate, pageCount, previewLink, ratingsCount, categories } = book.volumeInfo;
    const bookElement = document.createElement('div');
    const subElement = document.createElement('div');
    bookElement.classList.add('book');
    subElement.classList.add('sub')
    
    bookElement.innerHTML = 
      `
      <a href=${previewLink} style="display: flex; border: 0.2px solid gray; border-radius: .5em" data-aos="fade-up">
          ${imageLinks ? `<img src="${imageLinks.thumbnail}" alt="${title}">` : ''}
        <div class="aBook" style="padding: 0 10px; text-decoration: none; color: black;">
          <h2>${title}</h2>
          <p><strong>Authors:</strong> ${authors ? authors.join(', ') : 'Unknown'}</p>
          <p><strong>Date:</strong> ${publishedDate}</p>
          <p><strong>Page:</strong> ${pageCount}</p>
          <p><strong>Category:</strong> ${categories}</p>
          <p><strong>Rate:</strong> ${ratingsCount}</p>
        </div>  
      </a>`;
    
    booksContainer.appendChild(bookElement);
  });
}
