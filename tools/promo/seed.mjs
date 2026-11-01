export function makeStore(opts={}){
  const cid='democouple0123456789';
  const t=new Date();const pad=n=>String(n).padStart(2,'0');
  const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  const ym0=t.getFullYear()+'-'+pad(t.getMonth()+1);
  const day=(back)=>ds(new Date(t.getFullYear(),t.getMonth(),t.getDate()-back));
  const mon=(back,d)=>ds(new Date(t.getFullYear(),t.getMonth()-back,d));
  const next1=ds(new Date(t.getFullYear(),t.getMonth()+1,1));
  let n=0;const S={};
  const ex=(date,amount,payer,cat,memo,o={})=>{const id='e'+(++n)+'x'+Math.random().toString(36).slice(2,6);S[`couples/${cid}/expenses/${id}`]={id,date,amount,payer,cat,memo,method:'ratio',ratioA:70,amtA:0,kA:0,kB:0,pending:false,reflect:'',settled:false,by:payer,at:Date.now()-n*1000,...o};};
  ex(day(0),2480,'a','food','スーパーで買い物');
  ex(day(1),1580,'b','daily','洗剤とティッシュ');
  ex(day(2),6200,'b','eat','ふたりで焼肉',{method:'ratio',ratioA:50});
  ex(day(3),7340,'b','util','電気・ガス代');
  ex(day(5),3480,'a','food','週末のまとめ買い');
  ex(day(7),3200,'a','fun','映画とポップコーン',{ratioA:50});
  ex(day(9),5120,'b','food','コストコ');
  ex(day(1),3980,'a','daily','Amazon(カード払い)',{pending:true,reflect:next1});
  // past months (settled) for the chart
  [[1,[22000,14800,12950]],[2,[26500,18200,12600]],[3,[31000,19800,10200]],[4,[24800,21300,11200]],[5,[20300,16100,11800]]].forEach(([b,arr])=>{
    ['food','eat','daily'].forEach((c,i)=>ex(mon(b,8+i*6),arr[i],i%2?'b':'a',c,'',{settled:true}));
  });
  const sh=(id,name,cat,memo,by,o={})=>{S[`couples/${cid}/shopping/${id}`]={id,name,key:name,cat,memo,by,at:Date.now()-1000*(10-id.length),done:false,...o};};
  sh('s1','牛乳','food','2本','b');sh('s2','卵','food','','a');sh('s3','食パン','food','6枚切り','b');sh('s4','トイレットペーパー','daily','12ロール','a');sh('s5','食器用洗剤','daily','','b');
  sh('s6','バナナ','food','','a',{done:true,doneAt:Date.now()-3*864e5,doneBy:'a',doneDate:day(3),expensed:true});
  const hk=k=>{let h=2166136261;for(let i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,16777619);}return 'k'+(h>>>0).toString(36);};
  const st=(_,name,cat,backs,count)=>{const id=hk(name);S[`couples/${cid}/shopStats/${id}`]={id,key:name,name,cat,dates:backs.map(day).sort(),count};};
  st('k1','お米','food',[52,27,1],3);st('k2','しょうゆ','food',[70,38],2);st('k3','牛乳','food',[12,6],5);st('k4','納豆','food',[9,4],6);st('k5','ティッシュ','daily',[60,30],2);st('k6','バナナ','food',[10,3],4);
  S[`couples/${cid}/settlements/s1`]={id:'s1',date:mon(1,28),from:'b',to:'a',amount:18420};
  S[`couples/${cid}/fixedCosts/f1`]={id:'f1',cat:'rent',memo:'家賃',amount:78000,day:25,payer:'a',lastYm:ym0};
  S[`couples/${cid}/fixedCosts/f2`]={id:'f2',cat:'phone',memo:'スマホ・ネット',amount:9800,day:5,payer:'b',lastYm:ym0};
  S[`couples/${cid}`]={memberUids:opts.waiting?['u1']:['u1','u2'],members:{a:{name:'わたし',photo:null},b:{name:'パートナー',photo:null}},ratioA:70,
    budgets:{food:40000,eat:15000,daily:10000},cats:[{id:'cphone',name:'通信費',icon:'phone',color:'#228be6'}],
    ...(opts.waiting?{inviteCode:'K7Q4M2XD'}:{})};
  if(opts.fixedCat){}
  return {cid,store:S};
}
