function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

function createElement(tagname, elClass) {
  const element = document.createElement(tagname);
  element.classList.add(elClass);
  return element;
}

const repos = document.querySelector(".repos");
const app = document.querySelector(".app");
const wrapper = document.querySelector(".wrapper");
const input = document.querySelector(".input");
const autocomplit = document.querySelector(".autocomplit");
const closeBtn = createElement("button", "repos__btn");

function addRepo(el) {
  let reposItem = createElement("li", "repos__item");
  let btn = closeBtn.cloneNode(true);
  btn.addEventListener("click", () => reposItem.remove());
  reposItem.append(btn);
  reposItem.insertAdjacentHTML(
    "afterbegin",
    `Name: ${el.name} </br> Owner: ${el.owner.login} </br> Stars: ${el.stargazers_count} `
  );
  repos.append(reposItem);
}

function removingNode() {
  try {
    for (let i = 0; i <= 5; i++) {
      let node = document.querySelector(".autocomplit__item");
      if (!node) {
        i = 5;
        break;
      }
      node.remove();
    }
  } catch {}
}

async function searching() {
  if (input.value) {
    await fetch(
      `https://api.github.com/search/repositories?q=${input.value}&per_page=5`
    )
      .then((response) => response.json())
      .then((response) => {
        removingNode();
        response.items.forEach((item) => {
          let element = createElement("li", "autocomplit__item");
          element.textContent = item.name;
          element.addEventListener("click", () => {
            addRepo(item);
            input.value = "";
            removingNode();
          });
          autocomplit.append(element);
        });
        wrapper.append(autocomplit);
      });
  } else {
    removingNode();
  }
}

input.addEventListener("keyup", debounce(searching, 500));
