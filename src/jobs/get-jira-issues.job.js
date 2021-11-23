const jiraService = require('../services/jira.service');
const creatorService = require('../services/creator.service');
const logger = require('../utils/logger');

const creatorData = {};

const run = () => {
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = `${yesterday.getFullYear()}-${("0" + (yesterday.getMonth() + 1)).slice(-2)}-${("0" + yesterday.getDate()).slice(-2)}`;
    const endDate = `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

    processIssues(startDate, endDate).then(() => {
        for (const [key, creatorDetails] of Object.entries(creatorData)) {
            creatorService.getCreatorByKey(key)
            .then(creator => {
                if(creator === null){
                    creatorService.saveCreator(key, creatorDetails.name, creatorDetails.issues, startDate)
                } else {
                    creatorService.incrementIssueCount(key, creatorDetails.issues);
                    if(creatorDetails.issues > creator.dailyRecord.issues){
                        creatorService.setNewRecord(key, startDate, creatorDetails.issues)
                    }
                }
            })
            .catch(error => logger.error(error));
        }
    })
}

const processIssues = (startDate, endDate, startAt = 0) => {
    return jiraService.sendAPIRequest({
        method: 'GET',
        url: `search?startAt=${startAt}&jql=Created > ${startDate} AND Created < ${endDate}`,
    })
    .then(handleAPIResponse)
    .catch(error => logger.error(error));
}

const handleAPIResponse = response => {
    if(typeof response.data?.issues === 'object'){
        const issues = Object.entries(response.data.issues);

        for (const [index, issue] of issues) {
            const creator = issue.fields?.creator;
            if(typeof creator === 'object'){
                if(!creatorData.hasOwnProperty(creator.key)){
                    creatorData[creator.key] = {
                        name: creator.displayName,
                        issues: 0,
                    };
                }

                creatorData[creator.key].issues++;
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
    schedule: '0 1 * * *',
    run,
};