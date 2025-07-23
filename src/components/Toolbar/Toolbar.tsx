import type { FC } from 'react';

interface ToolbarProps {
    onAdd?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onOpen?: () => void;
    onDuplicate?: () => void;
    onComplete?: () => void;
    onShare?: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({ onAdd, onEdit, onDelete, onOpen, onDuplicate, onComplete, onShare }) => (
    <div className='absolute right-1 top-1 hidden gap-1 rounded bg-gray-200 dark:bg-gray-700 p-1 shadow group-hover:flex text-xs'>
        {onAdd && (
            <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className='text-gray-800 dark:text-white hover:text-indigo-500'>
                +
            </button>
        )}
        {onEdit && (
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className=' hover:text-indigo-400'>
                ✏️
            </button>
        )}
        {onDuplicate && (
            <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                className='hover:text-indigo-400'>
                ⧉
            </button>
        )}
        {onShare && (
            <button
            onClick={(e) => {e.stopPropagation(); onShare(); }}
            className='hover:text-indigo-400'>
                🔗
            </button>
        )}
        {onComplete && (
            <button
                onClick={(e) => { e.stopPropagation(); onComplete(); }}
                className='hover:text-indigo-400'>
                ✔
            </button>
        )}
        {onOpen && (
            <button
                onClick={(e) => { e.stopPropagation(); onOpen(); }}
                className='hover:text-indigo-400'>
                📂
            </button>
        )}
        {onDelete && (
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className='hover:text-indigo-400'>
                🗑
            </button>
        )}
    </div>
);