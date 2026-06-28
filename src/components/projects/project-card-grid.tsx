import { ProjectCard, type ProjectCardData } from "~/components/projects/project-card";

export function ProjectCardGrid({ projects }: { projects: ProjectCardData[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
