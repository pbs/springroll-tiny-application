(function() {
  window.springroll = window.springroll || {};

  window.springroll.TinyApplication = function(options) {
    options = options || {};

    var isMissing = function(hookname) {
      return !(options[hookName] instanceof Function);
    };

    // make sure all missing required hooks are there
    var missingRequiredHooks = [
    ].filter(isMissing);
    if(missingRequiredHooks.length > 0) {
      throw new Error('Missing some required hooks: ' + missingRequiredHooks.join(', '));
    }

    var missingWantedHooks = [
    ].filter(isMissing);
    if(missingWantedHooks.length > 0) {
      console.warn('Maybe you should provide these hooks? : ' + missingWanted.join(', '));
    }

    this.container = new Bellhop();
    this.container.connect();
    this.container.on(options);
  };
})();
