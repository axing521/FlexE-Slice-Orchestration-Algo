/***
 * @creater:ACBash
 * @create_time:22-4-20 19:55:22
 * @last_modify:ACBash
 * @modify_time:22-4-21 15:11:48
 * @line_count:29
 **/

/* 基于BFS的最短路径查找，返回字符串形式最短路径和路径时延 */
import BFS from "./BFS.js";

export default function minPathFn(flow, graph){
    const startNode = flow.startNode;   //“A”
    const endNode = flow.endNode;       //“D”
    const shortestPathS = BFS(graph, startNode);    //{delay, pred}
    const fromVertex = startNode;
    const toVertex = endNode;
    const path = [];

    for(let v = toVertex; v != fromVertex; v = shortestPathS.predecessors[v]){
        path.push(v);
    }   //路径不可达?

    path.push(fromVertex);

    let s = path.pop();
    while(path.length){
        s += " -- " + path.pop();
    }

    let delay = shortestPathS.delay[endNode];

    return {
        "path": s,
        "delay": delay
    };
}