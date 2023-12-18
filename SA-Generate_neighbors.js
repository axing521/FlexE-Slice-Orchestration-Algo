const _current_state = [
    {
        group_id: "7-51",
        Calendar: [
            [
                [4.9, false],
                [0.21, true],
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
        Se_max: 2,
        F: [
            {
                f_id: "f1",
                f_bandwidth: 4,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [0],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
            {
                f_id: "f2",
                f_bandwidth: 0.5,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [0],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
            {
                f_id: "f3",
                f_bandwidth: 0.4,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [0],
                        PHY1: [],
                        PHY2: [],
                        PHY3: [],
                    },
                },
            },
            {
                f_id: "f4",
                f_bandwidth: 0.01,
                f_delay: 33,
                f_startNode: "7",
                f_endNode: "51",
                f_allocate: {
                    "7-51": {
                        PHY0: [1],
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
    f_id: "f1",
    f_bandwidth: 4,
    f_delay: 33,
    f_startNode: "7",
    f_endNode: "51",
    f_allocate: {
        "7-51": {
            PHY0: [0],
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
                                slotIDX.push(f_allocate[key][phy][i] + parseInt(phy[3]) * 20);
                            }
                        }
                    }

                    const [slotStart, slotEnd] = slotIDX;

                    for (const val of neighbor) {
                        let flag1 = false;
                        if (val.group_id === gId) {
                            for (let phy = 0; phy < val.Calendar.length; phy++) {
                                let flag2 = false;
                                for (let slot = 0; slot < val.Calendar[phy].length; slot++) {
                                    if (slot + phy * 20 > slotStart) {
                                        flag2 = true;
                                        break;
                                    }
                                    if (val.Calendar[phy][slot][1] == true) {
                                        let spare = 5 - val.Calendar[phy][slot][0];
                                        if (spare >= f_bandwidth) {
                                            val.Calendar[phy][slot][0] += f_bandwidth;
                                            // 清空原有的时隙占用
                                        }
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

            let f_neighbor = {
                f_id: f_id_neighbor,
                f_bandwidth: f_bandwidth_neighbor,
                f_delay: f_delay_neighbor,
                f_startNode: f_startNode_neighbor,
                f_endNode: f_endNode_neighbor,
                f_allocate: f_allocate_neighbor,
            };

            neighbor[0].F.push(f_neighbor);
            neighbors.push(neighbor);
        } else if (action === "mergeNormal") {
            if (f_bandwidth === 0.01) continue;
            let neighbor = JSON.parse(JSON.stringify(state));
        } else if (action === "moveSlotIDXOnly") {
            let neighbor = JSON.parse(JSON.stringify(state));
        }
    }
    return neighbors;
}
