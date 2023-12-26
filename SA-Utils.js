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
        if (neighbor_slotsUsage <= ((1 + delta) * current_slotsUsage)) {
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

function select_neighbor_by_gain() {}
