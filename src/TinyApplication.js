(function() {
  var TinyApplication = function(options) {
    if (window.app !== undefined) {
      throw new Error("Another app instance is already instantiated");
    }

    options = options || {};

    var isMissing = function(hookname) {
      return !(options[hookName] instanceof Function);
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
    this.container.on(options);

    // attach this instance globally, since there shouldn't only ever be one
    window.app = this;
  };

  if (typeof module === "object") {
    module.exports = TinyApplication;
  }

  if (typeof window === "object") {
    window.springroll = window.springroll || {};
    window.springroll.TinyApplication = TinyApplication;
  }
})();
