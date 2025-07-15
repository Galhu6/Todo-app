import type { FC } from 'react';

interface ToolbarProps {
    onAdd?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onOpen?: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({ onAdd, onEdit, onDelete, onOpen }) => (
    <div className='absolute right-1 top-1 hidden gap-1 rounded bg-gray-200 dark:bg-gray-700 p-1 shadow group-hover:flex'>
        {onAdd && (
            <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className='text-sx text-gray-800 dark:text-white hover:text-indigo-500'>
                +
            </button>
        )}
        {onEdit && (
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className='text-sx hover:text-indigo-400'>
                ✏️
            </button>
        )}
        {onOpen && (
            <button
                onClick={(e) => { e.stopPropagation(); onOpen(); }}
                className='text-sx hover:text-indigo-400'>
                📂
            </button>
        )}
        {onDelete && (
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className='text-sx hover:text-indigo-400'>
                🗑
            </button>
        )}
    </div>
)