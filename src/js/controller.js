import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from '.views/recipeView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addrecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { aync } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //? Update results View to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    //? 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //? 2. Loading recipe
    await model.loadRecipe(id);

    //? 3. Rendering the Recpies
    recipeView.render(model.state.recipe);

    // //^ TEST control servings
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //? 1. Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    //? 2. Load Search
    await model.loadSearchResults(query);

    //? 3. Render Results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //? 4. Render initial pagination buttons
    // console.log(model.state.search);
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    // throw err;
  }
};

const controlPagination = function (gotoPage) {
  //? 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //? 4. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //? Update the recipe servings status
  model.updateServings(newServings);

  //? Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //? Add and remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //? Update recipe view
  recipeView.update(model.state.recipe);

  //? Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //? Show spinner
    addRecipeView.renderSpinner();
    //? Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //? Render recipe view
    recipeView.render(model.state.recipe);

    //? Display Success message
    addRecipeView.renderMessage();

    //? Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //? Change id  in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //? Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🛑', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
