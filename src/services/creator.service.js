const Creator = require('../models/creator.model');

const getCreatorByKey = async (key) => {
    return Creator.findOne({ key });
}

const saveCreator = async (key, name, totalIssues, dailyRecordDate) => {
    const creatorDoc = await Creator.create({
        key,
        name,
        totalIssues,
        dailyRecord: {
            date: dailyRecordDate,
            issues: totalIssues,
        },
    });

    return creatorDoc;
}

const updateCreator = async (key, data) => {
    const creatorDoc = await Creator.updateOne(
        { 
            key: key
        },
        {
            ...data
        }
    );

    return creatorDoc;
}

const incrementIssueCount = async (key, issues) => {
    const creatorDoc = await Creator.updateOne(
        { 
            key: key
        },
        {
            $inc : {
                totalIssues : issues
            }
        }
    );

    return creatorDoc;
}

const setNewRecord = async (key, date, issues) => {
    const creatorDoc = await Creator.updateOne(
        { 
            key: key
        }, 
        {
            dailyRecord: {
                date,
                issues,
            },
        }
    );

    return creatorDoc;
}

module.exports = {
    getCreatorByKey,
    saveCreator,
    updateCreator,
    incrementIssueCount,
    setNewRecord
}