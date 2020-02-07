document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("choose-pic")
	
	function loadImage(src) {
		const img = new Image()
		const canvas = document.getElementById("img-canvas")
		const ctx = canvas.getContext("2d")

		img.addEventListener("load", () => {
			canvas.width = img.width
			canvas.height = img.height
			
			ctx.drawImage(img, 0, 0)

			pop()
		})

		img.src = src
	}

	async function pop() {
		const net = await bodyPix.load({
			architecture: "MobileNetV1",
			outputStride: 16,
			mutliplier: 0.75,
			quantBytes: 2
		})

		const canvas = document.getElementById("img-canvas")
		const {data:map} = await net.segmentPerson(canvas, {
			internalResolution: "full"
		})
	
		const ctx = canvas.getContext("2d")
		const { data:imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
		const newImg = ctx.createImageData(canvas.width, canvas.height);
		const newImgData = newImg.data;
		
		for(let i=0; i<map.length; i++) {
			const [r, g, b, a] = [imgData[i*4], imgData[i*4+1], imgData[i*4+2], imgData[i*4+3]];
			const gray = ((0.3 * r) + (0.59 * g) + (0.11 * b));

			[
				newImgData[i*4],
				newImgData[i*4+1],
				newImgData[i*4+2],
				newImgData[i*4+3]
			] = !map[i] ? [gray, gray, gray, 255] : [r, g, b, a];
		}
		
		ctx.putImageData(newImg, 0, 0);
	}

	loadImage("assets/adam2.jpg")
})