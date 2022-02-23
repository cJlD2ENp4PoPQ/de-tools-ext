const ContextMenu = (function(){
	
	let _evaluateDynamic = function(prop, evt) {
		return typeof(prop)==="function"?prop({originEvent:evt}):prop;
	};
	
	let _cm = function(config) {

		this._menu = document.createElement("div");
		this._menu.style.display = "none";
		this._menu.style.position = "absolute";
		this._menu.innerHTML="<table/>";
		this._menu.style.zorder = "9999";
		this._menu.style.borderColor = "white";
		this._menu.style.borderStyle = "solid";
		this._menu.style.backgroundColor = "black";
		this._menu.style.padding="2px";
		this._config=config;

		document.getElementsByTagName("body")[0].appendChild(this._menu);
		
		this.attach = function(target) {
			target.addEventListener('contextmenu', this.show.bind(this));
		};
		
		this.show = function(evt) {
			evt.preventDefault();

			this._target=evt.target;
			this._menu.innerHTML="<table/>";
			this._config.forEach(function(item) {
				let _title = _evaluateDynamic(item.renderer, evt);
				let _disabled = _evaluateDynamic(item.disabled, evt);
				let _style = _evaluateDynamic(item.style, evt);
				let tr = document.createElement("tr");
				tr.innerHTML = "<td>" + _title + "</td>";
				Object.keys(_style).forEach(function(key) {
					tr.firstChild.style[key]=_style[key];
				});
				if (!_disabled) {
					tr.firstChild.addEventListener('click', function() {
						item.onClick({api: {close: this._close.bind(this)}, originEvent: evt});
					}.bind(this));
				}
				this._menu.firstChild.appendChild(tr);
			}.bind(this));
			this._menu.style.left=evt.clientX+"px";
			this._menu.style.top=evt.clientY+"px";
			this._menu.style.display="block";
		};
		
		this._close = function() {
			this._menu.style.display="none";
		};

	};
	return _cm;
})();
 