import * as jwtu from "jsonwebtoken"

export default {
    // api 루트 URL
    apiPath: "/api",

    // JWT 생성 및 확인에 사용될 설정 목록
    jwt: {
        signOptions: {
            algorithm: "HS256",
            expiresIn: "1d",
        } as jwtu.SignOptions
    }
}