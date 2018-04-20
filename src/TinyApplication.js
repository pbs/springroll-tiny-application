(function() {
  var Bellhop = window.Bellhop;
  if (Bellhop === undefined && require instanceof Function) {
    Bellhop = require("bellhop-iframe");
  }

  if (Bellhop === undefined) {
    throw new Error("Could not import bellhop");
  }

  var TinyApplication = function(options) {
    if (window.app !== undefined) {
      throw new Error("Another app instance is already instantiated");
    }

    // attach this instance globally, since there shouldn't only ever be one
    window.app = this;

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

    // setup all plugins
    TinyApplication.plugins.sort(function(a, b) {
      return b.priority - a.priority;
    });

    TinyApplication.plugins.forEach(function(plugin) {
      plugin.setup.call(window.app);
    });

    this.container.send("loaded");

    window.addEventListener(
      "focus",
      function() {
        this.container.send("focus", true);
      }.bind(this)
    );

    window.addEventListener(
      "blur",
      function() {
        this.container.send("focus", false);
      }.bind(this)
    );
  };

  TinyApplication.plugins = [];

  var global = null;
  if (typeof module === "object") {
    global = module.exports;
  } else if (typeof window === "object") {
    window.springroll = window.springroll || {};
    global = window.springroll;
  } else {
    throw new Error(
      "SpringRoll TinyApplication only supported in a CommonJS or Browser environent"
    );
  }

  global.TinyApplication = TinyApplication;

  global.ApplicationPlugin = function(priority) {
    this.priority = priority || 100;

    TinyApplication.plugins.push(this);
  };

  global.ApplicationPlugin.prototype.setup = function() {};
})();
