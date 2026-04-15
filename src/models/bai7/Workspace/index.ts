import { useState, useCallback, useMemo, useEffect } from 'react';
import type { TaskItem } from '@/services/Bai7';
import { defaultTasks, TaskStatus } from '@/services/Bai7';

const TASK_STORAGE_KEY = 'bai7-task-list';

export default () => {
    const [tasks, setTasks] = useState<TaskItem[]>(defaultTasks);
    
    const [filterKeyword, setFilterKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
    const [filterAssignee, setFilterAssignee] = useState<string>('all');

    // Load từ localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedTasks = window.localStorage.getItem(TASK_STORAGE_KEY);
        if (storedTasks) {
            try {
                const parsed = JSON.parse(storedTasks) as TaskItem[];
                setTasks(parsed);
            } catch (error) {
                console.error('Không thể parse dữ liệu task, dùng default.', error);
            }
        } else {
            window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(defaultTasks));
        }
    }, []);

    // Lưu lại khi có thay đổi
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const addTask = useCallback((task: TaskItem) => {
        setTasks(prev => [task, ...prev]);
    }, []);

    const updateTask = useCallback((id: string, updates: Partial<TaskItem>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    const filteredTasks = useMemo(() => {
        let result = tasks.filter((task) => Boolean(task));

        if (filterKeyword.trim()) {
            const keyword = filterKeyword.toLowerCase().trim();
            result = result.filter((task) => {
                const title = task.title?.toLowerCase() ?? '';
                const desc = task.description?.toLowerCase() ?? '';
                return title.includes(keyword) || desc.includes(keyword);
            });
        }

        if (filterStatus !== 'all') {
            result = result.filter((task) => task.status === filterStatus);
        }

        if (filterAssignee !== 'all') {
            result = result.filter((task) => task.assignee === filterAssignee);
        }

        return result;
    }, [tasks, filterKeyword, filterStatus, filterAssignee]);

    return {
        tasks,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        filterKeyword,
        setFilterKeyword,
        filterStatus,
        setFilterStatus,
        filterAssignee,
        setFilterAssignee,
    };
};
