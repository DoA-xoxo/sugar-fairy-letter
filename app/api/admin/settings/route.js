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
  try {
    const body=await request.json();
    const {publish_at,is_published}=body;
    const patch={};
    if(publish_at!==undefined) patch.publish_at=publish_at;
    if(is_published!==undefined){
      patch.is_published=Boolean(is_published);
      if(is_published===false) patch.publish_at=null;
    }
    if(!Object.keys(patch).length) return NextResponse.json({error:'변경할 설정이 없습니다.'},{status:400});

    const db=supabaseAdmin();

    // 편지 전체 공개/비공개 변경은 반드시 실제 행 필터를 지정해 실행합니다.
    // 설정을 먼저 바꾸면 편지 업데이트 실패 시 화면 상태가 서로 달라질 수 있어 편지를 먼저 처리합니다.
    if(is_published!==undefined){
      const {error:letterError}=await db
        .from('letters')
        .update({is_public:Boolean(is_published)})
        .not('id','is',null);
      if(letterError) return NextResponse.json({error:'편지 공개 상태를 변경하지 못했습니다. Supabase letters 테이블의 is_public 컬럼과 권한을 확인해 주세요.'},{status:500});
    }

    const {data:settings,error:settingsError}=await db.from('site_settings').update(patch).eq('id',1).select('id').maybeSingle();
    if(settingsError) return NextResponse.json({error:'편지 상태는 처리했지만 사이트 공개 설정을 저장하지 못했습니다.'},{status:500});
    if(!settings) return NextResponse.json({error:'사이트 설정(id=1)을 찾을 수 없습니다. Supabase site_settings 테이블을 확인해 주세요.'},{status:404});

    return NextResponse.json({ok:true});
  } catch {
    return NextResponse.json({error:'요청을 처리하지 못했습니다.'},{status:500});
  }
}
