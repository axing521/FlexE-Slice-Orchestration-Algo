/***
 * @creater:ACBash
 * @create_time:22-4-21 22:6:0
 * @last_modify:ACBash
 * @modify_time:22-4-21 22:6:0
 * @line_count:136
 **/

function minPathFn(flow, graph){
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

    /* console.log(minPaths); */

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
}

let flow = {
    bandwidth: 25,
    delay: 20,
    startNode : "A",
    endNode: "D",
    allocate: {}
}

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

const graph = new Graph();
const myVertices = ["A","B","C","D","E","F"];

for(let i=0; i < myVertices.length; i++){
    graph.addVertex(myVertices[i]);
}

/* 权重单位为ms */
graph.addEdge("A","B", 12);
graph.addEdge("A","C", 8);
graph.addEdge("B","C", 3);
graph.addEdge("B","D", 3);
graph.addEdge("B","E", 5);
graph.addEdge("C","D", 15);
graph.addEdge("C","E", 3);
graph.addEdge("D","E", 5);
graph.addEdge("D","F", 2);
graph.addEdge("E","F", 3);

/* console.log(graph); */
console.log(minPathFn(flow, graph));