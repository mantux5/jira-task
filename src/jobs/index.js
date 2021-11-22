const getJiraIssues = require('./get-jira-issues.job');
const schedule = require('node-schedule');

const init = () => {

    const jobs = [
        getJiraIssues,
    ];

    for(const job of jobs){
       schedule.scheduleJob(job.schedule, job.run);
    }
}

module.exports = {
    init
}
