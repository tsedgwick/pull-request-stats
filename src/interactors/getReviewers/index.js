const calculateReviewsStats = require('./calculateReviewsStats');
const groupReviews = require('./groupReviews');

module.exports = (pulls) => groupReviews(pulls).map(({ author, values }) => {
  const stats = calculateReviewsStats(values.reviews, Object.values(values.owned));
  const v = values.reviews;
  return { author, v, stats };
});
