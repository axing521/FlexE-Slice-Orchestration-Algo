/***
 * @creater:ACBash
 * @create_time:22-4-20 12:28:34
 * @last_modify:ACBash
 * @modify_time:22-4-20 13:19:26
 * @line_count:48
 **/

const slices = [];
const minPathFn = (flow) => {};/* return R */
const minPath_delayFn = (minPath) => {};/* return Delay */
const judge_idlePHY = (m, n) => {}/* Bool */
const addPHY = (group) => {}; /* return PHY */
const allocateFlow = (flow, graph) => {};
const deleteEdge = (graph, m, n) => {};
const orderAllocate = (flow, group) => {};

const orchestration = (slices) => {
    for(const slice of slices){
        for(const flow of slice){
            const minPath = minPathFn(flow);
            const minPath_delay = minPath_delayFn(minPath);
            const flow_delay = flow.delay;
    
            if(minPath_delay > flow_delay){
                console.log(`${slice} 映射失败`);
                break;
            }
    
            for(const group of minPath){
                const Cg = group.idleCapacity;
                const Bf = flow.Bandwidth;
                const {nodeM, nodeN} = group.endPoints;
    
                while(Cg < Bf){
                    if(judge_idlePHY(nodeM, nodeN)){
                        const newPHY = addPHY(group);
                        const Cphy = newPHY.capacity;
                        
                        Cg += Cphy;
                    }else{
                        deleteEdge(graph, nodeM, nodeN);
                        allocateFlow(flow, graph);
                    }
                }
    
                orderAllocate(flow, group);
            }
        }
    
        console.log(`${slice} 映射成功`);
    }
    
    return "切片映射拓扑和链路组占用";
};
