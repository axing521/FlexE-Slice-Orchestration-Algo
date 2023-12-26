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
