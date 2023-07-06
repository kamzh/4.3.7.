const input = document.querySelector('input');
const autocompleteArea = document.querySelector('.autocomplete');
const repo = document.querySelector('.reps');

function showAutocomplete(data) {
   data.items.forEach((i) => {
      const name = i.name;
      const owner = i.owner.login;
      const stars = i.stargazers_count;

      autocompleteArea.insertAdjacentHTML(
         'beforeend',
         `<div class='autocomplete__item' data-name='${name}' data-owner='${owner}' data-stars='${stars}'>${name}</div>`
      );
   });
}

function removeAutocomplete() {
   autocompleteArea.innerHTML = null;
}

function debounce(fn) {
   let time;
   return function () {
      clearTimeout(time);
      time = setTimeout(() => {
         fn.apply(this);
      }, 500);
   };
}

async function respFn() {
   removeAutocomplete();
   const inputValue = input.value.replace(/\s+/g, '');
   if (inputValue) {
      const resp = await fetch(
         `https://api.github.com/search/repositories?q=${inputValue}&per_page=5`
      );
      const data = await resp.json();
      showAutocomplete(data);
   }
   return;
}

function removeRepoCard(event) {
   if (event.target.getAttribute('class') === 'reps__close_btn') {
      event.target.parentNode.remove();
      event.target.parentNode.removeEventListener('click', removeRepoCard);
   }
}

autocompleteArea.addEventListener('click', (event) => {
   repo.insertAdjacentHTML(
      'beforeend',
      `<div class='reps__card'>
         <div>
            <p class="reps__info">Name: ${event.target.getAttribute(
               'data-name'
            )}</p>
            <p class="reps__info">Owner: ${event.target.getAttribute(
               'data-owner'
            )}</p>
            <p class="reps__info">Stars: ${event.target.getAttribute(
               'data-stars'
            )}</p>
         </div>
         <div class="reps__close_btn"></div>
      </div>`
   );
   removeAutocomplete();
   input.value = '';
});

const respFnDebounce = debounce(respFn);
input.addEventListener('input', respFnDebounce);
repo.addEventListener('click', removeRepoCard);
