(function() {
  var Bellhop = window.Bellhop;
  if(Bellhop === undefined && require instanceof Function) {
    Bellhop = require('bellhop-iframe');
  }

  if(Bellhop === undefined) {
    throw new Error("Could not import bellhop");
  }

  var TinyApplication = function(options) {
    if (window.app !== undefined) {
      throw new Error("Another app instance is already instantiated");
    }

    options = options || {};
    options.hooks = options.hooks || {};
    options.features = options.features || {};

    var isMissing = function(hookName) {
      return !(options.hooks[hookName] instanceof Function);
    };

    // make sure all missing required hooks are there
    var missingRequiredHooks = [
      "soundMuted",
      "captionsMuted",
      "musicMuted",
      "voMuted",
      "sfxMuted",
      "captionsStyles",
      "pause",
      "close"
    ].filter(isMissing);
    if (missingRequiredHooks.length > 0) {
      throw new Error(
        "Missing some required hooks: " + missingRequiredHooks.join(", ")
      );
    }

    var missingWantedHooks = [].filter(isMissing);
    if (missingWantedHooks.length > 0) {
      console.warn(
        "Maybe you should provide these hooks? : " + missingWanted.join(", ")
      );
    }

    this.container = new Bellhop();
    this.container.connect();
    this.container.on(options.hooks);
    this.container.send("features", options.features);
    this.container.send("keepFocus", false);
    this.container.send("loaded");

    // attach this instance globally, since there shouldn't only ever be one
    window.app = this;

    window.addEventListener(
      "focus",
      function() {
        console.log("focus");
        this.container.send("focus", true);
      }.bind(this)
    );

    window.addEventListener(
      "blur",
      function() {
        console.log("blur");
        this.container.send("focus", false);
      }.bind(this)
    );
  };

  if (typeof module === "object") {
    module.exports = TinyApplication;
  }

  if (typeof window === "object") {
    window.springroll = window.springroll || {};
    window.springroll.TinyApplication = TinyApplication;
  }
})();
