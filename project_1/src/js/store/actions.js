export default {
    addData(context, payload) {
        context.commit('addData', payload);
    },
    addElecteds(context, payload) {
        context.commit('addElecteds', payload);
    },
    addCandidateYear(context, payload){
        context.commit('addCandidateYear', payload)
    },
    updateDomain(context, payload) {
        context.commit('updateDomain', payload)
    },
    setDonorsColor(context, payload) {
        context.commit('setDonorsColor', payload)
    },
    addPolitician(context, payload) {
        console.log('addPol')
        context.commit('addPolitician', payload)
    },
    removePolitician(context, payload) {
        context.commit('removePolitician', payload)
    },
    highlightPolitician(context, payload){
        context.commit('highlightPolitician', payload)
    },
    updateDonors(context, payload) {
        context.commit('updateDonors', payload)
    }
    
};
