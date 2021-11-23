const axios = require('axios');
const logger = require('../utils/logger');

const sendAPIRequest = (data) => {
    if(!data?.method || !data?.url){
        return null;
    }

    return axios({
        method: data.method,
        url: process.env.JIRA_URL + data.url,
        data: { ...data.body }
    }).catch(error => {
        logger.error(error);
    });
}

module.exports = {
    sendAPIRequest,
}