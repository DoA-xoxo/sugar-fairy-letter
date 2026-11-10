import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/admin';
export async function POST(request){const {password}=await request.json();if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'비밀번호가 올바르지 않습니다.'},{status:401});await createAdminSession();return NextResponse.json({ok:true});}
