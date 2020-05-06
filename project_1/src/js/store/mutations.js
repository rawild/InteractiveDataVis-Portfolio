export default {
    addData(state, payload) {
        state.data=payload;
        return state;
    },
    addElecteds(state, payload) {
        state.electeds = payload;
        return state;
    },
    setDonorsColor(state, payload) {
        state.donorsColor = payload;
        return state;
    },
    addPolitician(state, payload) {
        state.selectedPoliticians.push(payload)
        return state
    },
    removePolitician(state, payload) {
        state.selectedPoliticians = state.selectedPoliticians.filter(d => d != payload)
        return state;
    },
    highlightPolitician(state,payload) {
        state.highlightPolitician = payload
        return state;
    },
    updateDonors(state, payload) {
        state.donors = payload
        return state;
    }

};
