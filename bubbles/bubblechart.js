/**
 * BubbleChart (1.1.2)
 *
 * Author: Jonathan D. Johnson (http://jondavidjohn.com)
 * Homepage: https://github.com/jondavidjohn/bubblechart
 * Issue Tracker: https://github.com/jondavidjohn/bubblechart/issues
 * License: Apache 2.0
 */
(function() {
  this.BubbleChart = (function() {
    function BubbleChart(o) {
      var a, comment, url,
        _this = this;
      this.o = o;
      this.data = o.data || [];
      this.metric = o.metric;
      this.fillColors = o.fillColors || [];
      this.contain = o.contain || false;
      this.gutter = o.gutter || 0;
      this.canvas = document.getElementById(o.canvasId);
      if (o.attribution == null) {
        o.attribution = 'before';
      }
      if (o.attribution) {
        url = 'https://github.com/jondavidjohn/bubblechart';
        a = document.createElement('div');
        a.className = 'bubblechart-attribution';
        a.innerHTML = "<small>(Powered by <a href=\"" + url + "\">BubbleChart</a>)</small>";
        if (o.attribution === 'before') {
          this.canvas.parentNode.insertBefore(a, this.canvas);
        }
        if (o.attribution === 'after') {
          this.canvas.parentNode.insertBefore(a, this.canvas.nextSibling);
        }
      }
      comment = document.createComment(' BubbleChart by jondavidjohn (http://jondavidjohn.github.io/bubblechart/) ');
      if (this.canvas.firstChild != null) {
        this.canvas.insertBefore(comment, this.canvas.firstChild);
      } else {
        this.canvas.appendChild(comment);
      }
      this.pointer = new BubbleChart.Pointer();
      (function(c) {
        var ratio;
        c.context = c.getContext('2d');
        ratio = BubbleChart.getPixelRatio(c.context);
        c.style.height = "" + c.height + "px";
        c.style.width = "" + c.width + "px";
        c.width = c.width * ratio;
        c.height = c.height * ratio;
        c.style.position = "relative";
        c.onmousemove = c.ontouchmove = _this.pointer.e_move;
        c.onmousedown = c.ontouchstart = _this.pointer.e_grab;
        c.onmouseup = c.onmouseout = c.ontouchend = _this.pointer.e_release;
        c.style.webkitUserSelect = "none";
        c.area = c.height * c.width;
        c.usableArea = c.area * (o.usedArea || 0.2);
        c.midpoint = new BubbleChart.Point(c.width / 2, c.height / 2);
        return _this.spinner = new BubbleChart.Spinner(_this.canvas.context);
      })(this.canvas);
      if (this.data.length) {
        this.reload();
      }
    }

    BubbleChart.getBackingStoreRatio = function(context) {
      return context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    };

    BubbleChart.getPixelRatio = function(context) {
      var backingStoreRatio, ratio;
      ratio = window.devicePixelRatio || 1;
      backingStoreRatio = BubbleChart.getBackingStoreRatio(context);
      return ratio / backingStoreRatio;
    };

    BubbleChart.prototype.reload = function() {
      var d, opts, randColor, _i, _len, _ref, _results;
      this.bubbles = [];
      this.metricTotal = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          _results.push(d.data);
        }
        return _results;
      }).call(this)).reduce(function(a, b) {
        return a + b;
      });
      _ref = this.data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        randColor = (function(c) {
          return c[c.length ? Math.randInt(c.length) : void 0];
        })(this.fillColors);
        opts = {
          href: d.href,
          label: d.label,
          metric: d.metric || this.o.metric,
          data: d.data,
          img_src: d.img_src,
          img_area: d.img_area,
          fillColor: d.fillColor || randColor,
          borderColor: d.borderColor || this.o.borderColor,
          textColor: d.textColor || this.o.textColor,
          textFont: d.textFont || this.o.textFont,
          borderSize: d.borderSize || this.o.borderSize,
          radius: Math.sqrt(this.canvas.usableArea * (d.data / this.metricTotal)) / 2,
          popoverOpts: this.o.popoverOpts,
          position: new BubbleChart.Point(Math.randInt(Math.sqrt(this.canvas.area)), Math.randInt(Math.sqrt(this.canvas.area))),
          pointOfGravity: this.canvas.midpoint
        };
        this.bubbles.push(new BubbleChart.Bubble(opts));
        _results.push(this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height));
      }
      return _results;
    };

    BubbleChart.prototype.advance = function() {
      var b, bubble, _i, _len, _ref, _results;
      _ref = this.bubbles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        b.advance(this);
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.bubbles;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            bubble = _ref1[_j];
            if (b.label !== bubble.label && b.overlapsWith(bubble)) {
              b.resolveCollisionWith(bubble);
            }
            if (this.contain) {
              _results1.push(bubble.pushAwayFromEdges(this.canvas, this.gutter));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    BubbleChart.prototype.paint = function(_animate) {
      var b, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2,
        _this = this;
      if (_animate == null) {
        _animate = true;
      }
      if (!this.pointer.grabbingBubble()) {
        this.canvas.style.cursor = "default";
      }
      if (!this.pointer.grabbingBubble()) {
        this.pointer.bubble = null;
      }
      setTimeout((function() {
        return _this.advance();
      }), 0);
      _ref = this.bubbles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        if (b.last_draw != null) {
          b.clear(this.canvas.context);
        }
      }
      _ref1 = this.bubbles;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        b = _ref1[_j];
        if (b.popover.last_draw != null) {
          b.popover.clear(this.canvas.context);
        }
        if (!this.pointer.grabbingBubble()) {
          if ((this.pointer.current != null) && this.pointer.current.distance(b.position) <= b.radius) {
            this.pointer.bubble = b;
          }
        }
      }
      _ref2 = this.bubbles;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        b = _ref2[_k];
        b.paint(this.canvas.context);
      }
      if (this.pointer.bubble != null) {
        this.canvas.style.cursor = "pointer";
        this.pointer.bubble.popover.paint(this.pointer, this.canvas.context);
      }
      if (_animate) {
        return requestAnimationFrame((function() {
          return _this.paint();
        }));
      }
    };

    return BubbleChart;

  })();

}).call(this);
;(function() {
  BubbleChart.Bubble = (function() {
    function Bubble(o) {
      this.grabbed = false;
      this.bully = false;
      this.pointOfGravity = o.pointOfGravity;
      this.href = o.href;
      this.label = o.label;
      this.metric = o.metric;
      this.data = o.data;
      this.img_src = o.img_src;
      this.fillColor = o.fillColor;
      this.borderColor = o.borderColor;
      this.textColor = o.textColor;
      this.textFont = o.textFont || "helvetica";
      this.borderSize = o.borderSize;
      this.radius = o.radius;
      this.position = o.position;
      this.diameter = this.radius * 2;
      this.reach = this.radius + 1;
      this.img_area = o.img_area || 0.8;
      if (this.borderSize != null) {
        this.reach += this.borderSize;
      }
      this.popover = new BubbleChart.Popover(this, o.popoverOpts || {});
      this.pre = null;
      this.img = new Image();
      this.last_draw = null;
      this.render();
    }

    Bubble.prototype.getVelocity = function() {
      return {
        x: 0.04 * (this.pointOfGravity.x - this.position.x),
        y: 0.04 * (this.pointOfGravity.y - this.position.y)
      };
    };

    Bubble.prototype.advance = function(chart) {
      var p, v;
      if (this.grabbed) {
        p = chart.pointer;
        if ((p.current != null) && (p.diff != null)) {
          this.position.x = p.current.x - p.diff.x;
          return this.position.y = p.current.y - p.diff.y;
        }
      } else {
        v = this.getVelocity();
        this.position.x += v.x;
        return this.position.y += v.y;
      }
    };

    Bubble.prototype.distanceFrom = function(bubble) {
      return this.position.distance(bubble.position) - (this.reach + bubble.reach);
    };

    Bubble.prototype.overlapsWith = function(bubble) {
      return this.distanceFrom(bubble) < 0;
    };

    Bubble.prototype.hasSpatialInferiorityTo = function(bubble) {
      return bubble.grabbed || (bubble.radius > this.radius && !this.grabbed) || (bubble.radius > this.radius && (this.bully && bubble.bully) && !this.grabbed) || (bubble.bully && !this.grabbed);
    };

    Bubble.prototype.resolveCollisionWith = function(bubble) {
      var currentDistance, currentRealDistance, rAngle, targetDistance;
      if (this.overlapsWith(bubble)) {
        currentDistance = this.position.distance(bubble.position);
        currentRealDistance = this.distanceFrom(bubble);
        targetDistance = currentDistance - currentRealDistance;
        if (this.hasSpatialInferiorityTo(bubble)) {
          rAngle = this.position.rAngle(bubble.position);
          this.position.x = bubble.position.x + targetDistance * Math.cos(rAngle);
          this.position.y = bubble.position.y + targetDistance * Math.sin(rAngle);
          return this.bully = true;
        } else {
          rAngle = bubble.position.rAngle(this.position);
          bubble.position.x = this.position.x + targetDistance * Math.cos(rAngle);
          bubble.position.y = this.position.y + targetDistance * Math.sin(rAngle);
          return bubble.bully = true;
        }
      }
    };

    Bubble.prototype.pushAwayFromEdges = function(canvas, gutter) {
      if (this.position.y - this.reach + gutter < 0) {
        this.position.y = this.reach - gutter;
        return this.bully = true;
      } else if (this.position.y + this.reach - gutter > canvas.height) {
        this.position.y = canvas.height - this.reach + gutter;
        return this.bully = true;
      } else if (this.position.x + this.reach - gutter > canvas.width) {
        this.position.x = canvas.width - this.reach + gutter;
        return this.bully = true;
      } else if (this.position.x - this.reach + gutter < 0) {
        this.position.x = this.reach - gutter;
        return this.bully = true;
      }
    };

    Bubble.prototype.paint = function(context) {
      if (this.pre != null) {
        this.last_draw = {
          x: this.position.x - this.radius,
          y: this.position.y - this.radius,
          w: this.pre.width,
          h: this.pre.height
        };
        return context.drawImage(this.pre, this.last_draw.x, this.last_draw.y, this.last_draw.w, this.last_draw.h);
      }
    };

    Bubble.prototype.render = function() {
      var pre_context, ratio, spacingX, spacingY, text_measurement, truncated_label,
        _this = this;
      if (this.img_src != null) {
        this.img.onload = function() {
          var bsRatio, canvas, ctx, img_arc_r, img_arc_x, img_arc_y, pre_ctx;
          canvas = document.createElement('canvas');
          ctx = canvas.getContext('2d');
          bsRatio = BubbleChart.getBackingStoreRatio(ctx);
          if (_this.img_src.indexOf('@2x') === !-1) {
            _this.img.height = _this.img.height / 2;
            _this.img.width = _this.img.width / 2;
          } else if (bsRatio > 1) {
            _this.img.height = _this.img.height / bsRatio;
            _this.img.width = _this.img.width / bsRatio;
          }
          while (_this.img.width > _this.diameter * _this.img_area) {
            _this.img.height = _this.img.height * 0.75;
            _this.img.width = _this.img.width * 0.75;
          }
          canvas.height = _this.img.height;
          canvas.width = _this.img.width + 2;
          img_arc_x = _this.img.width / 2 + 2;
          img_arc_y = _this.img.height / 2;
          img_arc_r = _this.img.width / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(img_arc_x, img_arc_y, img_arc_r, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(_this.img, 1, 0, _this.img.width, _this.img.height);
          ctx.restore();
          ctx.arc(img_arc_x, img_arc_y, _this.img.width / 2, 0, Math.PI * 2, true);
          ctx.lineWidth = 1;
          ctx.strokeStyle = _this.fillColor;
          ctx.stroke();
          pre_ctx = _this.pre.getContext('2d');
          return pre_ctx.drawImage(canvas, _this.radius - (canvas.width / 2), _this.radius - ((_this.img.height - _this.img.width) / 2) - (_this.img.width / 2), canvas.width, canvas.height);
        };
        this.img.src = this.img_src;
      }
      this.pre = document.createElement('canvas');
      pre_context = this.pre.getContext('2d');
      ratio = BubbleChart.getPixelRatio(pre_context);
      this.pre.height = this.pre.width = (this.diameter + 3) * ratio;
      pre_context.beginPath();
      pre_context.fillStyle = this.fillColor;
      pre_context.arc(this.radius + 1, this.radius + 1, this.radius, 0, Math.PI * 2, true);
      pre_context.fill();
      if (this.borderColor != null) {
        pre_context.lineWidth = this.borderSize;
        pre_context.strokeStyle = this.borderColor;
        pre_context.stroke();
      }
      if (this.textColor) {
        pre_context.font = "" + (20 * ratio) + "px '" + this.textFont + "'";
        pre_context.fillStyle = this.textColor;
        text_measurement = pre_context.measureText(this.label);
        if (text_measurement.width + 12 < this.diameter) {
          spacingX = this.radius - (text_measurement.width / 2);
          spacingY = this.radius + (14 / 2);
          pre_context.fillText(this.label, spacingX, spacingY);
        } else {
          pre_context.font = "" + (12 * ratio) + "px helvetica";
          text_measurement = pre_context.measureText(this.label);
          if (text_measurement.width + 7 < this.diameter) {
            spacingX = this.radius - (text_measurement.width / 2);
            spacingY = this.radius + (4 / 2);
            pre_context.fillText(this.label, spacingX, spacingY);
          } else {
            truncated_label = "" + this.label + "...";
            while (truncated_label && text_measurement.width + 7 >= this.diameter) {
              truncated_label = truncated_label.substr(0, truncated_label.length - 4).concat('...');
              if (truncated_label === '...') {
                truncated_label = false;
              }
              text_measurement = pre_context.measureText(truncated_label);
            }
            if (truncated_label) {
              spacingX = this.radius - (text_measurement.width / 2);
              spacingY = this.radius + (4 / 2);
              pre_context.fillText(truncated_label, spacingX, spacingY);
            }
          }
        }
      }
      return pre_context.closePath();
    };

    Bubble.prototype.clear = function(context) {
      if (this.last_draw != null) {
        context.clearRect(this.last_draw.x - 5, this.last_draw.y - 5, this.last_draw.w + 10, this.last_draw.h + 10);
        return this.last_draw = null;
      }
    };

    return Bubble;

  })();

}).call(this);
;(function() {
  BubbleChart.Point = (function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    Point.prototype.slope = function(point) {
      var rise, run;
      rise = this.y - point.y;
      run = this.x - point.x;
      return rise / run;
    };

    Point.prototype.angle = function(point) {
      return this.rAngle(point) * 180 / Math.PI + 180;
    };

    Point.prototype.rAngle = function(point) {
      return Math.atan2(this.y - point.y, this.x - point.x);
    };

    Point.prototype.diff = function(point) {
      return {
        x: this.x - point.x,
        y: this.y - point.y
      };
    };

    Point.prototype.distance = function(point) {
      var diff;
      diff = this.diff(point);
      return Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
    };

    return Point;

  })();

}).call(this);
;(function() {
  BubbleChart.Pointer = (function() {
    function Pointer() {
      var self;
      this.current = null;
      this.bubble = null;
      this.diff = null;
      this.moving = false;
      this.dragging = false;
      self = this;
      this.e_move = (function() {
        var stop;
        stop = null;
        return function(e) {
          var _this = this;
          clearTimeout(stop);
          self.current = self.getPosition(e);
          self.moving = true;
          if (self.grabbingBubble()) {
            e.preventDefault();
            self.dragging = true;
          }
          return stop = setTimeout((function() {
            return self.moving = false;
          }), 50);
        };
      })();
      this.e_grab = function(e) {
        if (self.bubble != null) {
          e.preventDefault();
          self.bubble.grabbed = true;
          self.diff = self.current.diff(self.bubble.position);
          return self.current = null;
        }
      };
      this.e_release = function(e) {
        if (self.grabbingBubble()) {
          e.preventDefault();
          self.bubble.grabbed = false;
          self.diff = null;
          if (!self.dragging) {
            if ((typeof window !== "undefined" && window !== null) && (self.bubble.href != null)) {
              window.location.href = self.bubble.href;
            }
          }
          self.dragging = false;
        }
        if (e.type === 'mouseout') {
          return self.current = null;
        }
      };
    }

    Pointer.prototype.grabbingBubble = function() {
      return (this.bubble != null) && this.bubble.grabbed;
    };

    Pointer.prototype.getPosition = (function() {
      var left, top;
      top = {};
      left = {};
      return function(e) {
        var element, element_id, pr, x, y;
        element = e.target || e.srcElement;
        element_id = element.id;
        pr = BubbleChart.getPixelRatio(element.getContext('2d'));
        if (!((top[element_id] != null) && (left[element_id] != null))) {
          top[element_id] = 0;
          left[element_id] = 0;
          while (true) {
            top[element_id] += element.offsetTop || 0;
            left[element_id] += element.offsetLeft || 0;
            element = element.offsetParent;
            if (!element) {
              break;
            }
          }
        }
        if (e.touches && e.touches.length > 0) {
          x = e.touches[0].pageX - left[element_id];
          y = e.touches[0].pageY - top[element_id];
        } else {
          x = e.pageX - left[element_id];
          y = e.pageY - top[element_id];
        }
        return new BubbleChart.Point(x * pr, y * pr);
      };
    })();

    return Pointer;

  })();

}).call(this);
;(function() {
  BubbleChart.Popover = (function() {
    function Popover(bubble, o) {
      this.bubble = bubble;
      this.fillColor = o.fillColor || '#333';
      this.textColor = o.textColor || '#FFF';
      this.textFont = o.textFont || 'helvetica';
      this.opacity = o.opacity || 0.8;
      this.labelSize = o.labelSize || 18;
      this.metricSize = o.metricSize || 12;
      this.last_draw = null;
      this.textDems = {};
      this.pre = null;
    }

    Popover.prototype.getTextDems = function(context, text, size, font) {
      var d, height, width;
      if (this.textDems["" + text + size + font] == null) {
        context.font = "" + size + "px '" + font + "'";
        width = context.measureText(text).width;
        d = document.createElement("span");
        d.style.fontSize = "" + size + "px";
        d.style.fontFamily = font;
        d.style.visibility = "hidden";
        d.textContent = text;
        document.body.appendChild(d);
        height = d.offsetHeight;
        document.body.removeChild(d);
        this.textDems["" + text + size + font] = {
          width: width,
          height: height
        };
      }
      return this.textDems["" + text + size + font];
    };

    Popover.prototype.calculateTriangle = function(base_width, height, ratio) {
      var triangle;
      triangle = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0
      };
      triangle.x -= base_width / 2;
      triangle.x2 = triangle.x + base_width / 2;
      triangle.x3 = triangle.x + base_width;
      if (height > 0) {
        triangle.y += height - (26 * ratio);
      } else {
        triangle.y += height + (48 * ratio);
      }
      triangle.y2 = triangle.y + height;
      triangle.y3 = triangle.y;
      return triangle;
    };

    Popover.prototype.paint = function(pointer, context) {
      var box_height, detailX, detailY, l_dems, labelSize, labelX, labelY, lineHeight, lineWidth, lr_pad, m_dems, metricSize, metric_text, ratio, tb_pad, triangle, triangle_height, triangle_width;
      if (pointer.current == null) {
        return;
      }
      ratio = BubbleChart.getPixelRatio(context);
      labelSize = this.labelSize;
      metricSize = this.metricSize;
      lr_pad = 8 * ratio;
      tb_pad = 5 * ratio;
      triangle_width = 16 * ratio;
      triangle_height = 8 * ratio;
      metric_text = "" + this.bubble.data + " " + this.bubble.metric;
      l_dems = this.getTextDems(context, this.bubble.label, labelSize, this.textFont);
      m_dems = this.getTextDems(context, metric_text, metricSize, this.textFont);
      lineWidth = (Math.max(l_dems.width, m_dems.width) + (lr_pad * 2)) * ratio;
      lineHeight = Math.max(l_dems.height, m_dems.height) * ratio;
      box_height = (lineHeight * 2) + (tb_pad * 2);
      labelX = pointer.current.x - (14 * ratio);
      labelY = pointer.current.y - box_height - triangle_height - (tb_pad * 2);
      if (labelY < 0) {
        labelY = pointer.current.y + (40 * ratio);
        triangle = this.calculateTriangle(triangle_width, -triangle_height, ratio);
      } else {
        triangle = this.calculateTriangle(triangle_width, triangle_height, ratio);
      }
      triangle.x += pointer.current.x;
      triangle.y += pointer.current.y;
      triangle.x2 += pointer.current.x;
      triangle.y2 += pointer.current.y;
      triangle.x3 += pointer.current.x;
      triangle.y3 += pointer.current.y;
      if (labelX + lineWidth > context.canvas.width) {
        labelX -= labelX + lineWidth - context.canvas.width;
      }
      this.last_draw = {
        x: labelX,
        y: labelY - triangle_height,
        w: lineWidth + 2,
        h: box_height + (triangle_height * 2)
      };
      context.beginPath();
      context.fillStyle = this.fillColor;
      context.globalAlpha = this.opacity;
      context.roundedRect(labelX, labelY, lineWidth, box_height, 7 * ratio);
      context.moveTo(triangle.x, triangle.y);
      context.lineTo(triangle.x2, triangle.y2);
      context.lineTo(triangle.x3, triangle.y3);
      context.lineTo(triangle.x, triangle.y);
      context.fill();
      context.globalAlpha = 1;
      context.fillStyle = this.textColor;
      context.font = "" + (labelSize * ratio) + "px " + this.textFont;
      context.fillText(this.bubble.label, labelX + lr_pad, labelY + lineHeight);
      context.font = "" + (metricSize * ratio) + "px " + this.textFont;
      detailX = labelX + lr_pad;
      detailY = labelY + lineHeight * 2;
      context.fillText(metric_text, detailX, detailY);
      return context.closePath();
    };

    Popover.prototype.clear = function(context) {
      if (this.last_draw != null) {
        context.clearRect(this.last_draw.x, this.last_draw.y, this.last_draw.w, this.last_draw.h);
        return this.last_draw = null;
      }
    };

    return Popover;

  })();

}).call(this);
;(function() {
  BubbleChart.Spinner = (function() {
    function Spinner(context) {
      this.context = context;
      this.running = false;
      this.lines = 12;
      this.start_date = null;
    }

    Spinner.prototype.start = function() {
      this.running = true;
      this.start_date = new Date();
      return this.paint();
    };

    Spinner.prototype.paint = function() {
      var i, rotation, _i, _ref,
        _this = this;
      rotation = parseInt(((new Date() - this.start_date) / 1000) * this.lines) / this.lines;
      this.context.save();
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
      this.context.rotate(Math.PI * 2 * rotation);
      this.context.scale(0.4, 0.4);
      for (i = _i = 0, _ref = this.lines; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.context.beginPath();
        this.context.rotate(Math.PI * 2 / this.lines);
        this.context.moveTo(this.context.canvas.width / 7, 0);
        this.context.lineTo(this.context.canvas.width / 4, 0);
        this.context.lineWidth = this.context.canvas.width / 50;
        this.context.strokeStyle = "rgba(0,0,0," + i / this.lines + ")";
        this.context.stroke();
      }
      this.context.restore();
      if (this.running) {
        return requestAnimationFrame((function() {
          return _this.paint();
        }));
      } else {
        return this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      }
    };

    Spinner.prototype.stop = function() {
      return this.running = false;
    };

    return Spinner;

  })();

}).call(this);
;(function() {
  CanvasRenderingContext2D.prototype.roundedRect = function(x, y, w, h, r) {
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    return this.arcTo(x, y, x + w, y, r);
  };

  Math.randInt = function(max) {
    if (max == null) {
      max = 100;
    }
    return Math.floor(Math.random() * max);
  };

  (function() {
    var lastTime, v, vendors;
    lastTime = 0;
    vendors = ['webkit', 'moz'];
    while (!window.requestAnimationFrame && vendors.length) {
      v = vendors.pop();
      window.requestAnimationFrame = window[v + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[v + 'CancelAnimationFrame'] || window[v + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(cb, ele) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout((function() {
          return cb(currTime + timeToCall);
        }), timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      return window.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

}).call(this);
