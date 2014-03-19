image_url = "#{location.pathname}images/spaceman.png"
PNG.load image_url, null, (png) ->
    $canvas = $ '#canvas'
    $canvas.width(png.width).height(png.height)
    $('.canvas-wrap').css 'visibility', 'visible'
    cnt = png.width * png.height
    _pixels = png.decodePixels()
    pixels = Array(cnt * 4)
    png.copyToImageData({data: pixels}, _pixels)

    matrix = new Array(png.height)
    k = -1
    for i in [0...png.height]
        matrix[i] = row = new Array(png.width)
        for j in [0...png.width]
            k += 1
            r = pixels[4 * k] or 0
            g = pixels[4 * k + 1] or 0
            b = pixels[4 * k + 2] or 0
            row[j] =
                next: {}
                w: 1
                h: 1
                x: j
                y: i
                r: r
                g: g
                b: b

    h = 2
    w = 2
    while w <= png.width
        m = new Array(png.height / h)
        for i in [0...png.height / h]
            m[i] = row = new Array(png.width / w)
            for j in [0...png.width / w]
                tl = matrix[2 * i][2 * j]
                tr = matrix[2 * i][2 * j + 1]
                bl = matrix[2 * i + 1][2 * j]
                br = matrix[2 * i + 1][2 * j + 1]
                r = parseInt((tl.r + tr.r + bl.r + br.r) / 4, 10)
                g = parseInt((tl.g + tr.g + bl.g + br.g) / 4, 10)
                b = parseInt((tl.b + tr.b + bl.b + br.b) / 4, 10)

                row[j] =
                    next: tl: tl, tr: tr, bl: bl, br: br
                    w: w
                    h: h
                    x: j * w
                    y: i * h
                    r: r
                    g: g
                    b: b
        matrix = m
        h *= 2
        w *= 2

    to_hex = (d) ->
        r = d.toString(16)
        if r.length < 2
            r = '0' + r
        r

    draw_sq = (sq) ->
        if not sq
            return
        $p = $ '<p>'
        bg = "##{to_hex(sq.r)}#{to_hex(sq.g)}#{to_hex(sq.b)}"
        $p.css
            left: sq.x + 'px'
            top: sq.y + 'px'
            width: sq.w + 'px'
            height: sq.h + 'px'
            'background-color': bg
        $p.appendTo $canvas
        if sq.next and sq.w > 4
            $p.mouseenter ->
                $p.remove()
                #setTimeout ->
                draw_sq sq.next.tl
                draw_sq sq.next.tr
                draw_sq sq.next.bl
                draw_sq sq.next.br
                #, 50

    draw_sq matrix[0][0]
