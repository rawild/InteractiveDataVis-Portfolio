export default {
    addTopDonors(state, payload) {
        state.topDonors=payload;
        return state;
    },
    addElecteds(state, payload) {
        state.electeds = payload;
        return state;
    },
    addDonorNames(state, payload){
        state.donorNames= payload;
        return state;
    },
    addTopCandidates(state, payload){
        state.topCandidates = payload;
        return state;
    },
    addDonors(state, payload){
        state.donors= payload;
        return state;
    },
    addCuomoDonors(state, payload){
        state.cuomoDonors= payload;
        return state;
    },
    addQuartiles(state, payload){
        state.quartiles= payload;
        return state;
    },
    setCandidateColors(state,payload){
        state.candidateColors = payload;
        return state;
    }

};
