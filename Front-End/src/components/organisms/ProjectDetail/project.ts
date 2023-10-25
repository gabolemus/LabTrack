/** Enum that defines the possible project statuses */
export enum ProjectStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export const getProjectStatus = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "No iniciado";
    case ProjectStatus.IN_PROGRESS:
      return "En progreso";
    case ProjectStatus.COMPLETED:
      return "Completado";
    case ProjectStatus.CANCELLED:
      return "Cancelado";
    default:
      return "No iniciado";
  }
};

export const ProjectStatuses = [
  { status: ProjectStatus.NOT_STARTED },
  { status: ProjectStatus.IN_PROGRESS },
  { status: ProjectStatus.COMPLETED },
  { status: ProjectStatus.CANCELLED },
];
