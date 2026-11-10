import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const {data,error}=await supabaseAdmin().from('site_settings').select('*').eq('id',1).single();
  if(error) return NextResponse.json({error:'설정을 불러오지 못했습니다.'},{status:500});
  return NextResponse.json({settings:data});
}

export async function PATCH(request){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const body=await request.json();
  const {publish_at,is_published}=body;
  const patch={};
  if(publish_at!==undefined) patch.publish_at=publish_at;
  if(is_published!==undefined){
    patch.is_published=Boolean(is_published);
    // 비공개로 되돌릴 때 과거 공개 예약이 다시 실행되지 않도록 예약도 초기화
    if(is_published===false) patch.publish_at=null;
  }
  const db=supabaseAdmin();
  const {error}=await db.from('site_settings').update(patch).eq('id',1);
  if(error) return NextResponse.json({error:'설정을 저장하지 못했습니다.'},{status:500});
  if(is_published!==undefined){
    const {error:letterError}=await db.from('letters').update({is_public:Boolean(is_published)});
    if(letterError) return NextResponse.json({error:'편지 공개 상태를 변경하지 못했습니다.'},{status:500});
  }
  return NextResponse.json({ok:true});
}
