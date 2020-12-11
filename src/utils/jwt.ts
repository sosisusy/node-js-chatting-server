import jwt, * as jwtu from "jsonwebtoken"
import config from "../config"

/**
 * JWT 토큰 생성 및 확인 유틸
 */
class JWT {
    private jwtKey: jwtu.Secret

    constructor() {
        this.jwtKey = process.env.JWT_KEY as jwtu.Secret
    }

    /**
     * 토큰 생성
     * @param payload 
     */
    sign(payload: string | object | Buffer) {
        return jwt.sign(payload, this.jwtKey, config.jwt.signOptions)
    }

    /**
     * 토큰 체크
     * @param token 
     */
    verify(token: string): string | object | null {
        try {
            return jwt.verify(token, this.jwtKey)
        } catch (e) {
            return null
        }
    }
}

export default new JWT()