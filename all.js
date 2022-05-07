/***
 * @creater:ACBash
 * @create_time:22-4-21 16:20:36
 * @last_modify:ACBash
 * @modify_time:22-5-7 15:49:4
 * @line_count:414
 **/

/* 0.utils */
const Colors={
    WHITE:0,
    GREY:1,
    BLACK:2
}
const initializeColor= vertices => {
    const color={};
    for(let i=0;i<vertices.length;i++){
        color[vertices[i]]=Colors.WHITE;
    }
    return color;
}
/* 0.utils */

/* 1.图类 */
class Graph{
    constructor(isDirected = false){  //接收一个参数表示图是否有向，默认无向
        this.isDirected = isDirected;
        this.vertices = [];   //顶点名字目录
        this.adjList = new Map();  //邻接表
    }
    addVertex(u){
        if(!this.vertices.includes(u)){
            this.vertices.push(u);
            this.adjList.set(u, new Map()); 
        }
    }
    addEdge(u, v, w){
        if(!this.adjList.get(u)){
            this.addVertex(u);
        }
        if(!this.adjList.get(v)){
            this.addVertex(v);
        }

        const uAdjList = this.adjList.get(u);
        uAdjList.set(v, {"delay": w, "PHYs": Array.from({length: 4}, () => new Array(20).fill(0))});
        
        if(!this.isDirected){
            const uAdjList = this.adjList.get(v);
            uAdjList.set(u, {"delay": w, "PHYs": Array.from({length: 4}, () => new Array(20).fill(0))});
        }
    }
    getVertices(){
        return this.vertices;
    }
    getAdjList(){
        return this.adjList;
    }
    toString(){
        let s="";
        for(let i=0; i<this.vertices.length; i++){
            s += `${this.vertices[i]} 的邻居节点及时延是 `;
            const neighbors = this.adjList.get(this.vertices[i]);
            for(const [neighbor, val] of neighbors){
                s += `${neighbor}: ${val.delay},  `;
            }
            s+="\n";
        }
        return s;
    }
}
/* 1.图类 */

/* 2.实例化图 */
const graph = new Graph();
const myVertices = ["A","B","C","D","E","F"];

for(let i=0; i < myVertices.length; i++){
    graph.addVertex(myVertices[i]);
}

//权重单位为ms
graph.addEdge("A","B", 12);
graph.addEdge("A","C", 8);
graph.addEdge("B","C", 3);
graph.addEdge("B","D", 3);
graph.addEdge("B","E", 5);
graph.addEdge("C","D", 15);
graph.addEdge("C","E", 8);
graph.addEdge("D","E", 5);
graph.addEdge("D","F", 9);
graph.addEdge("E","F", 8);

/* console.log(graph.toString());
console.log(graph.getAdjList()); */
/* 2.实例化图 */

/* 3.切片输入 */
const flow0 = {
    bandwidth: 25,
    delay: 20,
    startNode : "A",
    endNode: "D",
    allocate: {}
}
const flow1 = {
    bandwidth: 0.02,
    delay: 35,
    startNode : "A",
    endNode: "D",
    allocate: {}
}
const flow2 = {
    bandwidth: 35,
    delay: 26,
    startNode : "B",
    endNode: "F",
    allocate: {}
}
const flow3 = {
    bandwidth: 0.01,
    delay: 29,
    startNode : "B",
    endNode: "C",
    allocate: {}
}
const flow4 = {
    bandwidth: 15,
    delay: 23,
    startNode : "D",
    endNode: "E",
    allocate: {}
}

const slice0 = [flow0, flow1, flow2];
const slice1 = [flow3, flow4];

const slices = [slice0, slice1];

let obj = 0; //目标函数(切片占用物理网络资源的总和)
/* 3.切片输入 */

/* 4.顶层编排 */
function orchestration(slices){
    let count = 0;
    
    for(const slice of slices){
        for(const flow of slice){
            allocateFlow(slice, flow, graph);
        }
    
        console.log(`slice${count++} 映射成功`);   //ID?
        
        for(const flow of slice){
            console.log(flow.path, flow.routeDelay + "ms");
            console.log(flow.allocate);
        }
    }
    
    console.log(`目标函数值：${obj}`);
    return "切片映射拓扑和链路组占用";
};

