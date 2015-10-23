'use strict';

var SelectListView = require('atom-space-pen-views').SelectListView,
    $ = require('atom-space-pen-views').$;

class AtomCodePicnicView extends SelectListView {
  initialize() {
    super.initialize();

    this.addClass('atom-codepicnic fuzzy-finder');

    this.panel = atom.workspace.addModalPanel({
      item: this
    });

    this.panel.show();
    this.focusFilterEditor();
  }
  getFilterKey() {
    return 'name';
  }
  viewForItem(item) {
    return $('<li class="two-lines"><div class="primary-line">' + item.name + '</div><div class="secondary-line">' + item.container_type + '</div></li>');
  }
  getEmptyMessage(itemCount) {
    if (itemCount === 0) {
      return 'No consoles yet';
    }
    else {
      super.getEmptyMessage(itemCount);
    }
  }
  confirmed(item) {
    console.log(item.name + ' selected');

    this.hide();
  }
  cancelled() {
    this.hide();
  }
  show() {
    if (this.panel) {
      this.panel.show();
      this.focusFilterEditor();
    }
  }
  hide() {
    if (this.panel) {
      this.panel.hide();
    }
  }
}

module.exports = AtomCodePicnicView;