const utility = (() => {
    const replaceAll = (words, str, cb) => {
        let regex = RegExp('(' + Object.keys(words).join('|') + ')', 'g');
        let newStr = "";

        str = str.replace(regex, (match) => {
            return words[match];
        });

        cb(str);
    };

    return {
        replaceAll: replaceAll
    };
})();

module.exports = utility;