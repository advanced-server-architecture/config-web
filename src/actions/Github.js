import GithubStore from '../stores/GithubStore';

export const LoadRepoList = (accessToken) =>
    GithubStore.dispatch({ type: 'LoadRepoList', accessToken });

export const LoadCommitList = (accessToken, repo) =>
    GithubStore.dispatch({ type: 'LoadCommitList', accessToken, repo});
