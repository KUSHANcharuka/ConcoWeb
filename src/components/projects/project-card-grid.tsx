import { ProjectCard, type ProjectCardData } from "~/components/projects/project-card";

export function ProjectCardGrid({
  projects,
  hrefBuilder,
}: {
  projects: ProjectCardData[];
  hrefBuilder?: (project: ProjectCardData) => string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          href={hrefBuilder ? hrefBuilder(project) : undefined}
          project={project}
        />
      ))}
    </div>
  );
}
