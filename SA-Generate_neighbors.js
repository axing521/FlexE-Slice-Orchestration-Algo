const _current_state = [
    {
        group_id: "7-51",
        Calendar: [
            [
                [5, false],
                [2.21, true],
                [2, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
            ],
            [
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
            ],
            [
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
            ],
            [
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
                [0, false],
            ],
        ],
        Se_max: 3,
        F: [
            {
                f_id: "f1",
                f_bandwidth: 4,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [[0, 4]],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
            {
                f_id: "f2",
                f_bandwidth: 3,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [
                            [0, 1],
                            [1, 2],
                        ],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
            {
                f_id: "f3",
                f_bandwidth: 0.01,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [[1, 0.01]],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
            {
                f_id: "f4",
                f_bandwidth: 2,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [[2, 2]],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
        ],
    },
];

let random_f = {
    f_id: "f4",
    f_bandwidth: 2,
    f_delay: 33,
    f_startNode: "7",
    f_endNode: "51",
    f_allocate: {
        "7-51": {
            PHY0: [[2, 2]],
            PHY1: [],
            PHY2: [],
            PHY3: [],
        },
    },
};

let random_gId = "7-51";

function generate_neighbors(f, state, gId) {
    const reconfig_actions = [
        { action: "mergeFGU" },
        { action: "mergeNormal" },
        { action: "moveSlotIDXOnly" },
    ];
    const { f_id, f_startNode, f_endNode, f_bandwidth, f_delay, f_allocate } = f;
    let neighbors = [];

    for (let i = 0; i < reconfig_actions.length; i++) {
        let action = reconfig_actions[i].action;

        if (action === "mergeFGU") {
            let neighbor = JSON.parse(JSON.stringify(state));

            for (const key in f_allocate) {
                let flag0 = false;
                if (key === gId) {
                    let slotIDX = [];
                    for (const phy in f_allocate[key]) {
                        if (f_allocate[key][phy].length > 0) {
                            for (let j = 0; j < f_allocate[key][phy].length; j++) {
                                slotIDX.push([
                                    f_allocate[key][phy][j][0] + parseInt(phy[3]) * 20,
                                    f_allocate[key][phy][j][1],
                                ]);
                            }
                        }
                    }

                    const [slotStart, slotEnd] = slotIDX;
                    const [slotStartIDX, slotStartCapacity] = slotStart;
                    let slotEndIDX, slotEndCapacity;
                    if (slotEnd) {
                        [slotEndIDX, slotEndCapacity] = slotEnd;
                    }

                    for (const val of neighbor) {
                        let flag1 = false;
                        if (val.group_id === gId) {
                            for (let phy = 0; phy < val.Calendar.length; phy++) {
                                let flag2 = false;
                                for (let slot = 0; slot < val.Calendar[phy].length; slot++) {
                                    if (slot + phy * 20 > slotStartIDX) {
                                        flag2 = true;
                                        break;
                                    }
                                    if (val.Calendar[phy][slot][1] == true) {
                                        f_allocate[key] = {
                                            PHY0: [],
                                            PHY1: [],
                                            PHY2: [],
                                            PHY3: [],
                                        };
                                        let spare = 5 - val.Calendar[phy][slot][0];
                                        if (spare >= f_bandwidth) {
                                            // Merge FGU
                                            val.Calendar[phy][slot][0] += f_bandwidth;
                                            f_allocate[key][`PHY${phy}`].push([slot, f_bandwidth]);
                                        } else {
                                            val.Calendar[phy][slot][0] = 5;
                                            val.Calendar[phy][slot + 1][0] += f_bandwidth - spare;
                                            f_allocate[key][`PHY${phy}`].push([slot, spare]);
                                            if (slotEnd)
                                                f_allocate[key][`PHY${phy}`].push([
                                                    slot + 1,
                                                    f_bandwidth - spare,
                                                ]);
                                        }
                                        const oldSlotIDXStart = slotStartIDX % 20;
                                        const oldStartPHY = Math.floor(slotStartIDX / 20);
                                        val.Calendar[oldStartPHY][oldSlotIDXStart][0] -=
                                            slotStartCapacity;
                                        if (slotEnd) {
                                            const oldSlotIDXEnd = slotEndIDX % 20;
                                            const oldEndPHY = Math.floor(slotEndIDX / 20);
                                            val.Calendar[oldEndPHY][oldSlotIDXEnd][0] -=
                                                slotEndCapacity;
                                        }

                                        val.F.forEach((f) => {
                                            if (f.f_id === f_id) {
                                                f.f_allocate = f_allocate;
                                            }
                                        });
                                        flag2 = true;
                                        break;
                                    }
                                }
                                if (flag2 == true) {
                                    flag1 = true;
                                    break;
                                }
                            }
                        }
                        if (flag1 == true) {
                            flag0 = true;
                            break;
                        }
                    }
                }
                if (flag0 == true) break;
            }
            let newSemax = 0;
            for (const val of neighbor) {
                if (val.group_id === gId) {
                    for (let i = 0; i < val.Calendar.length; i++) {
                        for (let j = 0; j < val.Calendar[i].length; j++) {
                            if (val.Calendar[i][j][0] != 0) {
                                newSemax = i * 20 + j + 1;
                            }
                        }
                    }
                    val.Se_max = newSemax;
                }
            }
            neighbors.push(neighbor, "mergeFGU");
        } else if (action === "mergeNormal") {
            if (f_bandwidth === 0.01) continue;
            let neighbor = JSON.parse(JSON.stringify(state));

            for (const key in f_allocate) {
                let flag0 = false;
                if (key === gId) {
                    let slotIDX = [];
                    for (const phy in f_allocate[key]) {
                        if (f_allocate[key][phy].length > 0) {
                            for (let j = 0; j < f_allocate[key][phy].length; j++) {
                                slotIDX.push([
                                    f_allocate[key][phy][j][0] + parseInt(phy[3]) * 20,
                                    f_allocate[key][phy][j][1],
                                ]);
                            }
                        }
                    }

                    const [slotStart, slotEnd] = slotIDX;
                    const [slotStartIDX, slotStartCapacity] = slotStart;
                    let slotEndIDX, slotEndCapacity;
                    if (slotEnd) {
                        [slotEndIDX, slotEndCapacity] = slotEnd;
                    }

                    for (const val of neighbor) {
                        let flag1 = false;
                        if (val.group_id === gId) {
                            for (let phy = 0; phy < val.Calendar.length; phy++) {
                                let flag2 = false;
                                for (let slot = 0; slot < val.Calendar[phy].length; slot++) {
                                    if (slot + phy * 20 > slotStartIDX) {
                                        flag2 = true;
                                        break;
                                    }
                                    if (val.Calendar[phy][slot][1] == false) {
                                        f_allocate[key] = {
                                            PHY0: [],
                                            PHY1: [],
                                            PHY2: [],
                                            PHY3: [],
                                        };
                                        let spare = 5 - val.Calendar[phy][slot][0];
                                        if (spare >= f_bandwidth) {
                                            val.Calendar[phy][slot][0] += f_bandwidth;
                                            f_allocate[key][`PHY${phy}`].push([slot, f_bandwidth]);
                                        } else {
                                            val.Calendar[phy][slot][0] = 5;
                                            val.Calendar[phy][slot + 1][0] += f_bandwidth - spare;
                                            f_allocate[key][`PHY${phy}`].push([slot, spare]);
                                            if (slotEnd)
                                                f_allocate[key][`PHY${phy}`].push([
                                                    slot + 1,
                                                    f_bandwidth - spare,
                                                ]);
                                        }
                                        const oldSlotIDXStart = slotStartIDX % 20;
                                        const oldStartPHY = Math.floor(slotStartIDX / 20);
                                        val.Calendar[oldStartPHY][oldSlotIDXStart][0] -=
                                            slotStartCapacity;
                                        if (slotEnd) {
                                            const oldSlotIDXEnd = slotEndIDX % 20;
                                            const oldEndPHY = Math.floor(slotEndIDX / 20);
                                            val.Calendar[oldEndPHY][oldSlotIDXEnd][0] -=
                                                slotEndCapacity;
                                        }
                                        // 存在清楚原有时隙占用后以及最后的FGU开销
                                        val.F.forEach((f) => {
                                            if (f.f_id === f_id) {
                                                f.f_allocate = f_allocate;
                                            }
                                        });
                                        flag2 = true;
                                        break;
                                    }
                                }
                                if (flag2 == true) {
                                    flag1 = true;
                                    break;
                                }
                            }
                        }
                        if (flag1 == true) {
                            flag0 = true;
                            break;
                        }
                    }
                }
                if (flag0 == true) break;
            }
            let newSemax = 0;
            for (const val of neighbor) {
                if (val.group_id === gId) {
                    for (let i = 0; i < val.Calendar.length; i++) {
                        for (let j = 0; j < val.Calendar[i].length; j++) {
                            if (val.Calendar[i][j][0] != 0) {
                                newSemax = i * 20 + j + 1;
                            }
                        }
                    }
                    val.Se_max = newSemax;
                }
            }
            neighbors.push(neighbor, "mergeNormal");
        } else if (action === "moveSlotIDXOnly") {
            let neighbor = JSON.parse(JSON.stringify(state));

            for (const key in f_allocate) {
                let flag0 = false;
                if (key === gId) {
                    let slotIDX = [];
                    for (const phy in f_allocate[key]) {
                        if (f_allocate[key][phy].length > 0) {
                            for (let j = 0; j < f_allocate[key][phy].length; j++) {
                                slotIDX.push([
                                    f_allocate[key][phy][j][0] + parseInt(phy[3]) * 20,
                                    f_allocate[key][phy][j][1],
                                ]);
                            }
                        }
                    }

                    const [slotStart, slotEnd] = slotIDX;
                    const [slotStartIDX, slotStartCapacity] = slotStart;
                    let slotEndIDX, slotEndCapacity;
                    if (slotEnd) {
                        [slotEndIDX, slotEndCapacity] = slotEnd;
                    }

                    for (const val of neighbor) {
                        let flag1 = false;
                        if (val.group_id === gId) {
                            for (let phy = 0; phy < val.Calendar.length; phy++) {
                                let flag2 = false;
                                for (let slot = 0; slot < val.Calendar[phy].length; slot++) {
                                    if (slot + phy * 20 > slotStartIDX) {
                                        flag2 = true;
                                        break;
                                    }
                                    if (val.Calendar[phy][slot][0] == 0) {
                                        f_allocate[key] = {
                                            PHY0: [],
                                            PHY1: [],
                                            PHY2: [],
                                            PHY3: [],
                                        };
                                        let spare = 5 - val.Calendar[phy][slot][0];
                                        if (spare >= f_bandwidth) {
                                            // Merge FGU
                                            val.Calendar[phy][slot][0] += f_bandwidth;
                                            f_allocate[key][`PHY${phy}`].push([slot, f_bandwidth]);
                                        } else {
                                            val.Calendar[phy][slot][0] = 5;
                                            val.Calendar[phy][slot + 1][0] += f_bandwidth - spare;
                                            f_allocate[key][`PHY${phy}`].push([slot, spare]);
                                            if (slotEnd)
                                                f_allocate[key][`PHY${phy}`].push([
                                                    slot + 1,
                                                    f_bandwidth - spare,
                                                ]);
                                        }
                                        const oldSlotIDXStart = slotStartIDX % 20;
                                        const oldStartPHY = Math.floor(slotStartIDX / 20);
                                        val.Calendar[oldStartPHY][oldSlotIDXStart][0] -=
                                            slotStartCapacity;
                                        if (slotEnd) {
                                            const oldSlotIDXEnd = slotEndIDX % 20;
                                            const oldEndPHY = Math.floor(slotEndIDX / 20);
                                            val.Calendar[oldEndPHY][oldSlotIDXEnd][0] -=
                                                slotEndCapacity;
                                        }

                                        val.F.forEach((f) => {
                                            if (f.f_id === f_id) {
                                                f.f_allocate = f_allocate;
                                            }
                                        });
                                        flag2 = true;
                                        break;
                                    }
                                }
                                if (flag2 == true) {
                                    flag1 = true;
                                    break;
                                }
                            }
                        }
                        if (flag1 == true) {
                            flag0 = true;
                            break;
                        }
                    }
                }
                if (flag0 == true) break;
            }

            let newSemax = 0;
            for (const val of neighbor) {
                if (val.group_id === gId) {
                    for (let i = 0; i < val.Calendar.length; i++) {
                        for (let j = 0; j < val.Calendar[i].length; j++) {
                            if (val.Calendar[i][j][0] != 0) {
                                newSemax = i * 20 + j + 1;
                            }
                        }
                    }
                    val.Se_max = newSemax;
                }
            }
            neighbors.push([neighbor, "moveSlotIDXOnly"]);
        }
    }
    return neighbors;
}

const neighbors = generate_neighbors(random_f, _current_state, random_gId);
for (const [neighbor, action] of neighbors) {
    for (const g of neighbor) {
        console.log(g.group_id);
        console.log(g.Calendar);
        console.log(g.F);
    }
}
