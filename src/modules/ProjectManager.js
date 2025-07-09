import { Project } from "./Project"

const ProjectManager = (() => {
    let projectList = []
    let currentProject

    if (projectList.length === 0) {
        const defaultProject = Project("Default");
        projectList.push(defaultProject);
        currentProject = defaultProject;
    }

    const addProject = (name) => {
        const newProject = Project(name)
        projectList.push(newProject)
        if (!currentProject) {
            currentProject = newProject;
        }
    }

    const deleteProject = (id) => {
        const index = projectList.findIndex(project => project.getId() === id)
        projectList.splice(index, 1)
    }

    const getProject = (id) => {
        const index = projectList.findIndex(project => project.getId() === id)
        return projectList[index]
    }

    const setCurrentProject = (id) => {
        const index = projectList.findIndex(project => project.getId() === id)
        currentProject = projectList[index]
    }

    const getCurrentProject = () => currentProject

    const getProjectList = () => projectList

    const changeProjectName = (id, name) => {
        const index = projectList.findIndex(project => project.getId() === id)
        projectList[index].setName(name)
    }

    return { addProject, deleteProject, getProject, setCurrentProject, getCurrentProject, getProjectList, changeProjectName }

})()

export { ProjectManager }