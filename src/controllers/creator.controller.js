const creatorService = require('../services/creator.service');
const catchAsync = require('../utils/catchAsync');

const getCreators = catchAsync( async (req, res) => {
    const result = await creatorService.getCreators();
    res.send(result);
});

const updateCreator = catchAsync( async (req, res) => {
    console.log(req.body.issues);
    const creator = await creatorService.updateCreator(req.params.creatorId, {
        totalIssues: req.body.issues
    });
    res.send(creator);
});

module.exports = {
    getCreators,
    updateCreator
}