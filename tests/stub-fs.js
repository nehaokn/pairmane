// fake Firestore kept in memory (window.__store). Supports doc/collection refs, query(where ==, >=, <, array-contains),
// onSnapshot with docChanges 'added', getDoc/getDocs, set/update/delete, batches, deleteField and arrayUnion.
const store=window.__store=window.__store||{};const subs=[];
const P=(...x)=>({path:x.slice(1).join('/'),id:x[x.length-1]});
export const initializeFirestore=()=>({});export const persistentLocalCache=()=>({});export const persistentMultipleTabManager=()=>({});
export const doc=(a,...x)=>{ if(a&&a.path&&a.coll){return {path:a.path+'/'+x[0],id:x[0]};} return P(a,...x);};
export const collection=(a,...x)=>({path:x.join('/'),coll:true,id:x[x.length-1],filters:[]});
export const where=(f,op,v)=>({f,op,v});
export const query=(c,...w)=>({...c,filters:[...(c.filters||[]),...w]});
const pass=(d,fl)=>fl.every(({f,op,v})=>{const x=d[f];
  if(op==='==')return x===v;if(op==='>=')return x!==undefined&&x>=v;if(op==='<')return x!==undefined&&x<v;
  if(op==='array-contains')return Array.isArray(x)&&x.includes(v);return true;});
const notify=()=>subs.forEach(s=>s());
function snapDoc(path){return {exists:()=>path in store,data:()=>store[path]};}
function rows(ref){const pre=ref.path+'/';return Object.keys(store).filter(k=>k.startsWith(pre)&&!k.slice(pre.length).includes('/')&&pass(store[k],ref.filters||[]));}
const mk=(pre,k)=>({id:k.slice(pre.length),data:()=>store[k],metadata:{hasPendingWrites:false}});
export const onSnapshot=(ref,cb,err)=>{
  let prev=null;
  const f=()=>{
    if(!ref.coll)return cb(snapDoc(ref.path));
    const pre=ref.path+'/';const ks=rows(ref);
    const added=prev?ks.filter(k=>!prev.includes(k)):ks;prev=ks;
    cb({docs:ks.map(k=>mk(pre,k)),empty:!ks.length,docChanges:()=>added.map(k=>({type:'added',doc:mk(pre,k)}))});
  };
  subs.push(f);setTimeout(f,5);return()=>{};
};
export const getDoc=async(ref)=>snapDoc(ref.path);
export const getDocs=async(q)=>{const pre=q.path+'/';const ks=rows(q);return {empty:!ks.length,docs:ks.map(k=>mk(pre,k))};};
function merge(path,o){const cur=store[path]=store[path]||{};for(const k in o){if(k.includes('.')){const parts=k.split('.');let t=cur;for(let i=0;i<parts.length-1;i++){t[parts[i]]=t[parts[i]]||{};t=t[parts[i]];}const v=o[k];if(v&&v.__del)delete t[parts[parts.length-1]];else t[parts[parts.length-1]]=v;}else if(o[k]&&o[k].__union){cur[k]=[...(cur[k]||[]),o[k].__union];}else if(o[k]&&o[k].__del){delete cur[k];}else cur[k]=o[k];}}
export const setDoc=async(ref,o)=>{store[ref.path]=JSON.parse(JSON.stringify(o));notify();};
export const updateDoc=async(ref,o)=>{merge(ref.path,o);notify();};
export const deleteDoc=async(ref)=>{delete store[ref.path];notify();};
export const deleteField=()=>({__del:1});export const arrayUnion=(v)=>({__union:v});export const serverTimestamp=()=>1;
export const writeBatch=()=>{const ops=[];return {set:(r,o)=>ops.push(()=>{store[r.path]=JSON.parse(JSON.stringify(o))}),update:(r,o)=>ops.push(()=>merge(r.path,o)),delete:(r)=>ops.push(()=>delete store[r.path]),commit:async()=>{ops.forEach(f=>f());notify();}};};
