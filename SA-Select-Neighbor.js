function select_neighbor(current_state, delta, T) {
    // choose a random traffic flow F from current_state
    let F = current_state[Math.floor(Math.random() * current_state.length)];
    // all_neighbors = Generate all feasible neighbor states by applying three diffrent actions on traffic flow F
    let all_neighbors = [];
    all_neighbors = generate_neighbors(F);
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

function generate_neighbors() {}

function exclude_neighbors() {}

function sort_neighbors() {}

function calculate_max_RMSF() {}

function calculate_RMSF() {}

function select_neighbor_by_gain() {}
