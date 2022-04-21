/***
 * @creater:ACBash
 * @create_time:22-4-20 19:50:50
 * @last_modify:ACBash
 * @modify_time:22-4-21 12:4:45
 * @line_count:46
 **/

import minPathFn from "./minPathFn.js";
import orderAllocate from "./orderAllocate.js";
import deleteEdge from "./deleteEdge.js";

export default function allocateFlow(flow, graph){
    const minPath = minPathFn(flow, graph);
    const minPath_delay = minPath.delay;
    const flow_delay = flow.delay;

    if(minPath_delay > flow_delay){
        console.log(`${slice} 映射失败`);
        return false;
    }

    const pathNodes = minPath.path.split(" -- ");   //path存在问题

    for(let i = 1; i < pathNodes.length; i++){
        const nodeM = pathNodes[i - 1];
        const nodeN = pathNodes[i];

        const edgeMN = graph.adjList.get(nodeM).get(nodeN);

        let beforeCapacity = 0;

        let Calendar = edgeMN.PHYs;

        for(let i = 0; i < Calendar.length; i++){
            for(let j = 0; j < Calendar[0].length; j++){
                beforeCapacity += Calendar[i][j];
            }
        }

        const Bf = flow.bandwidth;

        let afterCapacity = beforeCapacity + Bf;

        if(afterCapacity > 400){
            deleteEdge(graph, nodeM, nodeN);
            return allocateFlow(flow, graph);
        }

        orderAllocate(flow, Calendar, nodeM, nodeN);
    }

    flow.path = minPath.path;
};