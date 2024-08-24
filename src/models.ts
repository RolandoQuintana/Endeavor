export class Endeavor {
    id: number;
    name: string;
    projects: Project[];
    events: Time_Event[];
    tasks: Task[];
    googleCalendarId?: string;
    color?: string | null;
  
    constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
      this.projects = [];
      this.events = [];
      this.tasks = [];
      this.color = '#039BE5';
    }
  
    addProject(project: Project) {
      this.projects.push(project);
    }
  }
  
  export class Project {
    id: number;
    name: string;
    startDate?: string;
    endDate?: string;
    endeavorId?: number | null;
    events: Time_Event[];
    tasks: Task[];
    
    constructor({
        id,
        name,
        startDate,
        endDate,
        endeavorId
    }: {
        id: number;
        name: string;
        startDate?: string;
        endDate?: string;
        endeavorId?: number | null;
    }) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.endeavorId = endeavorId;
        this.events = [];
        this.tasks = [];
    }
  
    addEvent(event: Time_Event) {
      this.events?.push(event);
    }
  }
  
  export class Time_Event {
    id: number;
    name: string;
    startDate?: Date;
    endDate?: Date;
    isRecurring?: boolean;
    projectId?: number | null;
    endeavorId?: number | null;
    tasks: Task[];
    googleCalendarId?: string;

    constructor({
        id,
        name,
        startDate,
        endDate,
        isRecurring,
        projectId,
        endeavorId,
        googleCalendarId
    }: {
        id: number;
        name: string;
        startDate?: Date;
        endDate?: Date;
        isRecurring?: boolean;
        projectId?: number | null;
        endeavorId?: number | null;
        googleCalendarId?: string;
    }) {
      this.id = id;
      this.name = name;
      this.startDate = startDate;
      this.endDate = endDate;
      this.isRecurring = isRecurring;
      this.projectId = projectId; // Optional parent relationship
      this.endeavorId = endeavorId; // Optional parent relationship
      this.tasks = [];
      this.googleCalendarId = googleCalendarId;
    }
  
    addTask(task: Task) {
      this.tasks.push(task);
    }
  }
  
  export class Task {
    id: number;
    name: string;
    dueDate?: string;
    eventId?: number | null;
    projectId?: number | null;
    endeavorId?: number | null;
  
    constructor({
        id,
        name,
        dueDate,
        eventId,
        projectId,
        endeavorId
    }: {
        id: number;
        name: string;
        dueDate?: string;
        eventId?: number | null;
        projectId?: number | null;
        endeavorId?: number | null;
    }) {
      this.id = id;
      this.name = name;
      this.dueDate = dueDate;
      this.eventId = eventId;
      this.projectId = projectId;
      this.endeavorId = endeavorId;
    }
  }

  export class Tag {
    name: string;
    constructor({
        name
    }: {
        id: number;
        name: string;
        color: string;
    }) {
        this.name = name;
    }
  }