import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const {data,error}=await supabaseAdmin().from('letters').select('id,content,created_at,is_public').order('created_at',{ascending:false});
  if(error) return NextResponse.json({error:'편지 목록을 불러오지 못했습니다.'},{status:500});
  return NextResponse.json({letters:data});
}
export async function PATCH(request){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const body=await request.json();
  const {id,content,is_public}=body;
  if(!id) return NextResponse.json({error:'편지를 찾을 수 없습니다.'},{status:400});
  const patch={};
  if(content!==undefined){
    if(typeof content!=='string'||!content.trim()||content.length>500) return NextResponse.json({error:'편지 내용은 1~500자로 입력해 주세요.'},{status:400});
    patch.content=content.trim();
  }
  if(is_public!==undefined) patch.is_public=Boolean(is_public);
  if(!Object.keys(patch).length) return NextResponse.json({error:'변경할 내용이 없습니다.'},{status:400});
  const db=supabaseAdmin();
  const {error}=await db.from('letters').update(patch).eq('id',id);
  if(error) return NextResponse.json({error:'편지를 수정하지 못했습니다.'},{status:500});
  if(is_public===true){
    const {error:settingsError}=await db.from('site_settings').update({is_published:true}).eq('id',1);
    if(settingsError) return NextResponse.json({error:'공개 상태를 저장하지 못했습니다.'},{status:500});
  }
  return NextResponse.json({ok:true});
}
export async function DELETE(request){
  if(!(await isAdmin())) return NextResponse.json({error:'인증이 필요합니다.'},{status:401});
  const {id}=await request.json();
  if(!id) return NextResponse.json({error:'편지를 찾을 수 없습니다.'},{status:400});
  const {error}=await supabaseAdmin().from('letters').delete().eq('id',id);
  if(error) return NextResponse.json({error:'삭제하지 못했습니다.'},{status:500});
  return NextResponse.json({ok:true});
}
