//some events:
isMouseDown = false;
window.onmousedown = function(){
	isMouseDown = true;
}
window.onmouseup = function(){
	dragging = false;
	isMouseDown = false;
}

//Graph Settings:

/*Createing Node*/
function createNode (row, col){
	var node = {
		row: row,
		col: col,
		global_dis: Infinity,
		distance: Infinity,
		previous: null,
		element: null,
		isVisited: false,
		isWall: false,
		isStart: false,
		isEnd: false,
	}
	return node;
}

/*Creting Graph*/
function createGraph (rows, cols) {
	var newGraph = [];
	for (var y = 0; y < rows; y++){
		var row = [];
		for (var x = 0; x < cols; x++){
			var node = createNode(y, x);
			row.push(node);
		}
		newGraph.push(row);
	}
	return newGraph;
}

/*Update Graph Element:*/
function updateElement(graph, row, col, elm){
	var newGraph = graph.slice();
	var node = graph[row][col];
	if (node == null)
		return;
	var newNode = {
		...node,
		element: elm,
	}
	newGraph[row][col] = newNode;
	return newGraph;
}

/*Reset the visualized blocks on the graph*/
function resetGraph(graph, walls=false){
	for (const row of graph){
		for (const node of row){
			
			node.isVisited = false;
			node.global_dis = Infinity;
			node.distance = Infinity;
			node.previous = null;

			if (node.isStart || node.isEnd)
				continue;
			node.element.classList.remove("node-visited");
			node.element.classList.remove("node-shortest-path");
			if (walls){
				node.element.classList.remove("wall");
				node.element.style.backgroundColor = "transparent";
				node.isWall = false;
			}else{
				if (!node.isWall)
					node.element.style.backgroundColor = "transparent";
			}
		}
	}

	return graph;
}

/*Settiing Start, End or Wall Node*/
function setNode(graph, row, col, start=false, previousSt=null, previousEnd=null){
	if (typeof(graph[row][col]) == undefined)
		return;
	if (previousEnd != null){
		graph[previousEnd.row][previousEnd.col].isEnd = false;
		graph[previousEnd.row][previousEnd.col].element.style.backgroundColor = "transparent";
	}

	if (previousSt != null){
		graph[previousSt.row][previousSt.col].isEnd = false;
		graph[previousSt.row][previousSt.col].isStart = false;
		graph[previousSt.row][previousSt.col].distance = Infinity;
		graph[previousSt.row][previousSt.col].element.style.backgroundColor = "transparent";
	}

	graph[row][col].isStart = start;
	graph[row][col].isEnd = !start;
	if (start){
		graph[row][col].distance = 0;
		graph[row][col].element.style.backgroundColor = "green";
	}else{
		graph[row][col].element.style.backgroundColor = "red";
	}
	return graph;
}

/*Draw the graph as elements*/
function DrawGraph(graph){
	var newGraph = null;
	var graphEle = document.getElementById("grid");
	if (graphEle == null){
		console.log("what?");
	}
	var y = 0;
	var colEle;
	for (var row of graph){
		var rowEle = document.createElement("row-" + y);
		rowEle.classList.add("row")
		var x = 0;
		for (var node of row){
			colEle = document.createElement("col");
			colEle.id = node.row + "x" + node.col;
			colEle.classList.add("col");
			newGraph = updateElement(graph, node.row, node.col, colEle);
			//colEle.onclick =  function() {onNodeClick()};
			colEle.addEventListener("mouseover", function() {onNodeClick(this)});
			colEle.addEventListener("click", function() {onNodeClick(this, true)});
			colEle.addEventListener("mousedown", function() {onMouseDown(this)});
			colEle.addEventListener("mousueup", function() {dragging = false; isMouseDown = false; dragged = null;});
			rowEle.appendChild(colEle);

			x++;
		}
		graphEle.appendChild(rowEle);
		y++;
	}

	if (newGraph == null)
		return graph;
	else
		return newGraph;
}

/*Draw the shortest way on the graph*/
function drawWay(path, visual=false, t = 100, fun=null){
	var nodes = path;
	for (let i = 0; i <= path.length; i++){
		setTimeout(() => {
			if (i === path.length){
				if (fun != null) fun();
				return;
			}
			const node = path[i];
			if (node == null){
				return;
			}
			if (!visual){
				node.element.classList.remove("node-shortest-path");
				node.element.classList.add("node-shortest-path");

				//node.element.style.backgroundColor = "yellow";
			}
			else{
				node.element.classList.remove("node-visited");
				node.element.classList.add("node-visited");
				//node.element.style.backgroundColor = "blue";
			}
		}, t * i);
	}
}

/*Get All nodes in graph*/
function getAllNodes(graph){
	var nodes = [];
	for (var row of graph){
		for (var col of row){
			nodes.push(col);
		}
	}
	return nodes;
}