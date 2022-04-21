/***
 * @creater:ACBash
 * @create_time:22-4-21 11:30:23
 * @last_modify:ACBash
 * @modify_time:22-4-21 16:16:5
 * @line_count:40
 **/

/* import { flow0 } from "../models/Virtual-Network/Flows/Flows.js"; */
/* import graph from "../models/Physical-Network/Topology/demo.js";

let nodeM = "A", nodeN = "B"; */

/* let Calendar = graph.adjList.get(nodeM).get(nodeN).PHYs; */

export default function orderAllocate(flow, graph, nodeM, nodeN){
    let Calendar = graph.adjList.get(nodeM).get(nodeN).PHYs;
    let Bf = flow.bandwidth;
    let allocate = new Map();
    allocate.set("PHY0", []);
    allocate.set("PHY1", []);
    allocate.set("PHY2", []);
    allocate.set("PHY3", []);
    
    for(let i = 0; i < Calendar.length; i++){
        for(let j = 0; j < Calendar[0].length; j++){
            if(Calendar[i][j] != 5){
                const idleCapacity = 5 - Calendar[i][j];
                
                if(Bf <= idleCapacity){
                    Calendar[i][j] += Bf;
                    allocate.get(`PHY${i}`).push(`${j}`);
                    flow.allocate[`${nodeM} -- ${nodeN}`] = allocate;
                    return 0;
                }

                Bf -= idleCapacity;
                Calendar[i][j] = 5;

                allocate.get(`PHY${i}`).push(`${j}`);
            }
        }
    }

    return 1;
};

/* orderAllocate(flow0, Calendar, nodeM, nodeN); */