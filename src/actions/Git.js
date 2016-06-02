import GitStore from '../stores/GitStore';

export const FetchRepos = (accessToken) =>
    GitStore.dispatch({
        type: 'FetchRepos',
        accessToken
    });

export const FetchCommits = (repo, project) => 
    GitStore.dispatch({
        type: 'FetchCommits',
        repo,
        project
    });

export const FetchProjects = () =>
    GitStore.dispatch({
        type: 'FetchProjects'
    });

export const Deploy = (sha) =>
    GitStore.dispatch({
        type: 'Deploy',
        sha
    });

export const Submit = (body) =>
    GitStore.dispatch({
        type: 'Submit',
        body
    });