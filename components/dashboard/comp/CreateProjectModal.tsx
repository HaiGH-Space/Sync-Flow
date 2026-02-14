'use client'
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Workspace } from "@/lib/services/workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/lib/services/project";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import FieldAnimation from "@/components/auth/FieldAnimation";
import { useState } from "react";

type CreateProjectModalProps = {
    workspaceDetail: Workspace
}

const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    key: z.string().min(1, "Project key is required"),
    description: z.string().optional(),
})

type FormSchema = z.infer<typeof createProjectSchema>

const defaultValues: FormSchema = {
    name: "",
    key: "",
    description: ""
}

export default function CreateProjectModal({ workspaceDetail }: CreateProjectModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: createProject, isPending } = useMutation({
        mutationFn: projectService.createProject,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['projects', workspaceDetail?.id] });
            toast.success("Project created successfully");
            handleOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to create project");
        }
    })

    const form = useForm({
        defaultValues: defaultValues,
        validators: {
            onSubmit: createProjectSchema,
            onChange: createProjectSchema
        },
        onSubmit: async ({ value }) => {
            console.log("Creating project with values:", value);
            createProject({
                workspaceId: workspaceDetail.id,
                project: value
            })
        },
    })

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setTimeout(() => {
                form.reset();
            }, 300);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" size="icon-lg">
                    <PlusIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        {`Create a new project in ${workspaceDetail.name}.`}
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="create-project-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <FieldAnimation form={form} name="name" placeholder="Project Name" />
                    <FieldAnimation form={form} name="key" placeholder="Project Key" />
                    <FieldAnimation form={form} name="description" placeholder="Project Description (optional)" />
                    <Button
                        type="submit"
                        className="mt-4 cursor-pointer w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Project"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}