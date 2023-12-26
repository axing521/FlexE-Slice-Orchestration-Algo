// 算法参数
const [_delta, _T] = [0.1, 0.2];

// current_state记录全局物理网络状态以及业务流信息
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

// reconfig_action
function _reconfig_action(signal = 1, current_slot_index, target_slot_index, f) {
    switch (signal) {
        case 1: {
            // 不合并业务流到一个时隙，只移动slot_index，并标记这个时隙为目前业务流的颗粒特征（普通Normal / 小颗粒FGU）（小颗粒FGU会导致时隙存在0.2G的帧开销）
            f.f_allocate[current_slot_index] = false;
            f.f_allocate[target_slot_index] = true;
            break;
        }
        case 2: {
            // 合并业务流到一个时隙，移动slot_index并合并时隙
            f.f_allocate[current_slot_index] = false;
            f.f_allocate[target_slot_index] = true;
            break;
        }
        case 3: {
            // 合并业务流到一个时隙，移动slot_index并合并时隙，并标记这个时隙为小颗粒FGU（小颗粒FGU会导致时隙存在0.2G的帧开销）
            f.f_allocate[current_slot_index] = false;
            f.f_allocate[target_slot_index] = true;
            break;
        }
    }
}

function select_neighbor(current_state, delta, T) {
    // choose a random traffic flow random_f from current_state
    let randomG = current_state[Math.floor(Math.random() * current_state.length)];
    let randomF = randomG.F;
    let random_f = randomF[Math.floor(Math.random() * randomF.length)];
    // all_neighbors = Generate all feasible neighbor states by applying three diffrent actions on traffic flow F
    let all_neighbors = [];
    all_neighbors = generate_neighbors(random_f, current_state, randomG.group_id);
    let all_real_neighbors = [];
    let actionMap = new Map();
    for (const tuple of all_neighbors) {
        all_real_neighbors.push(tuple[0]);
        actionMap.set(tuple[0], tuple[1]);
    }
    // exclude neighbor states from all_neighbors that uses more than delta% additional slots compared to current_state
    let trimmed_neighbors = exclude_neighbors(all_real_neighbors, current_state, delta);
    // sort the neighbors in trimmed_neighbors in increasing order of their RMSF
    let sorted_neighbors = sort_neighbors(trimmed_neighbors);
    // select the first T% neighbors from sorted_neighbors
    let neighbors_pool = sorted_neighbors.slice(0, Math.floor(sorted_neighbors.length * T) + 1);
    // calulate the maximum value of RMSF among the neighbors in neighbors_pool
    let max_RMSF = calculate_max_RMSF(neighbors_pool);
    let gain = new Map();

    for (const neighbor of neighbors_pool) {
        gain.set(neighbor, (calculate_RMSF(neighbor) - max_RMSF) ** 2);
    }

    // <neighbor, action_spec> = a neighbor from neighbors_pool with a probability proportional to gain[neighbor] and corresponding action_spec
    const neighbor = select_neighbor_by_gain(neighbors_pool, gain);
    return [neighbor, actionMap.get(neighbor)];
}

function sa_re_optimize(C, itMax, itTemp, T0, rho, delta, tao) {
    let iterations = new Map([[T0, []]]);
    let T = T0;
    let action_sequence = [];
    let best_sequence = [];
    let best_state = C;
    let current_state = C;

    while (iterations.size <= itMax) {
        while (iterations[T].length < itTemp) {
            let current_cost = calculate_RMSF(current_state);
            let best_cost = calculate_RMSF(best_state);
            let [new_state, action_spec] = select_neighbor(current_state, _delta, tao);
            let new_cost = calculate_RMSF(new_state);
            let delta_cost = current_cost - new_cost;
            let p = Math.random();

            if (delta_cost > 0 || p < Math.exp(delta_cost / T)) {
                current_state = new_state;
                current_cost = new_cost;
                action_sequence.push(action_spec);
            }
            if (current_cost < best_cost) {
                best_state = current_state;
                best_cost = current_cost;
                best_sequence = action_sequence;
            }

            iterations[T].push([current_state, current_cost, action_sequence]);
        }

        T = rho * T;
        iterations.set(T, []);
    }

    return [best_state, best_sequence];
}

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

function exclude_neighbors(neighbors, current_state, delta) {
    let ans = [];

    function calculate_slotsUsage(state) {
        let slotsUsage = 0;
        for (const group of state) {
            for (const phy of group.Calendar) {
                for (const slot of phy) {
                    if (slot[0] != 0) {
                        slotsUsage++;
                    }
                }
            }
        }
    }

    const current_slotsUsage = calculate_slotsUsage(current_state);

    for (const neighbor of neighbors) {
        const neighbor_slotsUsage = calculate_slotsUsage(neighbor);
        if (neighbor_slotsUsage <= (1 + delta) * current_slotsUsage) {
            ans.push(neighbor);
        }
    }

    return ans;
}

function sort_neighbors(trimmed) {
    trimmed.sort((a, b) => {
        return calculate_RMSF(a) - calculate_RMSF(b);
    });
    return trimmed;
}

function calculate_max_RMSF(pool) {
    const lastone = pool[pool.length - 1];
    return calculate_RMSF(lastone);
}

function calculate_RMSF(state) {
    const s_mod = 80;
    const E_p = 68;
    let s_max = 0;
    let F_RMSF_net = 0;

    for (const group of state) {
        const { group_id, Calendar, Se_max, F } = group;
        let F_RMSF_e = 0;
        let F_g_mod = 0;
        let Bf_Sum = 0;

        // 用的是Calendar计算F_g_mod而不是F，能够说明小颗粒会增加RMSF
        for (let PHY of Calendar) {
            for (let slot = 0; slot < PHY.length; slot++) {
                F_g_mod += PHY[slot][0];
            }
        }

        for (let f of F) {
            Bf_Sum += f.f_bandwidth ** 2;
        }
        Bf_Sum = Math.sqrt(Bf_Sum);

        F_RMSF_e = (Se_max * F_g_mod) / Bf_Sum;

        F_RMSF_net += F_RMSF_e;

        s_max = Math.max(s_max, Se_max);
    }

    F_RMSF_net = (F_RMSF_net * s_max) / (E_p * s_mod);

    return F_RMSF_net;
}

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

console.log(sa_re_optimize(_current_state, 1, 2, 100, 0.2, _delta, _T));
