import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const youtube = google.youtube('v3');
const API_KEY = process.env.GOOGLE_API_KEY;

export const getChannelStats = async (channelId: string) => {
    if (!API_KEY) {
        console.warn('Google API Key missing, returning mock stats');
        return { viewCount: '100000', subscriberCount: '5000', videoCount: '50' };
    }

    try {
        const response = await youtube.channels.list({
            key: API_KEY,
            part: ['statistics', 'snippet'],
            id: [channelId],
        });

        const channel = response.data.items?.[0];
        if (!channel) throw new Error('Channel not found');

        return {
            title: channel.snippet?.title,
            stats: channel.statistics
        };
    } catch (error) {
        console.error('YouTube API error:', error);
        throw error;
    }
};
