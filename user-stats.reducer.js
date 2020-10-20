const INITIAL_STATE = {
    recentCharts: {},
    previousCharts: {}
}

const userStats = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'GET_RECENT_CHARTS':
            return {
                ...state,
                recentCharts: action.charts
            };
        case 'GET_PREVIOUS_CHARTS':
            return {
                ...state,
                previousCharts: action.charts
            };
        default: return state;
    }
}

export default userStats;