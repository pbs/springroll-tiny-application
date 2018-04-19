# SpringRoll Tiny Application
A lightweight implementation of the bellhop communication layer for SpringRoll.
This module allows to write "SpringRoll games" without actually pulling in SpringRoll itself keeping your game as light as possible, but sacrificing the niceties that SpringRoll provides.

## Sample usage
### Importing the module
One possible way to pull in the module is by including it on the page directly:
```html
<script src="path/to/dist/springroll-tiny-application.js"></script>
```
which will define `window.springroll.TinyApplication` globally. Bellhop will already be bundled in for you.

Another options is via Browserify, Webpack, or any other CommonJS bundler using `require`:
```javascript
var TinyApplication = require('springroll-tiny-application');
```

### Creating an Application Instance
Here's a basic integration:
```javascript
window.app = new springroll.TinyApplication({
  hooks: {
    soundMuted: event => console.log('Sound is muted:', event.data),
    captionsMuted: event => console.log('Captions muted:', event.data),
    musicMuted: event => console.log('Music is muted:', event.data),
    voMuted: event => console.log('VO is muted:', event.data),
    sfxMuted: event => console.log('SFX is muted:', event.data),
    captionsStyles: event => console.log('New captions styles:', event.data),
    pause: event => console.log('Is paused:', event.data),
    close: event => console.log('Closing the game')
  },
  features: {
    sound: true,
    hints: false,
    music: true,
    vo: false,
    sfx: true,
    captions: true,
    //disablePause: true
  }
});
```

All of the hooks listed are _required_ by `TinyApplication` to function properly.
These are, in short, the core set of events that the container can emit to the application.
After instantiating the application, you can then proceed to write the game however you want, but the expectation is that the hooks provide do something meaningful.

### Custom Plugins
There is also a small plugin functionality as well, which can be seen on the example `frame.html` page which hosts a miniature app.
To implement a custom plugin, integrators should create an instance of `springroll.ApplicationPlugin` and then implement a `setup` method:

```javascript
var customPlugin = new springroll.ApplicationPlugin();
customPlugin.setup = function() {
  // do something here
};
```

Application plugins take an optional constructor parameter to specify priority. By default this value is 100. Higher value priority plugins will execute `setup` first.

## Examples
There is an example integration included with the project in the `example` folder. A container set-up is in
`examples/index.html`, and a corresponding "game" can be found in `examples/frame.html`. To test it out, you'll need to
start a web server from the project root:

```
# Using PHP
php -S localhost:PORT

# Using Python
python -m SimpleHTTPServer PORT # Using python
```

In the example, the game adds handlers for three events: captions, audio mute, and play/pause. The buttons will toggle
captions and mute, and pause is triggered on window focus.

## SpringRollConnect Integration Notes
For your game to be SpringRollConnect compatible, you'll need to a take a couple more steps:
- Your game should have a `Gruntfile.js` in the root of your folder, and provide two `grunt` tasks that our build server will run
  - `grunt default` to bundle your code in release mode
  - `grunt debug` to bundle your code in debug (perhaps unminified if you'd like) mode.
- As a result, you'll need to include `grunt` as a `devDependency` of your app in `package.json`.
- Our build server also looks for a `deploy/` folder in your project and `zip`s that up. Whatever content is in
  `deploy/` will be hosted as your game in SpringRollConnect. That being said, after running `grunt default` or
  `grunt debug`, a _fully working instance of your game_ should be in `deploy/` so that it will upload properly to
  SpringRollConnect

Good luck!
