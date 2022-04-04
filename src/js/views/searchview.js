class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    ['submit'].forEach(ev =>
      this._parentElement.addEventListener(ev, function (e) {
        e.preventDefault();
        handler();
      })
    );
  }
}

export default new SearchView();