import * as model from './model.js';
import searchview from './views/searchview.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeViews from './views/addRecipeViews.js';
import { MODAL_CLOSE_SEC } from './helper.js';
import recipeView from './views/recipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    //0.)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //updated bookmarks
    bookmarkView.update(model.state.bookmarks);
    //1.) loading recipe
    await model.loadRecipe(id);

    //2.) Rendering Recipe
    recipeView.render(model.state.recipe);

    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(`${err} bomb`);
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchview.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    //console.log(model.state.search.results);

    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4.)render page buttons
    paginationView.render(model.state.search);
  } catch {
    console.log(err);
  }
};

const controlpag = function (goToPage) {
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  //recipeView.render(model.state.recipe); i dont want to render again
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //updated recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeViews.renderSpinner();
    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    //console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //display success
    addRecipeViews.renderMes();

    //render new bookmark
    bookmarkView.render(model.state.bookmarks);

    //changeid in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back();

    //close form window
    setTimeout(function () {
      addRecipeViews.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeViews.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchview.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlpag);
  addRecipeViews.addHandlerUpload(controlAddRecipe);
};

init();
