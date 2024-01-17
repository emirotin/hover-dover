import "png-js/zlib.js";
import "png-js/png.js";

function render(png) {
	const $canvas = $("#canvas");
	$canvas.html("").width(png.width).height(png.height);

	const cnt = png.width * png.height;

	const _pixels = png.decodePixels();
	const pixels = Array(cnt * 4);
	png.copyToImageData({ data: pixels }, _pixels);

	let matrix = new Array(png.height);
	let k = -1;
	for (let i = 0; i < png.height; i++) {
		const row = (matrix[i] = new Array(png.width));
		for (let j = 0; j < png.width; j++) {
			k += 1;
			const r = pixels[4 * k] || 0;
			const g = pixels[4 * k + 1] || 0;
			const b = pixels[4 * k + 2] || 0;
			row[j] = {
				next: {},
				w: 1,
				h: 1,
				x: j,
				y: i,
				r,
				g,
				b,
			};
		}
	}

	let h = 2;
	let w = 2;
	while (w <= png.width) {
		const m = new Array(png.height / h);
		for (let i = 0; i < png.height / h; i++) {
			let row = (m[i] = new Array(png.width / w));
			for (let j = 0; j < png.width / w; j++) {
				const tl = matrix[2 * i][2 * j];
				const tr = matrix[2 * i][2 * j + 1];
				const bl = matrix[2 * i + 1][2 * j];
				const br = matrix[2 * i + 1][2 * j + 1];
				const r = parseInt((tl.r + tr.r + bl.r + br.r) / 4, 10);
				const g = parseInt((tl.g + tr.g + bl.g + br.g) / 4, 10);
				const b = parseInt((tl.b + tr.b + bl.b + br.b) / 4, 10);

				row[j] = {
					next: { tl, tr, bl, br },
					w,
					h,
					x: j * w,
					y: i * h,
					r,
					g,
					b,
				};
			}
		}
		matrix = m;
		h *= 2;
		w *= 2;
	}

	const toHex = (d) => {
		let r = d.toString(16);
		if (r.length < 2) return "0" + r;
		return r;
	};

	const drawSquare = (sq) => {
		if (!sq) return;
		const $p = $("<p>");
		const bg = `#${toHex(sq.r)}${toHex(sq.g)}${toHex(sq.b)}`;
		$p.css({
			left: sq.x + "px",
			top: sq.y + "px",
			width: sq.w + "px",
			height: sq.h + "px",
			"background-color": bg,
		}).appendTo($canvas);
		if (sq.next && sq.w > 4) {
			$p.mouseenter(() => {
				$p.remove();

				drawSquare(sq.next.tl);
				drawSquare(sq.next.tr);
				drawSquare(sq.next.bl);
				drawSquare(sq.next.br);
			});
		}
	};

	drawSquare(matrix[0][0]);
}

const imageUrl = "images/spaceman.png";

PNG.load(imageUrl, null, render);
