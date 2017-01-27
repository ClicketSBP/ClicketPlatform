const authorization = (() => {
	const getToken = (headers) => {
	    if (headers && headers.authorization) {
	        return headers.authorization;
	    } else {
	        return null;
	    }
	};

	return {
		getToken: getToken
	};
})();

module.exports = authorization;