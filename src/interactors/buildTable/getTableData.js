const { t } = require('../../i18n');
const { durationToString, isNil } = require('../../utils');

const NA = '-';

const MEDAL_ICONS = [0x1F947, 0x1F948, 0x1F949]; /* 🥇🥈🥉 */

const CHART_CHARACTER = '▀';

const CHART_MAX_LENGTH = 10;

const AVATAR_SIZE = {
  SMALL: 20,
  LARGE: 32,
};

const noParse = (value) => value;

const generateChart = (percentage = 0) => {
  const length = Math.round(percentage * CHART_MAX_LENGTH);
  if (length <= 0) {
    return '';
  }
  try {
    return Array(length).fill(CHART_CHARACTER).join('');
  } catch {
    return '';
  }
};

const getChartsData = ({ index, contributions, displayCharts }) => {
  const addBr = (data) => (displayCharts ? `<br/>${data}` : '');
  const medal = MEDAL_ICONS[index];

  return {
    username: addBr(medal ? String.fromCodePoint(medal) : ''),
    timeStr: addBr(generateChart(contributions.timeToReview)),
    reviewsStr: addBr(generateChart(contributions.totalReviews)),
    commentsStr: addBr(generateChart(contributions.totalComments)),
    additionsStr: addBr(generateChart(contributions.additions)),
    deletionsStr: addBr(generateChart(contributions.deletions)),
    changedFilesStr: addBr(generateChart(contributions.changedFiles)),
    totalCommentsOnOwnPRStr: addBr(generateChart(contributions.totalCommentsOnOwnPR)),
    numberOfReviewersStr: addBr(generateChart(contributions.numberOfReviewers)),
    timeToMergeStr: addBr(generateChart(contributions.timeToMerge)),
    totalPRsStr: addBr(generateChart(contributions.totalPRs)),
  };
};

const bold = (value) => `**${value}**`;

const buildLink = (href, content) => `<a href="${href}">${content}</a>`;

const buildImage = (src, width) => `<img src="${src}" width="${width}">`;

const getImage = ({ author, displayCharts }) => {
  const { avatarUrl, url } = author;
  const avatarSize = displayCharts ? AVATAR_SIZE.LARGE : AVATAR_SIZE.SMALL;

  return buildLink(url, buildImage(avatarUrl, avatarSize));
};

const addReviewsTimeLink = (text, disable, link) => {
  const addLink = link && !disable;
  return addLink ? `[${text}](${link})` : text;
};

module.exports = ({
  reviewers,
  bests = {},
  disableLinks = false,
  displayCharts = false,
}) => {
  const printStat = (stats, statName, parser) => {
    const value = stats[statName];
    if (isNil(value)) return NA;

    const isBest = value === bests[statName];
    const parsed = parser(value);
    return isBest ? bold(parsed) : parsed;
  };

  const buildRow = ({ reviewer, index }) => {
    const {
      author, stats, contributions, urls,
    } = reviewer;
    const { login } = author || {};
    const chartsData = getChartsData({ index, contributions, displayCharts });

    const avatar = getImage({ author, displayCharts });
    const timeVal = printStat(stats, 'timeToReview', durationToString);
    const timeStr = addReviewsTimeLink(timeVal, disableLinks, urls.timeToReview);
    const reviewsStr = printStat(stats, 'totalReviews', noParse);
    const commentsStr = printStat(stats, 'totalComments', noParse);
    const additionsStr = printStat(stats, 'additions', noParse);
    const deletionsStr = printStat(stats, 'deletions', noParse);
    const changedFilesStr = printStat(stats, 'changedFiles', noParse);
    const totalCommentsOnOwnPRStr = printStat(stats, 'totalCommentsOnOwnPR', noParse);
    const numberOfReviewersStr = printStat(stats, 'numberOfReviewers', noParse);
    const timeToMergeVal = printStat(stats, 'timeToMerge', durationToString);
    const timeToMergeStr = addReviewsTimeLink(timeToMergeVal, disableLinks, urls.timeToReview);
    const totalPRsStr = printStat(stats, 'totalPRs', noParse);

    return {
      avatar,
      username: `${login}${chartsData.username}`,
      timeToReview: `${timeStr}${chartsData.timeStr}`,
      totalReviews: `${reviewsStr}${chartsData.reviewsStr}`,
      totalComments: `${commentsStr}${chartsData.commentsStr}`,
      additions: `${additionsStr}${chartsData.additionsStr}`,
      deletions: `${deletionsStr}${chartsData.deletionsStr}`,
      changedFiles: `${changedFilesStr}${chartsData.changedFilesStr}`,
      totalCommentsOnOwnPR: `${totalCommentsOnOwnPRStr}${chartsData.totalCommentsOnOwnPRStr}`,
      numberOfReviewers: `${numberOfReviewersStr}${chartsData.numberOfReviewersStr}`,
      timeToMerge: `${timeToMergeStr}${chartsData.timeToMergeStr}`,
      totalPRs: `${totalPRsStr}${chartsData.totalPRsStr}`,
    };
  };

  const execute = () => {
    const data = reviewers.map((reviewer, index) => buildRow({
      reviewer,
      index,
      bests,
      displayCharts,
    }));

    const titles = {
      avatar: t('table.columns.avatar'),
      username: t('table.columns.username'),
      timeToReview: t('table.columns.timeToReview'),
      totalReviews: t('table.columns.totalReviews'),
      totalComments: t('table.columns.totalComments'),
      additions: t('table.columns.additions'),
      deletions: t('table.columns.deletions'),
      changedFiles: t('table.columns.changedFiles'),
      totalCommentsOnOwnPR: t('table.columns.totalCommentsOnOwnPR'),
      numberOfReviewers: t('table.columns.numberOfReviewers'),
      timeToMerge: t('table.columns.timeToMerge'),
      totalPRs: t('table.columns.totalPRs'),
    };

    return [
      titles,
      ...data,
    ];
  };

  return execute();
};
