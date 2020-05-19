export default {
    addTopDonors(context, payload) {
        context.commit('addTopDonors', payload);
    },
    addElecteds(context, payload) {
        context.commit('addElecteds', payload);
    },
    addDonorNames(context, payload) {
        context.commit('addDonorNames', payload)
    },
    addTopCandidates(context, payload){
        context.commit('addTopCandidates', payload)
    },
    addDonors(context, payload) {
        context.commit('addDonors', payload)
    },
    addCuomoDonors(context, payload) {
        context.commit('addCuomoDonors', payload)
    },
    addQuartiles(context,payload){
        context.commit('addQuartiles', payload)
    },
    setCandidateColors(context,payload){
        context.commit('setCandidateColors', payload)
    },
    
};
