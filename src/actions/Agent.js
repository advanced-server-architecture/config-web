import AgentStore from '../stores/AgentStore';

export const LoadList = () =>
    AgentStore.dispatch({ type: 'LoadList' });

export const LoadAgent = (uid) =>
    AgentStore.dispatch({ type: 'LoadAgent', uid});

export const LoadAgentUsage = (uid) =>
    AgentStore.dispatch({ type: 'LoadAgentUsage', uid});

export const LoadAgentProject = (uid) =>
    AgentStore.dispatch({ type: 'LoadAgentProject', uid});

export const LoadAgentFileList = (uid) =>
    AgentStore.dispatch({ type: 'LoadAgentFileList', uid});

export const LoadAgentLog = (uid, size, page) =>
    AgentStore.dispatch({ type: 'LoadAgentLog', uid, size, page});

export const StartProject = (uid, name) =>
    AgentStore.dispatch({ type: 'StartProject', uid, name});

export const StopProject = (uid, pid) =>
    AgentStore.dispatch({ type: 'StopProject', uid, pid});

export const KillProject = (uid, name) =>
    AgentStore.dispatch({ type: 'KillProject', uid, name});
