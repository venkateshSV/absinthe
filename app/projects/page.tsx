"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Projects as PointProjects } from "absinthe-task-sdk";
import { useRouter, useSearchParams } from "next/navigation";

export default function Projects() {
  const [allProjects, setAllProjects] = useState([""]);
  const [hasFetched, setHasFetched] = useState(false);
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");
  const projectObj = new PointProjects(apiKey!);
  const router = useRouter();

  const createNewProject = async () => {
    try {
      const newProject = await projectObj.create();
      setHasFetched(false);

      toast.success("New project created successfully");
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error?.response?.data?.error);
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectObj.fetchAll();
        if (response.success) {
          setAllProjects(response.data!);
        } else {
          toast.error(response.error);
        }
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast.error(error?.response?.data?.error);
      } finally {
        setHasFetched(true);
      }
    };

    fetchProjects();
  }, [apiKey!, hasFetched]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Projects</h1>

        {!hasFetched && (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        )}

        {hasFetched && allProjects[0] === null && (
          <div className="text-center">
            <p>No projects found.</p>
          </div>
        )}

        {hasFetched && allProjects[0] !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <ProjectCard
                key={project}
                project={project}
                apiKey={apiKey!}
                router={router}
              />
            ))}
          </div>
        )}
        <button
          className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={async () => {
            await createNewProject();
          }}
        >
          Create New Project
        </button>
      </div>
    </div>
  );
}
function ProjectCard({
  project,
  apiKey,
  router,
}: {
  project: string;
  apiKey: string;
  router: any;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transform transition-shadow hover:shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold">{project}</h2>
        <div className="mt-4">
          <button
            className="bg-gray-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              const url = `/points?apiKey=${apiKey}&projectId=${project}`;
              router.push(url);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