function allocateFlow(slice, flow, graph){
    const minPath = minPathFn(flow, graph); //{path，delay, hopCount}
    const minPath_delay = minPath.delay;
    const flow_delay = flow.delay;

    if(minPath_delay > flow_delay){
        console.log(`${slice} 映射失败`);
        return false;
    }   //标志信号?

    const pathNodes = minPath.path.split(" -- ");   //path存在问题

    for(let i = 1; i < pathNodes.length; i++){
        const nodeM = pathNodes[i - 1];
        const nodeN = pathNodes[i];

        const edgeMN = graph.adjList.get(nodeM).get(nodeN);

        let beforeCapacity = 0; //原有

        let Calendar = edgeMN.PHYs;

        for(let i = 0; i < Calendar.length; i++){
            for(let j = 0; j < Calendar[0].length; j++){
                beforeCapacity += Calendar[i][j];
            }
        }

        const Bf = flow.bandwidth;

        let afterCapacity = beforeCapacity + Bf;

        if(afterCapacity > 400){
            deleteEdge(graph, nodeM, nodeN);    //流分配完成后恢复图原始拓扑?
            return allocateFlow(slice, flow, graph);
        }

        orderAllocate(flow, graph, nodeM, nodeN);
    }

    obj += minPath.hopCount * flow.bandwidth;
    flow.path = minPath.path;
    flow.routeDelay = minPath_delay;
};
/* 4.顶层编排 */

/* 5.路由策略 */
//最少跳数策略
function minPathFn(flow, graph){
    const startNode = flow.startNode;   //“A”
    const endNode = flow.endNode;       //“D”
    const shortestPathS = BFS(graph, startNode);    //{delay, pred, hopCount}
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
    let hopCount = shortestPathS.hopCount[endNode];

    return {
        "path": s,
        "delay": delay,
        "hopCount": hopCount
    };
}
function BFS(graph, startNode){
    const adjList = graph.adjList;
    const vertices = graph.vertices;
    const color = initializeColor(vertices);
    const queue = [];
    const delay = {};   //v到u的时延delay[u]
    const hopCount = {};
    const predecessors = {};    //前溯点

    queue.push(startNode);

    //初始化delay, predecessors
    for(const vertice of vertices){
        delay[vertice] = 0;
        hopCount[vertice] = 0;
        predecessors[vertice] = null;
    }

    while(queue.length){
        const u = queue.shift();
        const neighbors = adjList.get(u);
        color[u] = Colors.GREY;

        for(const [neighbor, val] of neighbors){
            if(color[neighbor] == Colors.WHITE){
                color[neighbor] = Colors.GREY;
                
                delay[neighbor] = delay[u] + val.delay;
                hopCount[neighbor] = hopCount[u] + 1;
                predecessors[neighbor] = u;

                queue.push(neighbor);
            }
        }

        color[u] = Colors.BLACK;
    }

    return {
        delay,
        predecessors,
        hopCount
    };
}

//最短加权路径策略
/* function minPathFn(flow, graph){
    const vertices = graph.vertices;
    const adjList = graph.adjList;
    const n = vertices.length;
    const startNode = flow.startNode.charCodeAt() - 65;   //“A”
    const endNode = flow.endNode.charCodeAt() - 65;       //“D”

    let minPaths = Array.from({length: n}, () => [Infinity, null]), visited = new Array(n).fill(false);
    minPaths[startNode][0] = 0;
    
    for(let i = 0; i < n; i++){
        let u = -1;

        for(let v = 0; v < n; v++){
            if(!visited[v] && (u == -1 || minPaths[v][0] < minPaths[u][0])){
                u = v;
            }
        }

        visited[u] = true;

        for(let v = 0; v < n; v++){
            const m = String.fromCharCode(u + 65);
            const n = String.fromCharCode(v + 65);
            
            if(adjList.get(m).get(n) && adjList.get(m).get(n).delay >= 0){
                if(minPaths[u][0] + adjList.get(m).get(n).delay < minPaths[v][0]){
                    minPaths[v][0] = minPaths[u][0] + adjList.get(m).get(n).delay;
                    minPaths[v][1] = u;
                }
            }
        }
    }

    //console.log(minPaths);

    let delay = minPaths[endNode][0];

    const fromVertex = startNode;
    const toVertex = endNode;
    const path = [];

    for(let v = toVertex; v != fromVertex; v = minPaths[v][1]){
        path.push(v);
    }   //路径不可达?

    path.push(fromVertex);

    let s = String.fromCharCode(path.pop() + 65);
    while(path.length){
        s += " -- " + String.fromCharCode(path.pop() + 65);
    }

    return {
        "path": s,
        "delay": delay
    };
} */
/* 5.路由策略 */

/* 6.时隙分配 */
function orderAllocate(flow, graph, nodeM, nodeN){
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
/* 6.时隙分配 */

/* 7.图重构 */
function deleteEdge(graph, nodeM, nodeN){
    const MAdjList = graph.adjList.get(nodeM);
    const NAdjList = graph.adjList.get(nodeN);

    MAdjList.get(nodeN).delay = Infinity;
    NAdjList.get(nodeM).delay = Infinity;

    return 2;
};
/* 7.图重构 */

/* 8.状态更新 */
const peekGroup = () => {
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

    console.log(s);
};
/* 8.状态更新 */

orchestration(slices); //编排，返回切片是否编排成功，切片中流的传输路由，占用端口时隙情况。
peekGroup(); //更新目前物理网络资源使用情况