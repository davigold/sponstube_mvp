import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
// Types based on the mock/schema
// Ideally these should be shared types
export interface User { id: string; name: string; email: string; role: string; avatarUrl?: string; }
export interface Campaign { id: string; name: string; status: string; brief: string; budgetTotal: number; brandId: string; }

interface DataContextType {
    users: User[];
    campaigns: Campaign[];
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    users: [],
    campaigns: [],
    loading: true,
    refreshData: async () => { },
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersRes = await api.get('/users');
            const campaignsRes = await api.get('/campaigns');
            setUsers(usersRes.data);
            setCampaigns(campaignsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            // Fallback or empty on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ users, campaigns, loading, refreshData: fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
