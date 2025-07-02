import { error } from "console";
import rateLimit from "express-rate-limit";


// export const authRateLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, //10 minutes
//     max:100,
//     message:{
//         error: "Too many requests, please try again later.",
//     },
//     standardHeaders: true, //return rate limit info in the `ReateLimit-*' headers
//     legacyHeaders: false,  // disable the `X-RateLimit-*` headers 
// });


export const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max:100,
    message: { error : "too many login attempts Please wait for 5 minutes"},
    standardHeaders: true,
    legacyHeaders: false,
});