export interface BodyToLocationCreation {
    userId: string;
    title: string;
    context: string;
    location: string;
    required: number;
}

export interface LocationChallengeCreation {
    userId: bigint;
    title: string;
    context: string;
    location: string;
    required: number;
}

export interface ChallengeModify {
    id: bigint;
    required: number;
    remaining: number;
}

export interface ResponseFromChallenge {
    id: string;
    userId: string;
    title: string;
    context: string;
    requiredCount: number;
    remainingCount: number;
    createdAt: Date;
    updatedAt: Date | null;
    acceptedAt: Date | null;
    completedAt: Date | null;
    status: number;
}

export interface ResponseFromLocationChallenge {
    id: string;
    userId: string;
    title: string;
    context: string;
    location: string;
    requiredCount: number;
    remainingCount: number;
    createdAt: Date;
    updatedAt: Date | null;
    acceptedAt: Date | null;
    completedAt: Date | null;
    status: number;
}

export interface ResponseFromUpdateChallenge {
    id: string;
    userId: string;
    requiredCount: number;
    remainingCount: number;
    updatedAt: Date | null;
    status: number;
}

export interface PhotoInfo {
    id: string;
    displayName: string;
    longitude: string | null;
    latitude: string | null;
    location: string | null;
    timestamp: Date;
}