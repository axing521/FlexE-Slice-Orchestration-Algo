/***
 * @creater:ACBash
 * @create_time:22-4-20 19:36:7
 * @last_modify:ACBash
 * @modify_time:22-4-21 15:33:58
 * @line_count:19
 **/

import allocateFlow from "./allocateFlow.js";
import graph from "../models/Physical-Network/Topology/demo.js";

export default function orchestration(slices){
    for(const slice of slices){
        for(const flow of slice){
            allocateFlow(flow, graph);
        }
    
        console.log(`${slice} 映射成功`);   //ID?
        
        for(const flow of slice){
            console.log(flow.path);
            console.log(flow.allocate);
        }
    }
    
    return "切片映射拓扑和链路组占用";
};