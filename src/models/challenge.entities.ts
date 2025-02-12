export interface BodyToLocationCreation {
    title: string | null;
    context: string;
    location: string;
    required: number;
}

export interface BodyToWeeklyCreation {
    title: string | null;
    context: string;
    challengeDate: Date;
    required: number;
}

export interface LocationChallengeCreation {
    userId: bigint;
    title: string | null;
    context: string;
    location: string;
    required: number;
}

export interface WeeklyChallengeCreation {
    userId: bigint;
    title: string | null;
    context: string;
    challengeDate: Date;
    required: number;
}

export interface ChallengeModify {
    id: string;
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
    status: number; //status 1 = created, 2 = accepted, 3 = completed
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

export interface ResponseFromWeeklyChallenge {
    id: string;
    userId: string;
    title: string;
    context: string;
    challengeDate: Date;
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

export interface ResponseFromGetByUserId {
    locationChallenge: {
        challengeLocation: string;
    } | null;
    dateChallenge: {
        challengeDate: Date;
    } | null;

    id: bigint;
    userId: bigint;
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

export interface ResponseFromGetByUserIdReform {
    id: string;
    userId: string;
    title: string;
    context: string;
    challengeLocation: string | undefined;
    challengeDate: Date | undefined;
    requiredCount: number;
    remainingCount: number;
    createdAt: Date;
    updatedAt: Date | null;
    acceptedAt: Date | null;
    completedAt: Date | null;
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

export interface ResponseFromGeoCode {
    status: {
        code: number;
        name: string;
        message: string;
    }
    results: {
        name: string
        code: {
            id: string;
            type: string;
            mappingId: string;
        }
        region: {
            area0: {
                name: string;
                coords: {
                    center: {
                        crs: string;
                        x: number;
                        y: number;
                    }
                }
                alias: string | null;
            }
            area1: {
                name: string;
                coords: {
                    center: {
                        crs: string;
                        x: number;
                        y: number;
                    }
                }
                alias: string | null;
            }
            area2: {
                name: string;
                coords: {
                    center: {
                        crs: string;
                        x: number;
                        y: number;
                    }
                }
                alias: string | null;
            }
            area3: {
                name: string;
                coords: {
                    center: {
                        crs: string;
                        x: number;
                        y: number;
                    }
                }
                alias: string | null;
            }
            area4: {
                name: string;
                coords: {
                    center: {
                        crs: string;
                        x: number;
                        y: number;
                    }
                }
                alias: string | null;
            }
        }
    }[]
}