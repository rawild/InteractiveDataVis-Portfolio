export default {
    addData(context, payload) {
        context.commit('addData', payload);
    },
    addElecteds(context, payload) {
        context.commit('addElecteds', payload);
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
    updateDonor(context, payload) {
        context.commit('updateDonor', payload)
    }
    
};
