import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const {data,error}=await supabaseAdmin().from('letters').select('id,content,created_at,is_public').order('created_at',{ascending:false});
  if(error) return NextResponse.json({error:'편지 목록을 불러오지 못했습니다.'},{status:500});
  return NextResponse.json({letters:data});
}
export async function DELETE(request){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const {id}=await request.json();
  if(!id) return NextResponse.json({error:'편지를 찾을 수 없습니다.'},{status:400});
  const {error}=await supabaseAdmin().from('letters').delete().eq('id',id);
  if(error) return NextResponse.json({error:'삭제하지 못했습니다.'},{status:500});
  return NextResponse.json({ok:true});
}
