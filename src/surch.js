var Surch = Fidel.ViewController.extend({
  elements: {
    input: 'input[data-autocomplete="true"]',
    results: '#SurchResults'
  },
  templates: {
    results: '#SurchResultsTpl'
  },
  init: function() {
    this.internalFilter = this.config.internalFilter || false;
    this.pollDelay = this.config.pollDelay || 500;
    this.searchService = this.config.searchService || '';
    this.minLength = this.config.minLength || 3;
    this.blurTimeout = this.config.blurTimeout || 1000;
    this.lastValue = this.input.val();
    this.counter = null;

    this.input.bind('keyup', this.proxy(this.handleInput));
    this.input.bind('blur', this.proxy(this.hideResults));
  },
  handleInput: function handleInput(event) {
    if(this.lastValue === this.input.val()) return;
    if(this.input.val().length < this.minLength) {
      this.hideResults();
      return;
    }
    this.lastValue = this.input.val();

    if(typeof this.counter !== null) clearTimeout(this.counter);
    this.counter = setTimeout(this.proxy(this.pollResults), this.pollDelay);
  },
  pollResults: function pollDelay() {
    var payload = {search: this.lastValue};

    $.getJSON(this.searchService, payload, this.proxy(this.processResults));
  },
  processResults: function processResults(data) {
    var results = {items: []};
    if(this.internalFilter) {
      var lastValueLower = this.lastValue.toLowerCase();
      for(var i = data.results.length; i--;) {
        if(data.results[i].toLowerCase().indexOf(lastValueLower) !== -1) results.items.push(data.results[i]);
      }
    } else {
      results.items = data.results;
    }

    this.results.html(this.template(this.templates.results, results));
  },
  hideResults: function hideResults() {
    if(typeof this.hideTimeout !== null) clearTimeout(this.hideTimeout);
    var self = this;
    this.hideTimeout = setTimeout(function() {
      self.lastValue = '';
      self.results.html('');
    }, this.blurTimeout);
  }
});