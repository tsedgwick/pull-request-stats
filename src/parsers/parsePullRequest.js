const get = require('lodash.get');
const parseUser = require('./parseUser');
const parseReview = require('./parseReview');

const filterNullAuthor = ({ author }) => !!(author || {}).login;

const getFilteredReviews = (data) => get(data, 'node.reviews.nodes', []).filter(filterNullAuthor);

module.exports = (data = {}) => {
  const author = parseUser(get(data, 'node.author'));
  const publishedAt = new Date(get(data, 'node.publishedAt'));
  const handleReviews = (review) => parseReview(review, { publishedAt, authorLogin: author.login });

  const createdAt = new Date(get(data, 'node.createdAt'));
  const mergedAt = new Date(get(data, 'node.mergedAt'));
  let timeToMerge;
  if (mergedAt && mergedAt > 0) {
    timeToMerge = mergedAt - createdAt;
  }

  return {
    author,
    publishedAt,
    cursor: data.cursor,
    id: get(data, 'node.id'),
    reviews: getFilteredReviews(data).map(handleReviews),
    additions: get(data, 'node.additions'),
    deletions: get(data, 'node.deletions'),
    changedFiles: get(data, 'node.changedFiles'),
    totalCommentsOnOwnPR: get(data, 'node.totalCommentsCount'),
    numberOfReviewers: get(data, 'node.numberOfReviewers'),
    timeToMerge,
  };
};
