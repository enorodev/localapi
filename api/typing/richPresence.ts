export type RichPresenceStatus = 'free' | 'busy' | 'inactive' | 'working' | 'casting' | 'watching';

export type RichPresenceConfig = {
    profile: {
        status: RichPresenceStatus,
        description: string,
        details: string
    }
};