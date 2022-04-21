/***
 * @creater:ACBash
 * @create_time:22-4-20 14:23:6
 * @last_modify:ACBash
 * @modify_time:22-4-20 19:23:46
 * @line_count:10
 **/

/* all业务流用例 */
/* 带宽单位为Gbps，时延单位为ms */
/* 手动输入，注意参考Physical-Network下的Topology */

export const flow0 = {
    bandwidth: 25,
    delay: 20,
    startNode : "A",
    endNode: "D"
}