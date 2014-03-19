(function() {
  var image_url;

  image_url = "" + location.pathname + "images/spaceman.png";

  PNG.load(image_url, null, function(png) {
    var $canvas, b, bl, br, cnt, draw_sq, g, h, i, j, k, m, matrix, pixels, r, row, tl, to_hex, tr, w, _i, _j, _k, _l, _pixels, _ref, _ref1, _ref2, _ref3;
    $canvas = $('#canvas');
    $canvas.width(png.width).height(png.height);
    $('.canvas-wrap').css('visibility', 'visible');
    cnt = png.width * png.height;
    _pixels = png.decodePixels();
    pixels = Array(cnt * 4);
    png.copyToImageData({
      data: pixels
    }, _pixels);
    matrix = new Array(png.height);
    k = -1;
    for (i = _i = 0, _ref = png.height; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      matrix[i] = row = new Array(png.width);
      for (j = _j = 0, _ref1 = png.width; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        k += 1;
        r = pixels[4 * k] || 0;
        g = pixels[4 * k + 1] || 0;
        b = pixels[4 * k + 2] || 0;
        row[j] = {
          next: {},
          w: 1,
          h: 1,
          x: j,
          y: i,
          r: r,
          g: g,
          b: b
        };
      }
    }
    h = 2;
    w = 2;
    while (w <= png.width) {
      m = new Array(png.height / h);
      for (i = _k = 0, _ref2 = png.height / h; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
        m[i] = row = new Array(png.width / w);
        for (j = _l = 0, _ref3 = png.width / w; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
          tl = matrix[2 * i][2 * j];
          tr = matrix[2 * i][2 * j + 1];
          bl = matrix[2 * i + 1][2 * j];
          br = matrix[2 * i + 1][2 * j + 1];
          r = parseInt((tl.r + tr.r + bl.r + br.r) / 4, 10);
          g = parseInt((tl.g + tr.g + bl.g + br.g) / 4, 10);
          b = parseInt((tl.b + tr.b + bl.b + br.b) / 4, 10);
          row[j] = {
            next: {
              tl: tl,
              tr: tr,
              bl: bl,
              br: br
            },
            w: w,
            h: h,
            x: j * w,
            y: i * h,
            r: r,
            g: g,
            b: b
          };
        }
      }
      matrix = m;
      h *= 2;
      w *= 2;
    }
    to_hex = function(d) {
      r = d.toString(16);
      if (r.length < 2) {
        r = '0' + r;
      }
      return r;
    };
    draw_sq = function(sq) {
      var $p, bg;
      if (!sq) {
        return;
      }
      $p = $('<p>');
      bg = "#" + (to_hex(sq.r)) + (to_hex(sq.g)) + (to_hex(sq.b));
      $p.css({
        left: sq.x + 'px',
        top: sq.y + 'px',
        width: sq.w + 'px',
        height: sq.h + 'px',
        'background-color': bg
      });
      $p.appendTo($canvas);
      if (sq.next && sq.w > 4) {
        return $p.mouseenter(function() {
          $p.remove();
          draw_sq(sq.next.tl);
          draw_sq(sq.next.tr);
          draw_sq(sq.next.bl);
          return draw_sq(sq.next.br);
        });
      }
    };
    return draw_sq(matrix[0][0]);
  });

}).call(this);
