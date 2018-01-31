;
(function () {
  var transform = getTransform();

  function Drag(selector) {
    this.elem = typeof selector == 'Object' ? selector : document.getElementById(selector);
    this.startX = 0;
    this.startY = 0;
    this.sourceX = 0;
    this.sourceY = 0;
    this.init();
  }

  Drag.prototype = {
    constructor: Drag,
    init: function () {
      this.setDrag();
    },

    getStyle: function (property) {
      return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property]
    },

    getPosition: function () {
      var pos = { x: 0, y: 0 };
      if (transform) {
        var transformValue = this.getStyle(transform);
        if (transformValue === 'none') {
          this.elem.style[transform] = 'translate(0, 0)';
          return pos;
        } else {
          var temp = transformValue.match(/-?\d+/g);
          return pos = {
            x: parseInt(temp[4].trim()),
            y: parseInt(temp[5].trim())
          }
        }
      } else {
        if (getStyle('position') == 'static') {
          this.elem.style.position = 'relative';
          return pos;
        } else {
          var x = parseInt(getStyle('left')) ? getStyle('left') : 0;
          var y = parseInt(getStyle('top')) ? getStyle('top') : 0;
          return pos = {
            x: x,
            y: y
          }
        }
      }
      return pos;
    },

    setPosition: function (pos) {
      if (transform) {
        this.elem.style[transform] = "translate(" + pos.x + "px, " + pos.y + "px)";
      } else {
        this.elem.style.left = pos.x + 'px';
        this.elem.style.top = pos.y + 'px';
      }
    },


    setDrag: function () {
      var self = this;
      this.elem.addEventListener('mousedown', start, false);
      function start(event) {
        console.log("start");
        self.startX = event.pageX;
        self.startY = event.pageY;

        var pos = self.getPosition();
        self.sourceX = pos.x;
        self.sourceY = pos.y;
        document.addEventListener('mousemove', move, false);
        document.addEventListener('mouseup', end, false);
      }

      function move(event) {
        var currentX = event.pageX,
          currentY = event.pageY;
        var disX = currentX - self.startX,
          disY = currentY - self.startY;
        self.setPosition({
          x: (self.sourceX + disX).toFixed(),
          y: (self.sourceY + disY).toFixed()
        })
      }

      function end(event) {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
      }
    }
  }

  function getTransform() {
    var transform = '',
      divStyle = document.createElement('div').style,
      transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
      i = 0,
      len = transformArr.length;
    for (; i < len; i++) {
      if (transformArr[i] in divStyle) {
        transform = transformArr[i];
      }
    }

    return transform;
  }

  window.Drag = Drag;
})();





