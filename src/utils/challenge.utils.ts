import CoordinateParser from 'coordinate-parser';
import { encodeBase32 } from 'geohashing';

export const getIdNumber = (data: {id: string}): bigint => {
    return BigInt(data.id);
};

export const getHashedLocation = (data: string): string => {
    const position: CoordinateParser = new CoordinateParser(data);

    const geoHash = encodeBase32(position.getLatitude(), position.getLongitude());

    if(geoHash.length > 6){    //geoHash값이 6자리 초과로 넘어가면 구역이 너무 작게 세분화됨
        return geoHash.substring(0, 6);
    }

    return geoHash;
};