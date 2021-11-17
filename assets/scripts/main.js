// main.js

import { Router } from './Router.js';

//=================================================
const createObject = require('objectCreate.js');
//=================================================

const recipes = [
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  'https://introweb.tech/assets/json/stuffing.json',
  'https://introweb.tech/assets/json/turkey.json',
  'https://introweb.tech/assets/json/pumpkinPie.json'
];

const recipeData = {} // You can access all of the Recipe Data from the JSON files in this variable

const router = new Router(function () {
  
  document.querySelector('.section--recipe-cards').classList.add('shown');
  document.querySelector('.section--recipe-expand').classList.remove('shown');
});

window.addEventListener('DOMContentLoaded', init);

// Initialize function, begins all of the JS code in this file
async function init() {

  try {
    await fetchRecipes();
  } catch (err) {
    console.log(`Error fetching recipes: ${err}`);
    return;
  }

  createRecipeCards();
  bindShowMore();
  bindEscKey();
  bindPopstate();
}

/**
 * Loading JSON into a JS file is oddly not super straightforward (for now), so
 * I built a function to load in the JSON files for you. It places all of the recipe data
 * inside the object recipeData like so: recipeData{ 'ghostcookies': ..., 'birthdayCake': ..., etc }
 */
async function fetchRecipes() {
  return new Promise((resolve, reject) => {
    recipes.forEach(recipe => {
      fetch(recipe)
        .then(response => response.json())
        .then(data => {
          // This grabs the page name from the URL in the array above
          console.log(data);
          data['page-name'] = recipe.split('/').pop().split('.')[0];
          recipeData[recipe] = data;
          //=========================================================
          createObject.createRecipeObject(data);
          //=========================================================
          if (Object.keys(recipeData).length == recipes.length) {
            resolve();
          }
        })
        .catch(err => {
          console.log(`Error loading the ${recipe} recipe`);
          reject(err);
        });
    });
  });
}

/**
 * Generates the <recipe-card> elements from the fetched recipes and
 * appends them to the page
 */
function createRecipeCards() {
  // Makes a new recipe card

  for(let i = 0; i < recipes.length; i++)
  {
    const recipeCard = document.createElement('recipe-card');
    
    recipeCard.data = recipeData[recipes[i]];

    const page = recipeData[recipes[i]]['page-name'];
    router.addPage(page, function() {
      document.querySelector('.section--recipe-cards').classList.remove('shown');
      document.querySelector('.section--recipe-expand').classList.add('shown');
      
      document.querySelector('recipe-expand').data = recipeData[recipes[i]];
    });

    bindRecipeCard(recipeCard, page);
    
    document.querySelector('.recipe-cards--wrapper').appendChild(recipeCard);
  }

}

/**
 * Binds the click event listeners to the "Show more" button so that when it is
 * clicked more recipes will be shown
 */
function bindShowMore() {
  const showMore = document.querySelector('.button--wrapper > button');
  const arrow = document.querySelector('.button--wrapper > img');
  const cardsWrapper = document.querySelector('.recipe-cards--wrapper');

  showMore.addEventListener('click', () => {
    const cards = Array.from(cardsWrapper.children);
    arrow.classList.toggle('flipped');
    if (showMore.innerText == 'Show more') {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('hidden');
      }
      showMore.innerText = 'Show less';
    } else {
      for (let i = 3; i < cards.length; i++) {
        cards[i].classList.add('hidden');
      }
      showMore.innerText = 'Show more';
    }
  });
}

/**
 * Binds the click event listener to the <recipe-card> elements added to the page
 * so that when they are clicked, their card expands into the full recipe view mode
 * @param {Element} recipeCard the <recipe-card> element you wish to bind the event
 *                             listeners to
 * @param {String} pageName the name of the page to navigate to on click
 */
function bindRecipeCard(recipeCard, pageName) {
  recipeCard.addEventListener('click', e => {
    if (e.path[0].nodeName == 'A') return;
    router.navigate(pageName);
  });
}

/**
 * Binds the 'keydown' event listener to the Escape key (esc) such that when
 * it is clicked, the home page is returned to
 */
function bindEscKey() {
  
  document.addEventListener('keydown', function(event){
    console.log(event.key);
    if(event.key === "Escape"){
      router.navigate('home', true);
    }
  });
}

/**
 * Binds the 'popstate' event on the window (which fires when the back &
 * forward buttons are pressed) so the navigation will continue to work 
 * as expected. (Hint - you should be passing in which page you are on
 * in your Router when you push your state so you can access that page
 * info in your popstate function)
 */
function bindPopstate() {
  
  window.addEventListener('popstate', (event) => {
    //console.log(event.state.page);
    if(event.state)
    {
      router.navigate(event.state.page, true);
    }
    else
    {
      router.navigate('home', true);
    }

  })
}