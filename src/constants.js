const SORT_KEY = {
  TIME: 'timeToReview',
  REVIEWS: 'totalReviews',
  COMMENTS: 'totalComments',
  additions: 'additions',
  deletions: 'deletions',
  changedFiles: 'changedFiles',
  totalCommentsOnOwnPR: 'totalCommentsOnOwnPR',
  numberOfReviewers: 'numberOfReviewers',
  timeToMerge: 'timeToMerge',
  totalPRs: 'totalPRs',
};

const COLUMNS_ORDER = ['totalReviews', 'timeToReview', 'totalComments', 'additions', 'deletions', 'changedFiles', 'totalCommentsOnOwnPR', 'numberOfReviewers', 'timeToMerge', 'totalPRs'];

const STATS_OPTIMIZATION = {
  totalReviews: 'MAX',
  totalComments: 'MAX',
  commentsPerReview: 'MAX',
  timeToReview: 'MIN',
  additions: 'MAX',
  deletions: 'MAX',
  changedFiles: 'MAX',
  totalCommentsOnOwnPR: 'MIN',
  numberOfReviewers: 'MAX',
  timeToMerge: 'MIN',
  totalPRs: 'MAX',
};

const STATS = Object.keys(STATS_OPTIMIZATION);

module.exports = {
  SORT_KEY,
  COLUMNS_ORDER,
  STATS,
  STATS_OPTIMIZATION,
};
