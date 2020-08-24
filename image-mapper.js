const EL_browse = document.getElementById('browse');
const EL_preview = document.getElementById('preview');
const EL_preview2 = document.getElementById('preview2');
var imageSource = [];
const readImage = file => {
	if (!(/^image\/(png|jpe?g|gif)$/).test(file.type))
		return EL_preview2.insertAdjacentHTML('beforeend', `<div>Unsupported format ${file.type}: ${file.name}</div>`);

	const reader = new FileReader();
	reader.addEventListener('load', () => {
		const img = new Image();
		img.addEventListener('load', () => {
			EL_preview2.appendChild(img);
			EL_preview.appendChild(img);

			EL_preview2.insertAdjacentHTML('beforeend', `<div id="details"><p>Image name: ${file.name}</p><p>Dimensions: ${img.width} × ${img.height}</p><p>MIME type: ${file.type}</p></div>`);

			imageSource.push(img.src, img.height, img.width)

			renderChart(imageSource);
		});
		img.src = reader.result;

	});

	reader.readAsDataURL(file);

};

EL_browse.addEventListener('change', ev => {
	EL_preview.innerHTML = '';
	const files = ev.target.files;
	if (!files || !files[0]) return alert('File upload not supported');
	[...files].forEach(readImage);

});

function renderChart(data) {

	console.log("data", data)

	var w = window.innerWidth,
		h = window.innerHeight,
		margin = {
			top: 40,
			right: 20,
			bottom: 20,
			left: 40
		},
		radius = 6;

	var svg = d3.select("body").select("#chart").append("svg").attr({
		width: imageSource[2],
		height: imageSource[1]
	});

	var group = svg.append("g");

	group.append("image")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", imageSource[1])
		.attr("width", imageSource[2])
		.attr("href", imageSource[0])


	var dataset = [];

	var circleAttrs = {
		cx: function (d) {
			return (d.x);
		},
		cy: function (d) {
			return (d.y);
		},
		r: radius,
		txt: ""
	};


	svg.on("click", function () {


		var coords = d3.mouse(this);


		var e = [d3.event.pageX, d3.event.pageY],
			a = e[0],
			n = e[1];
		d3.select("#dialog").style("display", "block").style("left", a + "px").style("top", n + "px")

		d3.select("#save").on("click", function () {

			var textValue = $("#description").val();
			var newData = {
				x: Math.round((coords[0])),
				y: Math.round((coords[1])),
				text: textValue
			};
			dataset.push(newData);


			svg.selectAll("circle")
				.data(dataset)
				.enter()
				.append("circle")
				.attr(circleAttrs)
				.style("fill", "#fb8310")
				.on("mouseover", function (d) {
					d3.select('#tip').style("display", "block").style("left", (a + 10) + "px").style("top", n + "px");
					d3.select('#tipText').text(d.text);
				}).on("mouseout", function () {
					d3.select('#tip').style("display", "none")
				});


			d3.select("#dialog").style("display", "none");
			$("#description").val("");

			console.log(dataset);
			GenerateTable(dataset);

		})

		d3.select("#cancel").on("click", function () {
			d3.select("#dialog").style("display", "none");
			$("#description").val("");
		})


	})


	function GenerateTable(dataset) {
		var customers = new Array();
		customers.push(["X Pos", "Y pos", "Description"]);
		var ncustomers = [];
		for (var i = 0; i < dataset.length; i++) {
			ncustomers.push([dataset[i].x, dataset[i].y, dataset[i].text])
		}


		var table = document.createElement("TABLE");
		table.border = "1";

		var columnCount = customers[0].length;

		var row = table.insertRow(-1);
		for (var i = 0; i < columnCount; i++) {
			var headerCell = document.createElement("TH");
			headerCell.innerHTML = customers[0][i];
			row.appendChild(headerCell);
		}

		for (var i = 0; i < ncustomers.length; i++) {
			row = table.insertRow(-1);
			for (var j = 0; j < columnCount; j++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = ncustomers[i][j];
			}
		}

		var dvTable = document.getElementById("dvTable");
		dvTable.innerHTML = "";
		dvTable.appendChild(table);
	}

}
          
