/***
 * @creater:ACBash
 * @create_time:22-4-20 14:35:51
 * @last_modify:ACBash
 * @modify_time:22-4-20 16:55:32
 * @line_count:30
 **/

import graph from "../Topology/demo.js";

let visited = new Set();

let s = "目前物理网络中所有链路上的PHYs使用情况:\n";

for(const vertice of graph.vertices){
    const neighbors = graph.adjList.get(vertice);
    
    for(const [neighbor, val] of neighbors){
        if(visited.has(`${vertice}, ${neighbor}`) || visited.has(`${neighbor}, ${vertice}`)){
            continue;
        }

        s += `${vertice}--${neighbor}:\n`;
        s += `PHY0: ${val.PHYs[0]}\n`;
        s += `PHY1: ${val.PHYs[1]}\n`;
        s += `PHY2: ${val.PHYs[2]}\n`;
        s += `PHY3: ${val.PHYs[3]}\n`;

        visited.add(`${vertice}, ${neighbor}`);
        visited.add(`${neighbor}, ${vertice}`);
    }
}

/* console.log(s); */

export default function peekGroup(){
    console.log(s)
};