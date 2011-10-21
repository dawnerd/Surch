var Surch = Fidel.ViewController.extend({
  elements: {
    input: 'input[data-autocomplete="true"]'
  },
  init: function() {
    this.internalFilter = this.config.internalFilter || false;
    this.pollDelay = this.config.pollDelay || 500;
    this.searchService = this.config.searchService || '';
    this.minLength = this.config.minLength || 3;
    this.lastValue = this.input.val();
    this.counter = null;

    this.input.bind('keyup', this.proxy(this.handleInput));
  },
  handleInput: function handleInput(event) {
    if(this.lastValue === this.input.val() || this.input.val().length < this.minLength) return;
    this.lastValue = this.input.val();

    if(typeof this.counter !== null) clearTimeout(this.counter);
    this.counter = setTimeout(this.proxy(this.pollResults), this.pollDelay);
  },
  pollResults: function pollDelay() {
    console.log('Polling for:', this.lastValue);

    var payload = {
      "search": this.lastValue
    };

    $.getJSON(this.searchService, payload, this.proxy(this.processResults));
  },
  processResults: function processResults(data) {
    var results = [];
    if(this.internalFilter) {
      var lastValueLower = this.lastValue.toLowerCase();
      for(var i = data.results.length; i--;) {
        if(data.results[i].toLowerCase().indexOf(lastValueLower) !== -1) results.push(data.results[i]);
      }
    } else {
      results = data.results;
    }

    console.log(results)
  }
});