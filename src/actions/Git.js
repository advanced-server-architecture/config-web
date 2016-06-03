import GitStore from '../stores/GitStore';

export const FetchRepos = (accessToken) =>
    GitStore.dispatch({
        type: 'FetchRepos',
        accessToken
    });

export const FetchCommits = (project) => 
    GitStore.dispatch({
        type: 'FetchCommits',
        project
    });
export const FetchTags = (project) => 
    GitStore.dispatch({
        type: 'FetchTags',
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

