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
