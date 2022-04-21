/***
 * @creater:ACBash
 * @create_time:22-4-20 14:37:10
 * @last_modify:ACBash
 * @modify_time:22-4-20 16:27:56
 * @line_count:47
 **/

export default class Graph{
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