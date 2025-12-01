import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjects,
    createProject as apiCreateProject,
    updateProject as apiUpdateProject,
    deleteProject as apiDeleteProject,
} from "../api/projectsApi";

export function useProjects() {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
    });

    const createMutation = useMutation({
        mutationFn: ({ name, outcome, areaOfLifeId }) => apiCreateProject(name, outcome, areaOfLifeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }) => apiUpdateProject(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiDeleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return {
        projects: projectsQuery.data || [],
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,

        createProject: (name, outcome = null, areaOfLifeId = null) => createMutation.mutate({ name, outcome, areaOfLifeId }),
        createProjectAsync: (name, outcome = null, areaOfLifeId = null) => createMutation.mutateAsync({ name, outcome, areaOfLifeId }),

        updateProject: (id, updates) => updateMutation.mutate({ id, updates }),
        deleteProject: (id) => deleteMutation.mutate(id),

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
