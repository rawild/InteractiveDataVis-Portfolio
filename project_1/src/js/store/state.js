export default {
   selectedPoliticians: [],
   donorPrettyPrint: (donor) => {
        let words = donor.split(" ")
        for ( var x in words) {
                let word = words[x]
                if (word != "PAC") {
                    words[x] = word[0].toUpperCase() + word.slice(1).toLowerCase()
                }
        }
        return words.join(" ")
   }
};
