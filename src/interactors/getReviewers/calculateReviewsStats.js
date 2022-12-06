const { sum, average, median, divide } = require('../../utils');

const getProperty = (list, prop) => list.map((el) => el[prop]);

module.exports = (reviews, owned) => {
  const pullRequestIds = getProperty(reviews, 'pullRequestId');
  const totalReviews = new Set(pullRequestIds).size;
  const totalComments = sum(getProperty(reviews, 'commentsCount'));
  // console.log(JSON.stringify(reviews));
  return {
    totalReviews,
    totalComments,
    commentsPerReview: divide(totalComments, totalReviews),
    timeToReview: average(getProperty(reviews, 'timeToReview')),
    additions: average(getProperty(owned, 'additions')),
    deletions: average(getProperty(owned, 'deletions')),
    changedFiles: average(getProperty(owned, 'changedFiles')),
    totalCommentsOnOwnPR: average(getProperty(owned, 'totalCommentsOnOwnPR')),
    numberOfReviewers: average(getProperty(owned, 'numberOfReviewers')),
    timeToMerge: median(getProperty(owned, 'timeToMerge')),
    totalPRs: owned.length,
  };
};
