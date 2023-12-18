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

console.log(calculate_RMSF(_current_state));
