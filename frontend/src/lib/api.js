const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export async function api(path, options={}) {
 const res=await fetch(`${base}/api${path}`,{
  ...options, credentials:'include', headers:{'Content-Type':'application/json',...(options.headers||{})},
 });
 const data=await res.json().catch(()=>({}));
 if(!res.ok) {const err=new Error(data.error || `HTTP ${res.status}`);err.status=res.status;throw err;}
 return data;
}
