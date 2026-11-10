import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const COOKIE='sugar_fairy_admin';
function secret(){const v=process.env.ADMIN_SESSION_SECRET;if(!v||v.length<32)throw new Error('ADMIN_SESSION_SECRET은 32자 이상이어야 합니다.');return new TextEncoder().encode(v);}
export async function createAdminSession(){const token=await new SignJWT({role:'admin'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(secret());const jar=await cookies();jar.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});}
export async function isAdmin(){try{const jar=await cookies();const token=jar.get(COOKIE)?.value;if(!token)return false;const {payload}=await jwtVerify(token,secret());return payload.role==='admin';}catch{return false;}}
export async function clearAdminSession(){const jar=await cookies();jar.delete(COOKIE);}
