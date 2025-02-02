import CoordinateParser from 'coordinate-parser';
import { Coordinates, decodeBase32, encodeBase32 } from 'geohashing';
import { ResponseFromGeoCode } from '../models/challenge.entities.js';
import { DataValidationError, NaverGeoCodeError } from '../errors.js';

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

export const getCoordinates = (data: string): Coordinates => {
    const result: Coordinates = decodeBase32(data);
    
    return result;
};

export const getReverseGeocode = async (hashed: string): Promise<string> => {
    const NAVER_ID = process.env.NAVER_ID;
    const NAVER_SECRET = process.env.NAVER_SECRET;

    if (!NAVER_ID || !NAVER_SECRET) {
        console.error('네이버 API 키가 설정되지 않았습니다.');
        throw new DataValidationError({reason: 'Invalid Naver API keys.'});
    }

    const coords: Coordinates = getCoordinates(hashed);
    const url: string = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${coords.lng},${coords.lat}&orders=addr&output=json`;

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-NCP-APIGW-API-KEY-ID': NAVER_ID,
            'X-NCP-APIGW-API-KEY': NAVER_SECRET,
        },
    });

    if (!response.ok) {
        throw new NaverGeoCodeError({reason: `API 요청 실패: ${response.statusText}`});
    }

    const data: ResponseFromGeoCode = await response.json() as ResponseFromGeoCode;

    if(data.status.code !== 0){
        throw new NaverGeoCodeError({reason: `네이버 API 호출 에러: ${data.status.code}`});
    }

    const result: string = `${data.results[0].region.area0.name} ${data.results[0].region.area1.name} ${data.results[0].region.area2.name} ${data.results[0].region.area3.name}`;
    
    return result;
};