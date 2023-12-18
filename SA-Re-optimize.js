function sa_re_optimize(C, itMax, itTemp, T0, rho) {
    let iterations = new Map([["T0", []]]);
    let T = T0;
    let action_sequence = [];
    let best_state = C;
    let current_state = C;

    while (iterations.size < itMax) {
        while (iterations[T].length) {
            let current_cost = calculate_RMSF(current_state);
            
        }
    }
}

function calculate_RMSF() {}
