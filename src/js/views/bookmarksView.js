import View from './view.js';
import previewView from './PreviewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'You have no recpies bookmarked, find a nice recipe to add it here 🤤';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _genterateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
