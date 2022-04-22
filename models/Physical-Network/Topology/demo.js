/***
 * @creater:ACBash
 * @create_time:22-4-20 15:3:6
 * @last_modify:ACBash
 * @modify_time:22-4-22 12:49:13
 * @line_count:25
 **/

import Graph from "./Graph.js";

const graph = new Graph();
const myVertices = ["A","B","C","D","E","F"];

for(let i=0; i < myVertices.length; i++){
    graph.addVertex(myVertices[i]);
}

/* 权重单位为ms */
graph.addEdge("A","B", 12);
graph.addEdge("A","C", 8);
graph.addEdge("B","C", 3);
graph.addEdge("B","D", 3);
graph.addEdge("B","E", 5);
graph.addEdge("C","D", 15);
graph.addEdge("C","E", 3);
graph.addEdge("D","E", 5);
graph.addEdge("D","F", 2);
graph.addEdge("E","F", 3);

/* console.log(graph.toString());
console.log(graph.getAdjList()); */

export default graph;