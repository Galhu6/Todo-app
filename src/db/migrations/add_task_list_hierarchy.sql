--Add hierarchy columns and constraints for lists and tasks

--Ensure parent_list_id exists with FK and index
ALTER TABLE lists
    ADD COLUMN IF NOT EXISTS parent_list_id INTEGER;

DO$$
BEGIN
    ALTER TABLE lists
        ADD CONSTRAINT lists_parent_list_fkey
        FOREIGN KEY (parent_list_id)
        REFERENCES lists(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS lists_parent_list_id_idx ON lists(parent_list_id);

-- Ensure list_id and parent_task_id on tasks FKs and indexes
ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS list_id INTEGER,
    ADD COLUMN IF NOT EXISTS parent_task_id INTEGER;

DO $$
BEGIN
    ALTER TABLE tasks
        ADD CONSTRAINT tasks_list_id_fkey
            FOREIGN KEY (list_id)
            REFERENCES lists(id);
EXCEPTION
    when duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE tasks
        ADD CONSTRAINT tasks_parent_task_id_fkey
            FOREIGN KEY (parent_task_id)
            REFERENCES tasks(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS tasks_list_id_idx ON tasks(lists_id);
CREATE INDEX IF NOT EXISTS tasks_parent_task_id_idx ON tasks(parent_task_id)