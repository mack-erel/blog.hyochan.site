export function load() {
    // 환경변수에서 isPreview 가져오기 (없으면 기본값 0)
    const isPreview = process.env.isPreview === '1';
    
    return {
        isPreview
    };
}

export const prerender = true;