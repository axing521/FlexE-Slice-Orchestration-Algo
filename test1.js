let iterations = new Map([["T0", []]]);

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
