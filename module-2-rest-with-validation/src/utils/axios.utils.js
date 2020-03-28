const axios = require('axios');

exports.getRequest = (url, onSuccess, onError) => {
    axios.get(url)
        .then(onSuccess)
        .catch(onError);
};
