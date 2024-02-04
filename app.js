const URL =
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=";

// list=search - perform a full text search
// !Important srsearch="inputValue" - search for page titles or content matching  this value.
// srlimit=20 How many total pages to return.
// format=json json response
// "origin=*" fix cors errors

// selecting the elements func
const get = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error("No element selected");
};

// elements
const form = get(".form");
const formInput = get(".form-input");
const results = get(".results");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = formInput.value;
  if (!value) {
    results.innerHTML = `<div class='error'>Please enter valid search value</div>`;
    return;
  }
  fetchData(value);
  formInput.value = "";
});

const fetchData = async (searchValue) => {
  results.innerHTML = `<div class='loading'></div>`;
  try {
    const response = await fetch(`${URL}${searchValue}`);
    const data = await response.json();
    // console.log(data);
    // the path for the needed data in the url
    // console.log(data.query.search);
    const result = data.query.search;
    results.innerHTML = result
      .map((article) => {
        const { pageid, title, snippet } = article;
        return `
      <div class="articles">
      <a href=http://en.wikipedia.org/?curid=${pageid} target="_blank">
        <h4>${title}</h4>
        <p>${snippet}</p>
      </a>
      </div>
      `;
      })
      .join("");

    if (result.length < 1) {
      results.innerHTML = `<div class='error'>No matching results</div>`;
    }
  } catch (error) {
    results.innerHTML = "Something went wrong , please try again";
  }
};
