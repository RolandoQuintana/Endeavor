import { Endeavor, Project, Time_Event, Task, Tag } from './models';

const STORAGE_KEYS = {
    ENDEAVORS: 'endeavor_data',
    PROJECTS: 'project_data',
    EVENTS: 'event_data',
    TASKS: 'task_data',
    TAGS: 'tag_data'
  };
  
  console.log('storage.js loaded');
  
  async function saveData(key: string, data: any) {
    await chrome.storage.local.set({ [key]: data }, () => {
      console.log(`Data saved for key: ${key} - ${JSON.stringify(data)}`);
    });
  }
  
  async function loadData(key: string, callback?: (data: any[]) => void) {
    const result = await chrome.storage.local.get([key]);
    if (callback) {
        callback(result[key] || []);
      } else {
        return result[key] || [];
      }
  }
  
  
  // Endeavor CRUD operations
  export function addEndeavor(endeavor: Endeavor, callback: () => void) {
    loadData(STORAGE_KEYS.ENDEAVORS, (data) => {
      data.push(endeavor);
      saveData(STORAGE_KEYS.ENDEAVORS, data);
      callback();
    });
  }
  
  export function updateEndeavor(updatedEndeavor: Endeavor, callback: () => void) {
    loadData(STORAGE_KEYS.ENDEAVORS, (data) => {
      const index = data.findIndex((e) => e.id === updatedEndeavor.id);
      if (index !== -1) {
        data[index] = updatedEndeavor;
        saveData(STORAGE_KEYS.ENDEAVORS, data);
        callback();
      }
    });
  }
  
  export function deleteEndeavor(endeavorId: number, callback: () => void) {
    loadData(STORAGE_KEYS.ENDEAVORS, (data) => {
      const updatedData = data.filter((e) => e.id !== endeavorId);
      saveData(STORAGE_KEYS.ENDEAVORS, updatedData);
      callback();
    });
  }
  
  export async function getEndeavors(callback?: (data: Endeavor[]) => void) {
    if (callback) {
      return await loadData(STORAGE_KEYS.ENDEAVORS, callback);
    } else {
      return await loadData(STORAGE_KEYS.ENDEAVORS);
    }
  }
  
  // Project CRUD operations
  export function addProject(project: Project, callback?: (project: Project) => void) {
    loadData(STORAGE_KEYS.PROJECTS, (data) => {
      data.push(project);
      saveData(STORAGE_KEYS.PROJECTS, data);
      if (callback) {
        callback(project);
      }
    });
  }
  
  export function updateProject(updatedProject: Project, callback: (project: Project) => void) {
    loadData(STORAGE_KEYS.PROJECTS, (data) => {
      const index = data.findIndex((p) => p.id === updatedProject.id);
      if (index !== -1) {
        data[index] = updatedProject;
        saveData(STORAGE_KEYS.PROJECTS, data);
        callback(updatedProject);
      }
    });
  }
  
  export function deleteProject(projectId: number, callback: () => void) {
    loadData(STORAGE_KEYS.PROJECTS, (data) => {
      const updatedData = data.filter((p) => p.id !== projectId);
      saveData(STORAGE_KEYS.PROJECTS, updatedData);
      callback();
    });
  }
  
  export function getProjects(callback: (data: Project[]) => void) {
    loadData(STORAGE_KEYS.PROJECTS, callback);
  }
  
  // Event CRUD operations
  export function addEvent(event: Time_Event, callback: (event: Time_Event) => void) {
    loadData(STORAGE_KEYS.EVENTS, (data) => {
      data.push(event);
      saveData(STORAGE_KEYS.EVENTS, data);
      callback(event);
    });
  }
  
  export function updateEvent(updatedEvent: Time_Event, callback: (event: Time_Event) => void) {
    loadData(STORAGE_KEYS.EVENTS, (data) => {
      const index = data.findIndex((ev) => ev.id === updatedEvent.id);
      if (index !== -1) {
        data[index] = updatedEvent;
        saveData(STORAGE_KEYS.EVENTS, data);
        callback(updatedEvent);
      }
    });
  }
  
  export function deleteEvent(eventId: number, callback: () => void) {
    loadData(STORAGE_KEYS.EVENTS, (data) => {
      const updatedData = data.filter((ev) => ev.id !== eventId);
      saveData(STORAGE_KEYS.EVENTS, updatedData);
      callback();
    });
  }
  
  export function getEvents(callback: (data: Time_Event[]) => void) {
    loadData(STORAGE_KEYS.EVENTS, callback);
  }
  
  // Task CRUD operations
  export function addTask(task: Task, callback: (task: Task) => void) {
    loadData(STORAGE_KEYS.TASKS, (data) => {
      data.push(task);
      saveData(STORAGE_KEYS.TASKS, data);
      callback(task);
    });
  }
  
  export function updateTask(updatedTask: Task, callback: (task: Task) => void) {
    loadData(STORAGE_KEYS.TASKS, (data) => {
      const index = data.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        data[index] = updatedTask;
        saveData(STORAGE_KEYS.TASKS, data);
        callback(updatedTask);
      }
    });
  }
  
  export function deleteTask(taskId: number, callback: () => void) {
    loadData(STORAGE_KEYS.TASKS, (data) => {
      const updatedData = data.filter((t) => t.id !== taskId);
      saveData(STORAGE_KEYS.TASKS, updatedData);
      callback();
    });
  }
  
  export function getTasks(callback: (data: Task[]) => void) {
    loadData(STORAGE_KEYS.TASKS, callback);
  }
  
  // Tag CRUD operations
export function addTag(tag: Tag, callback: () => void) {
  loadData(STORAGE_KEYS.TAGS, (data) => {
      data.push(tag);
      saveData(STORAGE_KEYS.TAGS, data);
      callback();
  });
}

export function deleteTag(tagToDelete: Tag, callback: () => void) {
  loadData(STORAGE_KEYS.TAGS, (data) => {
      const updatedData = data.filter((tag) => tag.name !== tagToDelete.name);
      saveData(STORAGE_KEYS.TAGS, updatedData);
      callback();
  });
}

export function getTags(callback: (data: Tag[]) => void) {
  loadData(STORAGE_KEYS.TAGS, callback);
}