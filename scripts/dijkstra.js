var graph = createGraph(16, 25);
graph = DrawGraph(graph);
graph = setNode(graph, 7, 3, true);
graph = setNode(graph, 7, 20, false);
var startNode = graph[7][3];
var endNode = graph[7][20];

var dragging = false;
var dragged = null;

var algo = "Dijkstra";


function SetAlgo(x){
	algo = x;
	elm = document.getElementById("visual-btn");
	if (elm)
		elm.innerHTML = "Visualize " + algo;
}

function Clear(){
	resetGraph(graph, true);
}

function Search(){
	resetGraph(graph);
	var nodes = [];
	var visitedNodes = [];
	switch(algo){
		case "Dijkstra":
		visitedNodes = Dijkstra(startNode);
		visitedNodes.shift();
		nodes = getShortestPath(endNode);
		break;
		case "A*":
		visitedNodes = A_start(startNode);
		nodes = getShortestPath(endNode);
		break;
	}
	
	nodes.shift();
	nodes.pop();
	visitedNodes.pop();
	drawWay(visitedNodes, true, 50, () => drawWay(nodes, false, 40));
}
function onMouseDown(elm){
	if (elm.id == startNode.element.id || elm.id == endNode.element.id){
		console.log("changing position");
		dragged = (elm.id == startNode.element.id) ? startNode : endNode;
		dragging = true;
	}
}
function onNodeClick(id, click){

	if (isMouseDown || click){
		var spl = id.id.split("x");
		var node = graph[spl[0]][spl[1]];
		if (dragging && isMouseDown){
			if (dragged != null){
				if (dragged.isEnd){
					console.log("dragging end");
					graph = setNode(graph, node.row, node.col, false, null, endNode);
					endNode = graph[node.row][node.col];
					dragged = endNode;
				}else if (dragged.isStart){
					graph = setNode(graph, node.row, node.col, true, startNode, null);
					startNode = graph[node.row][node.col];
					dragged = startNode;
				}
				console.log(dragged);
				console.log(graph[spl[0]][spl[1]]);
			}
			return;
		}
		if (id.id == startNode.element.id || id.id == endNode.element.id)
			return;

		id.classList.remove("node-visited");
		id.classList.remove("node-shortest-path");
		if (node.isWall){
			console.log("it is wall");
			id.classList.remove("wall");
			node.isWall = false;
			return;
		}

		id.classList.add("wall");
		node.isWall = true;
	}
}

// (2) Setting up the Alogarithms
function Dijkstra(startPoint){
	var visited = [];
	startPoint.distance = 0;
	const unvisited = getAllNodes(graph);
	
	while(!!unvisited.length){
		//sorting the nodes
		sortNodesByDistance(unvisited);
		//get the closest node
		var node = unvisited.shift();
		//check if wall
		if (node.isWall) continue;
		//blocked Way
		if (node.distance == Infinity) return visited;
		//mark as visited
		node.isVisited = true;
		visited.push(node);
		//got End node
		if (node.isEnd) return visited;
		updateUnvisitedNeigbhors(node, graph);
	}
}

function A_start(startPoint){
	if (!startPoint.global_dis)
		return;

	const visited = [];
	const checkedList = [];
	const untestedListed = [];

	startPoint.distance = 0;
	startPoint.global_dis = getDistance(startPoint, endNode);
	untestedListed.push(startPoint);

	var heuristic = function (a, b) {
		return getDistance(a, b);
	}

	while (!!untestedListed.length){
		sortNodesByGlobalDistance(untestedListed);

		const node = untestedListed.shift();
		const neighbors = getNeighbors(node, graph);

		if (node.isVisited)
			continue;

		if (node.isEnd && node == endNode)
			return visited;

		node.isVisited = true;

		for (neighbor of neighbors){
			if (!neighbor.isVisited && !neighbor.isWall){
				untestedListed.push(neighbor);
				visited.push(neighbor);
			}

			currDis = node.distance + getDistance(node, endNode);

			if (currDis < neighbor.distance){
				neighbor.previous = node;
				neighbor.distance = currDis;
				
				neighbor.global_dis = heuristic(neighbor, endNode);
			}
			console.log(neighbor);
		}
	}

	return visited;

}

function getDistance(a, b){
	return Math.sqrt(Math.pow((b.row - a.row), 2) + Math.pow((b.col - a.col), 2));
}

function sortNodesByGlobalDistance(unvisited){
	unvisited.sort((nodeA, nodeB) => nodeA.global_dis - nodeB.global_dis);
}

function sortNodesByDistance(unvisited){
	unvisited.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeigbhors(node, graph){
	const unvisitedNeighbor = getUnvisitedNeighbors(node, graph);
	for (const neighbor of unvisitedNeighbor){
		neighbor.distance = node.distance + 1;
		neighbor.previous = node;
	}
}

function getNeighbors(node, graph){
	const neighbors = [];
   const {col, row} = node;
   if (row > 0) neighbors.push(graph[row - 1][col]);
   if (row < graph.length - 1) neighbors.push(graph[row + 1][col]);
   if (col > 0) neighbors.push(graph[row][col - 1]);
   if (col < graph[0].length - 1) neighbors.push(graph[row][col + 1]);
   return neighbors;
}
function getUnvisitedNeighbors(node, graph){
	const neighbors = [];
   const {col, row} = node;
   if (row > 0) neighbors.push(graph[row - 1][col]);
   if (row < graph.length - 1) neighbors.push(graph[row + 1][col]);
   if (col > 0) neighbors.push(graph[row][col - 1]);
   if (col < graph[0].length - 1) neighbors.push(graph[row][col + 1]);
   return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getShortestPath(finishNode) {
  const path = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = currentNode.previous;
  }
  return path;
}