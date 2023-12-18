// 算法参数
const [_delta, _T] = [0.1, 0.2];

// current_state记录全局物理网络状态以及业务流信息
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
                    '"7"--"51"': {
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
                    '"7"--"51"': {
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
                    '"7"--"51"': {
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
                    '"7"--"51"': {
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
    const Ep_size = current_state.length; // |Ep|

    for (let i = 0; i < Ep_size; i++) {
        let F = current_state[i].F;
        let F_size = F.length;
        let action_spec = {};
        let action = Math.floor(Math.random() * 3);
        let f_id = Math.floor(Math.random() * F_size);
        let f = F[f_id];

        switch (action) {
            case 0:
                action_spec = {
                    action: "add",
                    f_id: f.f_id,
                    f_startNode: f.f_startNode,
                    f_endNode: f.f_endNode,
                    f_bandwidth: f.f_bandwidth,
                    f_delay: f.f_delay,
                };
                break;
            case 1:
                action_spec = {
                    action: "delete",
                    f_id: f.f_id,
                    f_startNode: f.f_startNode,
                    f_endNode: f.f_endNode,
                    f_bandwidth: f.f_bandwidth,
                    f_delay: f.f_delay,
                };
                break;
            case 2:
                action_spec = {
                    action: "change",
                    f_id: f.f_id,
                    f_startNode: f.f_startNode,
                    f_endNode: f.f_endNode,
                    f_bandwidth: f.f_bandwidth,
                    f_delay: f.f_delay,
                };
                break;
        }
    }

    // choose a random traffic flow random_f from current_state
    let randomG = current_state[Math.floor(Math.random() * current_state.length)];
    let randomF = randomG.F;
    let random_f = randomF[Math.floor(Math.random() * randomF.length)];
    // all_neighbors = Generate all feasible neighbor states by applying three diffrent actions on traffic flow F
    let all_neighbors = [];
    all_neighbors = generate_neighbors(random_f, current_state, randomG.group_id);
    // exclude neighbor states from all_neighbors that uses more than delta% additional slots compared to current_state
    let trimmed_neighbors = exclude_neighbors(all_neighbors, delta);
    // sort the neighbors in trimmed_neighbors in increasing order of their RMSF
    let sorted_neighbors = sort_neighbors(trimmed_neighbors);
    // select the first T% neighbors from sorted_neighbors
    let neighbors_pool = sorted_neighbors.slice(0, Math.floor(sorted_neighbors.length * T));
    // calulate the maximum value of RMSF among the neighbors in neighbors_pool
    let max_RMSF = calculate_max_RMSF(neighbors_pool);
    let gain = {};

    for (const neighbor of neighbors_pool) {
        gain[neighbor.id] = (calculate_RMSF(neighbor) - max_RMSF) ** 2;
    }

    // <neighbor, action_spec> = a neighbor from neighbors_pool with a probability proportional to gain[neighbor] and corresponding action_spec
    const [neighbor, action_spec] = select_neighbor_by_gain(neighbors_pool, gain);
    return [neighbor, action_spec];
}

function sa_re_optimize(C, itMax, itTemp, T0, rho) {
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
            let [new_state, action_spec] = select_neighbor(current_state, _delta, _T);
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

function generate_neighbors() {}

function exclude_neighbors() {}

function sort_neighbors() {}

function calculate_max_RMSF() {}

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

function select_neighbor_by_gain() {}
