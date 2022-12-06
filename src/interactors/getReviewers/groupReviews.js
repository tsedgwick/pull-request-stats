module.exports = (pulls) => {
  const removeOwnPulls = ({ isOwnPull }) => !isOwnPull;

  const removeWithEmptyId = ({ id }) => !!id;

  const all = Object.values(pulls).reduce((acc, pull) => {

    const reviews = pull.reviews
      .filter(removeOwnPulls)
      .filter(removeWithEmptyId)
      .map((r) => ({
        ...r,
        pullRequestId: pull.id,
        pullAuthor: pull.author.id,
        additions: pull.additions,
        deletions: pull.deletions,
        changedFiles: pull.changedFiles,
        totalCommentsOnOwnPR: pull.totalCommentsOnOwnPR,
        timeToMerge: pull.timeToMerge,
      }));

    return acc.concat(reviews);
  }, []);

  const byAuthor = all.reduce((acc, review) => {
    const {
      // pullRequestId,
      pullAuthor,
      author,
      isOwnPull,
      additions,
      deletions,
      changedFiles,
      totalCommentsOnOwnPR,
      timeToMerge,
      ...other
    } = review;
    const key = author.id;


    if (!acc[key]) acc[key] = { author, values: { reviews: [], owned: new Map() } };
    acc[key].values.reviews.push(other);
    return acc;
  }, {});

  pulls.forEach(function (pull) {
    const author = pull.author;
    const pullAuthor = pull.author.id;

    let reviews = byAuthor[pullAuthor];

    if (!reviews) {
      reviews = { author, values: { reviews: [], owned: new Map() } };
    }

    if (!byAuthor[pullAuthor]) byAuthor[pullAuthor] = { author, values: { reviews: [], owned: new Map() } };

    const { additions, deletions, changedFiles, totalCommentsOnOwnPR, timeToMerge } = pull;
    const numberOfReviewers = new Set(pull.reviews.filter(removeOwnPulls).filter(removeWithEmptyId).map(review => review.author.id)).size;

    byAuthor[pullAuthor].values.owned[pull.id] = {
      additions,
      deletions,
      changedFiles,
      totalCommentsOnOwnPR,
      timeToMerge,
      numberOfReviewers,
    };
    byAuthor[pullAuthor].values.reviews = reviews.values.reviews;
  });
  // console.log(JSON.stringify(Object.values(byAuthor)));
  // console.log(Object.values(byAuthor));
  return Object.values(byAuthor);
};
