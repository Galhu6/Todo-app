import type { FC } from "react";

interface ToolbarProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onOpen?: () => void;
  onDuplicate?: () => void;
  onComplete?: () => void;
  onShare?: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onOpen,
  onDuplicate,
  onComplete,
  onShare,
}) => (
  <div className="absolute right-1 top-1 hidden gap-1 rounded bg-indigo-500 text-white dark:bg-indigo-600 p-1 shadow group-hover:flex text-xs">
    {onAdd && (
      <button
        title="Add"
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        className="hover:text-yellow-300"
      >
        +
      </button>
    )}
    {onEdit && (
      <button
        title="Edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className=" hover:text-yellow-300"
      >
        ✏️
      </button>
    )}
    {onDuplicate && (
      <button
        title="Duplicate"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="hover:text-yellow-300"
      >
        ⧉
      </button>
    )}
    {onShare && (
      <button
        title="Share"
        onClick={(e) => {
          e.stopPropagation();
          onShare();
        }}
        className="hover:text-yellow-300"
      >
        🔗
      </button>
    )}
    {onComplete && (
      <button
        title="complete"
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className="hover:text-yellow-300"
      >
        ✔
      </button>
    )}
    {onOpen && (
      <button
        title="Open"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="hover:text-yellow-300"
      >
        📂
      </button>
    )}
    {onDelete && (
      <button
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="hover:text-yellow-300"
      >
        🗑
      </button>
    )}
  </div>
);
