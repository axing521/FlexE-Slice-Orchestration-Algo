/***
 * @creater:ACBash
 * @create_time:22-4-20 19:36:7
 * @last_modify:ACBash
 * @modify_time:22-4-21 11:26:5
 * @line_count:13
 **/

import allocateFlow from "./allocateFlow.js";

export default function orchestration(slices){
    for(const slice of slices){
        for(const flow of slice){
            allocateFlow(flow, graph);
        }
    
        console.log(`${slice} 映射成功`);
    }
    
    return "切片映射拓扑和链路组占用";
};