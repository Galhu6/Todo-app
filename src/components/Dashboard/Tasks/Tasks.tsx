import { useState, useEffect } from "react";
import {
    editTaskController,
    createTaskController,
    getAllTasksController,
    getTasksController,
    deleteTaskController
} from "../../../controllers/taskController";

export class Task {
    id!: number;
    list_id!: number;
    description!: string;
    due_date!: Date;
    status?: string;
    created_at?: Date;
    isDeleted?: boolean;

    constructor(
        id: number,
        list_id: number,
        description: string,
        due_date: Date,
        status: string,
        created_at = new Date(),
        isDeleted = false

    ) {
        this.id = id;
        this.list_id = list_id;
        this.description = description;
        this.due_date = due_date;
        this.status = status;
        this.created_at = created_at;
        this.isDeleted = isDeleted;
    }

}

type TasksProps = {
    listId: number;
};

export const Tasks = ({ listId }: TasksProps) => {
    const [tasks, setTasks] = useState([Task]);

    useEffect(() => {
        const handleTasks = () => {

        }
    }, [listId]);

    return (
        <div>
            <div>
                current list name
            </div>
            <div>
                show the existing task descriptions in a list (onClick from the Lists components)
                have edit and complete buttons,
                time left as a countdown of days and hours, last day is only hours.

            </div>
            <div>
                a textbox to add a new task description,
                button to add due date and time,
                if due not provided have a popup window to ask for the due time.
            </div>
        </div>
    )
}
