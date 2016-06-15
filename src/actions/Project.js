import ProjectStore from '../stores/ProjectStore';

export const LoadList = () =>
    ProjectStore.dispatch({ type: 'LoadList' });

export const LoadProject = (id) =>
    ProjectStore.dispatch({ type: 'LoadProject', id});

export const SaveProject = (form) =>
    ProjectStore.dispatch({ type: 'SaveProject', form});
