/* let iterations = new Map([["T0", []]]);

console.log(iterations.size);

let a = {
    1: 2,
    2: 3,
};

for (const key in a) {
    console.log(a[key]);
}

let b = new Map();
b.set("T0", 1);
b.set("T1", 2);

for (const [key, value] of b) {
    console.log(key, value);
}

function mapToObj(map) {
    let obj = {};
    for (let [key, value] of map) {
        obj[key] = value;
    }
    return obj;
}

console.log(JSON.stringify(mapToObj(b)));

let z = "2";
console.log(parseInt(z) + 1);

let y = [1, 2];
for (const val of y) {
    console.log(val);
}

let c = ["cjr"];
const [nickname, id] = c;
console.log(nickname, id);

const bigone = {
    hello: {
        phy0: [1, 2, 3],
        phy1: [4, 5, 6],
    },
};

bigone.hello = {
    phy0: [],
    phy1: [],
};

console.log(bigone);

let arr = [
    { id: 1, name: "cjr", like: [[0, 1]] },
    { id: 2, name: "cjr2", like: [[1, 3]] },
];
for (const val of arr) {
    val.id += 1;
    val.name = "cjr3";
    val.like.push([2, 3]);
}

console.log(arr);

let arr1 = [[{ id: 1, priority: 0.3 }], [{ id: 2, priority: 0.6 }]];
let map1 = new Map();
for (const neighbor of arr1) {
    map1.set(neighbor, neighbor[0].name);
}

console.log(map1);

for (const val of arr1) {
    console.log(map1.get(val));
}
 */

function select_neighbor_by_gain(pool, gain) {
    // 计算总的权重
    let totalWeight = 0;
    for (let neighbor of pool) {
        totalWeight += gain.get(neighbor);
    }

    // 生成随机数，范围是 [0, totalWeight)
    const random = Math.random() * totalWeight;

    // 根据随机数选择一个neighbor
    let cumulativeWeight = 0;
    for (let neighbor of pool) {
        cumulativeWeight += gain.get(neighbor);
        if (random < cumulativeWeight) {
            return neighbor; // 返回选择的neighbor
        }
    }

    // 如果没有成功选择neighbor，则返回 null 或者抛出异常
    return null;
}

const pool = ["neighbor1", "neighbor2", "neighbor3"];
const gain = new Map();
gain.set("neighbor1", 0.3);
gain.set("neighbor2", 0.6);
gain.set("neighbor3", 0.1);

const selectedNeighbor = select_neighbor_by_gain(pool, gain);
console.log(selectedNeighbor);