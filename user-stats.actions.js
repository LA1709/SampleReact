import {firebase} from '../../firebase/firebase'

export const getRecentCharts = (campaign) => {
    return (dispatch, getState) => {
        // console.log(campaign);
        const chartsRef = firebase.database().ref(`/users/${getState().auth.uid}/campaigns/${campaign}/dummy-chart-data/current-changes`);
        
        chartsRef.on('value', snapshot => dispatch({
            type: 'GET_RECENT_CHARTS',
            charts: snapshot.val()
        }))
    }
}

export const getPreviousCharts = (campaign) => {
    return (dispatch, getState) => {
        // console.log(campaign);
        const chartsRef = firebase.database().ref(`/users/${getState().auth.uid}/campaigns/${campaign}/dummy-chart-data/from-cf`);
        
        chartsRef.on('value', snapshot => dispatch({
            type: 'GET_PREVIOUS_CHARTS',
            charts: snapshot.val()
        }))
    }
}


