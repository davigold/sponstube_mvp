import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, Campaign, BrandProfile, Community } from '../types';
import { MOCK_USERS, MOCK_CAMPAIGNS, MOCK_BRANDS, MOCK_COMMUNITIES } from '../mockData';

interface DataContextType {
    users: User[];
    campaigns: Campaign[];
    brands: BrandProfile[];
    communities: Community[];
    loading: boolean;
    refreshData: () => Promise<void>;
    isOfflineMode: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
    const [brands, setBrands] = useState<BrandProfile[]>(MOCK_BRANDS);
    const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
    const [loading, setLoading] = useState(true);
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    const refreshData = async () => {
        setLoading(true);
        try {
            // Parallel fetching for performance
            const [usersRes, campaignsRes] = await Promise.allSettled([
                api.get('/users'),
                api.get('/campaigns')
            ]);

            if (usersRes.status === 'fulfilled') {
                // If backend has data, use it. usage of concat/logic depends on API shape.
                // For MVP, we assume API returns arrays.
                console.log("Users loaded from API");
                if (usersRes.value.data.length > 0) setUsers(usersRes.value.data);
            }

            if (campaignsRes.status === 'fulfilled') {
                console.log("Campaigns loaded from API");
                if (campaignsRes.value.data.length > 0) setCampaigns(campaignsRes.value.data);
            }

            // Marks connection as successful
            setIsOfflineMode(false);

        } catch (error) {
            console.warn("API Connection failed, falling back to Mock Data.", error);
            setIsOfflineMode(true);
            // We keep the initial mock data in state, so no action needed, standard fallback.
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        refreshData();
    }, []);

    return (
        <DataContext.Provider value={{
            users,
            campaigns,
            brands,
            communities,
            loading,
            refreshData,
            isOfflineMode
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
