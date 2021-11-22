const getJiraIssues = require('./get-jira-issues.job');

const init = () => {
    //@TODO: Schedule jobs
    getJiraIssues.run();
}

module.exports = {
    init
}
