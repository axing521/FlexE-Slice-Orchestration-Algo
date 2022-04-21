/***
 * @creater:ACBash
 * @create_time:22-4-20 19:37:45
 * @last_modify:ACBash
 * @modify_time:22-4-21 11:29:26
 * @line_count:6
 **/

import { slices } from "./models/Virtual-Network/Slices/Slices.js";   //输入
import orchestration from "./src/orchestration.js";
import peekGroup from "./models/Physical-Network/Resource/Group.js";

orchestration(slices); //编排，返回切片是否编排成功，切片中流的传输路由，占用端口时隙情况。
peekGroup(); //更新目前物理网络资源使用情况