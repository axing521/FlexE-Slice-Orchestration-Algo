/***
 * @creater:ACBash
 * @create_time:22-4-21 11:30:23
 * @last_modify:ACBash
 * @modify_time:22-4-21 12:0:58
 * @line_count:26
 **/

export default function orderAllocate(flow, Calendar, nodeM, nodeN){
    let Bf = flow.bandwidth;
    let allocate = new Map();
    
    for(let i = 0; i < Calendar.length; i++){
        for(let j = 0; j < Calendar[0].length; i++){
            if(Calendar[i][j] != 5){
                const idleCapacity = 5 - Calendar[i][j];
                
                if(Bf <= idleCapacity){
                    Calendar[i][j] += Bf;
                    allocate.set(`PHY${i}`, (allocate.get(`PHY${i}`) || []).push(`${j}`))
                    flow.allocate.set(`${nodeM} -- ${nodeN}`, allocate);
                    return 0;
                }

                Bf -= idleCapacity;
                Calendar[i][j] = 5;

                allocate.set(`PHY${i}`, (allocate.get(`PHY${i}`) || []).push(`${j}`));
            }
        }
    }

    return 1;
};