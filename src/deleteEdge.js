/***
 * @creater:ACBash
 * @create_time:22-4-21 11:31:33
 * @last_modify:ACBash
 * @modify_time:22-4-21 12:11:42
 * @line_count:9
 **/

export default function deleteEdge(graph, nodeM, nodeN){
    const MAdjList = graph.adjList.get(nodeM);
    const NAdjList = graph.adjList.get(nodeN);

    MAdjList.get(nodeN).delay = Infinity;
    NAdjList.get(nodeM).delay = Infinity;

    return 2;
};