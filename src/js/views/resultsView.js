import View from './view.js';
import previewView from './PreviewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipies found for your query. Please try again 🍽️';
  _message = '';

  _genterateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();