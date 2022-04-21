/***
 * @creater:ACBash
 * @create_time:22-4-20 20:43:29
 * @last_modify:ACBash
 * @modify_time:22-4-21 15:37:33
 * @line_count:42
 **/

import { Colors, initializeColor } from "../lib/util.js";

export default function BFS(graph, startNode){
    const adjList = graph.adjList;
    const vertices = graph.vertices;
    const color = initializeColor(vertices);
    const queue = [];
    const delay = {};   //v到u的时延delay[u]
    const predecessors = {};    //前溯点

    queue.push(startNode);

    //初始化delay, predecessors
    for(const vertice of vertices){
        delay[vertice] = 0;
        predecessors[vertice] = null;
    }

    while(queue.length){
        const u = queue.shift();
        const neighbors = adjList.get(u);
        color[u] = Colors.GREY;

        for(const [neighbor, val] of neighbors){
            if(color[neighbor] == Colors.WHITE){
                color[neighbor] = Colors.GREY;
                
                delay[neighbor] = delay[u] + val.delay;
                predecessors[neighbor] = u;

                queue.push(neighbor);
            }
        }

        color[u] = Colors.BLACK;
    }

    return {
        delay,
        predecessors
    };
}