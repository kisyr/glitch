(function(Glitch) {

	Glitch.extend = function(protoProps, staticProps) {
		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function(){ return parent.apply(this, arguments); };
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function and add the prototype properties.
		child.prototype = _.create(parent.prototype, protoProps);
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	};

	Glitch.Effect = function(options) {
		this._init.apply(this, arguments);
	};

	_.extend(Glitch.Effect.prototype, {
		_init: function(options) {
			this.options = options;
			this.canvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");
			this.options.element.insertBefore(this.canvas, this.options.element.firstChild);
			this._resize();
			var self = this;
			window.addEventListener("resize", function(e) {
				self._resize(e);
			});
			window.addEventListener("mousemove", function(e) {
				self._mouseMove(e);
			});
			window.addEventListener("mousedown", function(e) {
				self._mouseDown(e);
			});
			this.init.apply(this, arguments);
		},
		_resize: function(e) {
			this.canvas.width = this.options.element.offsetWidth;
			this.canvas.height = this.options.element.offsetHeight;
			this.resize([this.canvas.width, this.canvas.height]);
		},
		_mouseMove: function(e) {
			var bounds = this.canvas.getBoundingClientRect();
			var cursor = [
				e.clientX - bounds.left,
				e.clientY - bounds.top
			];
			this.mouseMove(cursor);
		},
		_mouseDown: function(e) {
			console.log(e);
		},
		_loop: function(self = this) {
			var currentTime = new Date().getTime();
			var deltaTime = currentTime - self.lastTime;
			self.lastTime = currentTime;
			self.render(deltaTime / 1000, (currentTime - self.startTime) / 1000);
			self.timeout = window.setTimeout(self._loop, 1000 / self.options.frameRate, self);
		},
		play: function() {
			this.startTime = this.lastTime = new Date().getTime();
			this._loop();
		},
		stop: function() {
			window.clearTimeout(this.timeout);
		},
		resize() {},
		mouseMove() {},
		init() {},
		render: {},
	});

	Glitch.Effect.extend = Glitch.extend;

}(window.Glitch = window.Glitch || {}));

