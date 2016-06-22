import DeployStore from '../stores/DeployStore';

export const InitProject = (form) =>
    DeployStore.dispatch({
        type: 'InitProject',
        form
    });

export const PullProject = (agentId, projectId, commit) =>
    DeployStore.dispatch({
        type: 'PullProject',
        agentId,
        projectId,
        commit
    });
