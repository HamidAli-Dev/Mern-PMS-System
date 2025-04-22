import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./create-task-form";

const CreateTaskDialog = (props: { projectId?: string }) => {
  return (
    <div>
      <Dialog modal={true}>
        <DialogTitle className="sr-only"></DialogTitle>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          <DialogDescription className="sr-only"></DialogDescription>
          <CreateTaskForm projectId={props.projectId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTaskDialog;
