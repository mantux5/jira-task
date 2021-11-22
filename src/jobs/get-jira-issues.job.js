const jiraService = require("../services/jira.service");
const logger = require("../utils/logger");

const creatorData = {};

const run = () => {
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = `${yesterday.getFullYear()}-${("0" + (yesterday.getMonth() + 1)).slice(-2)}-${("0" + yesterday.getDate()).slice(-2)}`;
    const endDate = `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

    processIssues(startDate, endDate).then(() => {
        logger.info(creatorData);
    })
}

const processIssues = (startDate, endDate, startAt = 0) => {
    return jiraService.sendAPIRequest({
        method: 'GET',
        url: `search?startAt=${startAt}&jql=Created > ${startDate} AND Created < ${endDate}`,
    }).then(handleAPIResponse);
}

const handleAPIResponse = response => {
    if(typeof response.data?.issues === 'object'){
        const issues = Object.entries(response.data.issues);

        for (const [index, issue] of issues) {
            const creator = issue.fields?.creator;
            if(typeof creator === 'object'){
                if(!creatorData.hasOwnProperty(creator.key)){
                    creatorData[creator.key] = 0;
                }

                creatorData[creator.key]++;
            }
        }

        //Check if there aren't any more issues to retrieve
        if(typeof response.data?.startAt !== 'undefined' && 
            typeof response.data?.maxResults !== 'undefined' && 
            response.data.startAt + response.data.maxResults < response.data?.total
        ){
            return processIssues(startDate, endDate, response.data.startAt + response.data.maxResults);
        }
            
        return;
    }
}

module.exports = {
    recurrence: 24 * 60 * 60,
    startTime: '01:00',
    run: run
};