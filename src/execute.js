// // const core = require('@actions/core');
const github = require('@actions/github');
const { subtractDaysToDate } = require('./utils');
// const { Telemetry } = require('./services');
// const { fetchPullRequestById } = require('./fetchers');
const {
  getPulls,
  buildTable,
  // postComment,
  getReviewers,
  buildComment,
  setUpReviewers,
  // checkSponsorship,
  // alreadyPublished,
  // postSlackMessage,
  // postTeamsMessage,
  // postWebhook,
} = require('./interactors');

const run = async (params) => {
  const {
    org,
    // repos,
    // limit,
    sortBy,
    // octokit,
    // publishAs,
    // periodLength,
    disableLinks,
    // personalToken,
    displayCharts,
    // pullRequestId,
  } = params;

  const personalToken = '<UPDATE ME>';
  const repos = ['10gen/baas', '10gen/baas-ui'];
  const limit = 75;
  const periodLength = 90;
  // const pullRequest = pullRequestId
  //   ? await fetchPullRequestById(octokit, pullRequestId)
  //   : null;

  // if (alreadyPublished(pullRequest)) {
  //   core.info('Skipping execution because stats are published already');
  //   return;
  // }

  const pulls = await getPulls({
    org,
    repos,
    octokit: github.getOctokit(personalToken),
    startDate: subtractDaysToDate(new Date(), periodLength),
  });
  var today = new Date()
  console.log(`Found ${pulls.length} pull requests to analyze the past ${periodLength} days from ${today}`);
  // console.log(JSON.stringify(pulls, null, 2));
  const reviewersRaw = getReviewers(pulls);
  console.log(`Analyzed stats for ${reviewersRaw.length} pull request reviewers`);

  const reviewers = setUpReviewers({
    limit,
    sortBy,
    periodLength,
    reviewers: reviewersRaw,
  });

  const table = buildTable({ reviewers, disableLinks, displayCharts });
  // buildTable({ reviewers, disableLinks, displayCharts });
  console.log('Stats table built successfully');

  const content = buildComment({
    table, periodLength, org, repos,
  });
  console.log(`Commit content built successfully: ${content}`);

  // const whParams = { ...params, core, reviewers };
  // await postWebhook(whParams);
  // await postSlackMessage({ ...whParams, pullRequest });
  // await postTeamsMessage({ ...whParams, pullRequest });

  //   if (!pullRequestId) return;
  //   await postComment({
  //     octokit,
  //     content,
  //     publishAs,
  //     pullRequestId,
  //     currentBody: pullRequest.body,
  //   });
  //   core.debug('Posted comment successfully');
  // };

  // module.exports = async (params) => {
  //   core.debug(`Params: ${JSON.stringify(params, null, 2)}`);

  //   const { githubToken, org, repos } = params;
  //   const octokit = github.getOctokit(githubToken);
  //   const isSponsor = await checkSponsorship({ octokit, org, repos });
  //   const telemetry = new Telemetry({ core, isSponsor, telemetry: params.telemetry });
  //   if (isSponsor) core.info('Thanks for sponsoring this project! 💙');

  //   try {
  //     telemetry.start(params);
  //     await run({ ...params, isSponsor, octokit });
  //     telemetry.success();
  //   } catch (error) {
  //     telemetry.error(error);
  //     throw error;
  //   }
};

run({});
