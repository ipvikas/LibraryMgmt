// Pune Community Library - trial server. Node 18+, no npm packages. Data is stored in data.json.
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,ADMIN=(process.env.ADMIN_EMAIL||'admin@example.com').toLowerCase(),SHOW=process.env.SHOW_OTP==='1';
const FEE=1000,PEN=10,MAXD=15,DBF=path.join(__dirname,'data.json');
let db={users:[],otps:{},sessions:{},copies:[],wish:[],orders:[],loans:[],points:[],seq:1};
try{db=Object.assign(db,JSON.parse(fs.readFileSync(DBF)))}catch(e){}
const save=()=>fs.writeFileSync(DBF,JSON.stringify(db,null,1));
const nid=()=>db.seq++,today=()=>new Date().toISOString().slice(0,10),day=d=>Math.floor(new Date(d)/864e5);
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const bal=u=>db.points.filter(p=>p.uid===u).reduce((s,p)=>s+p.pts,0);
const addPts=(uid,pts,why)=>db.points.push({uid,pts,why,date:today()});
const user=i=>db.users.find(u=>u.id===i),copy=i=>db.copies.find(c=>c.id===i),order=i=>db.orders.find(o=>o.id===i),loan=i=>db.loans.find(l=>l.id===i);
const dueOf=l=>addDays(l.received,l.days+(l.ext?7:0)+(l.delay||0));
const lateOf=l=>Math.max(0,Math.min(MAXD,day(l.returned||today())-day(dueOf(l))));
const OPEN=['waiting','placed','shipped'];
const qlen=c=>db.orders.filter(o=>o.copyId===c.id&&OPEN.includes(o.status)).length;
function pickCopy(title,skip){const cs=db.copies.filter(c=>c.title===title&&c.status!=='archived'&&c.id!==skip);
  return cs.find(c=>c.status==='available'&&!qlen(c))||cs.sort((a,b)=>qlen(a)-qlen(b))[0]}
function promote(c){if(c.status==='archived')return;c.status='available';
  const n=db.orders.filter(o=>o.copyId===c.id&&o.status==='waiting').sort((a,b)=>a.id-b.id)[0];
  if(n){n.status='placed';c.status='reserved'}
  else if(c.holder.type==='reader'&&!db.loans.some(l=>l.copyId===c.id&&!l.returned))c.holder={type:'buffer'}}
function refresh(){db.loans.forEach(l=>{l.late=lateOf(l);l.penalty=l.late*PEN;const u=user(l.uid);
  if(!l.returned&&u&&u.status==='active'&&l.late>10)u.status='suspended';l.flag15=!l.returned&&l.late>=15})}
const party=p=>{const u=p.type==='buffer'?db.users.find(x=>x.role==='admin'):user(p.uid);if(!u)return{};
  const m=/^https?:\/\//.test(u.map||'')?u.map:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((u.society||'')+' '+(u.pin||'')+' Pune');
  return{name:u.name,mobile:u.mobile,society:u.society,pin:u.pin,maps:m}};
const R={};
R['POST /api/otp']=(u,b)=>{const e=String(b.email||'').trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(e))throw'Enter a valid email address';
  const code=String(crypto.randomInt(100000,1000000));db.otps[e]={code,exp:Date.now()+6e5,tries:0};
  console.log('OTP for '+e+': '+code);return SHOW?{ok:1,devOtp:code}:{ok:1}};
R['POST /api/login']=(u,b)=>{const e=String(b.email||'').trim().toLowerCase(),o=db.otps[e];
  if(!o||o.exp<Date.now()||++o.tries>5)throw'OTP expired or too many attempts. Request a new OTP.';
  if(o.code!==String(b.otp))throw'Wrong OTP';delete db.otps[e];
  let x=db.users.find(v=>v.email===e);
  if(!x){x={id:nid(),email:e,name:b.name||e,role:e===ADMIN?'admin':(b.role==='donor'?'donor':'reader'),status:'active',addr:e===ADMIN?'none':'none'};db.users.push(x)}
  if(x.status!=='active')throw'This account is '+x.status+'. Contact the admin.';
  const t=crypto.randomBytes(24).toString('hex');db.sessions[t]=x.id;return{token:t}};
R['POST /api/profile']=(u,b)=>{if(!/^\d{6}$/.test(b.pin||''))throw'Enter a 6-digit Pune PIN code';
  if(!b.society||!b.mobile)throw'Society name and mobile number are required';
  Object.assign(u,{name:b.name||u.name,mobile:String(b.mobile),society:b.society,pin:b.pin,map:b.map||'',addr:u.role==='admin'?'ok':'pending'});return{ok:1}};
R['GET /api/catalogue']=()=>{const m={};db.copies.filter(c=>c.status!=='archived').forEach(c=>{const k=c.title.toLowerCase();
  m[k]=m[k]||{title:c.title,category:c.category,available:0};if(c.status==='available')m[k].available++});return Object.values(m)};
R['POST /api/donate']=(u,b)=>{if(u.role!=='donor')throw'Only donors can donate books';if(u.addr!=='ok')throw'The admin must validate your address first';
  if(!b.title||!b.category)throw'Book name and category are required';
  db.copies.push({id:nid(),title:b.title.trim(),category:b.category.trim(),status:'available',donor:u.id,holder:{type:'donor',uid:u.id}});return{ok:1}};
R['POST /api/wish']=(u,b)=>{if(!b.title)throw'Enter a book title';db.wish.push({id:nid(),uid:u.id,title:b.title.trim(),date:today()});return{ok:1}};
R['POST /api/order']=(u,b)=>{if(u.role!=='reader')throw'Only readers can order books';if(u.addr!=='ok')throw'The admin must validate your address first';
  const days=Math.floor(+b.days);if(!(days>=1))throw'Enter the number of days you want to keep the book';
  const c=pickCopy(b.title);if(!c)throw'No copy of this title exists yet. Add it to your wishlist.';
  const pts=Math.max(0,Math.min(Math.floor(+b.points||0),bal(u.id),FEE)),upi=FEE-pts;
  if(upi>0&&!b.upiRef)throw'Pay Rs '+upi+' by UPI to the admin and enter the payment reference';
  const free=c.status==='available'&&!qlen(c);if(pts)addPts(u.id,-pts,'Order fee');
  db.orders.push({id:nid(),uid:u.id,title:c.title,copyId:c.id,days,pts,upi,upiRef:b.upiRef||'',verified:upi===0,status:free?'placed':'waiting',created:today()});
  if(free)c.status='reserved';return{ok:1}};
R['POST /api/cancel']=(u,b)=>{const o=order(+b.orderId);if(!o||o.uid!==u.id)throw'Order not found';
  if(!['waiting','placed'].includes(o.status))throw'This order has been shipped and cannot be cancelled';
  const was=o.status;o.status='cancelled';addPts(u.id,FEE,'Order cancelled');if(was==='placed')promote(copy(o.copyId));return{ok:1}};
R['POST /api/extend']=(u,b)=>{const l=loan(+b.loanId);if(!l||l.uid!==u.id||l.returned)throw'Loan not found';
  if(l.ext)throw'The one-week extension was already used';l.ext=true;return{ok:1}};
R['GET /api/me']=u=>({user:{id:u.id,email:u.email,name:u.name,role:u.role,mobile:u.mobile,society:u.society,pin:u.pin,map:u.map,addr:u.addr},points:bal(u.id),
  orders:db.orders.filter(o=>o.uid===u.id).map(o=>({id:o.id,title:o.title,status:o.status,verified:o.verified})),
  loans:db.loans.filter(l=>l.uid===u.id).map(l=>{const d=day(dueOf(l))-day(today());return{id:l.id,title:copy(l.copyId).title,due:dueOf(l),ext:l.ext,returned:l.returned,late:l.late,penalty:l.penalty,remind:!l.returned&&d>=0&&d<=2}}),
  wish:db.wish.filter(w=>w.uid===u.id).map(w=>w.title),
  mine:db.copies.filter(c=>c.donor===u.id).map(c=>({title:c.title,status:c.status==='archived'?'archived':c.holder.type==='donor'?'at your home':'with the library'}))});
// ---- admin ----
R['GET /api/admin/state']=()=>({
  pending:db.users.filter(x=>x.addr==='pending').map(x=>({id:x.id,name:x.name,role:x.role,mobile:x.mobile,society:x.society,pin:x.pin,maps:party({uid:x.id}).maps})),
  orders:db.orders.filter(o=>OPEN.includes(o.status)).map(o=>{const c=copy(o.copyId);return{id:o.id,title:o.title,status:o.status,upi:o.upi,upiRef:o.upiRef,verified:o.verified,copyStatus:c.status,from:party(c.holder),to:party({uid:o.uid})}}),
  loans:db.loans.map(l=>({id:l.id,reader:(user(l.uid)||{}).email,title:copy(l.copyId).title,due:dueOf(l),returned:l.returned,late:l.late,penalty:l.penalty,paid:l.paid,flag15:l.flag15,blacklisted:l.blacklisted})),
  copies:db.copies.map(c=>({id:c.id,title:c.title,status:c.status,at:c.holder.type})),
  blacklisted:db.users.filter(x=>x.status==='blacklisted').map(x=>({id:x.id,email:x.email}))});
R['POST /api/admin/validate']=(u,b)=>{user(+b.userId).addr=b.ok?'ok':'rejected';return{ok:1}};
R['POST /api/admin/verify']=(u,b)=>{order(+b.orderId).verified=true;return{ok:1}};
R['POST /api/admin/ship']=(u,b)=>{const o=order(+b.orderId);if(o.status!=='placed'||!o.verified)throw'The order must be ready and its UPI payment verified';o.status='shipped';return{ok:1}};
R['POST /api/admin/deliver']=(u,b)=>{const o=order(+b.orderId);if(o.status!=='shipped')throw'Mark the order as shipped first';const c=copy(o.copyId);
  o.status='delivered';c.status='with reader';c.holder={type:'reader',uid:o.uid};
  db.loans.push({id:nid(),uid:o.uid,copyId:c.id,orderId:o.id,days:o.days,received:b.date||today(),ext:false,delay:0,returned:null});return{ok:1}};
R['POST /api/admin/collect']=(u,b)=>{const l=loan(+b.loanId);l.returned=b.date||today();promote(copy(l.copyId));return{ok:1}};
R['POST /api/admin/courierdelay']=(u,b)=>{const l=loan(+b.loanId),n=Math.floor(+b.days);if(!(n>=1))throw'Enter the delay in days';l.delay=(l.delay||0)+n;return{ok:1}};
R['POST /api/admin/clearpenalty']=(u,b)=>{const l=loan(+b.loanId);if(!l.returned)throw'Record the courier collection first';l.paid=true;const x=user(l.uid);
  if(x.status==='suspended'&&!db.loans.some(v=>v.uid===x.id&&v.returned&&v.penalty>0&&!v.paid))x.status='active';return{ok:1}};
R['POST /api/admin/blacklist']=(u,b)=>{const l=loan(+b.loanId);if(l.returned||l.late<15)throw'The book must be unreturned for 15 days';
  user(l.uid).status='blacklisted';l.blacklisted=true;Object.keys(db.sessions).forEach(t=>{if(db.sessions[t]===l.uid)delete db.sessions[t]});return{ok:1}};
R['POST /api/admin/archive']=(u,b)=>{const c=copy(+b.copyId);c.status='archived';
  db.orders.filter(o=>o.copyId===c.id&&['waiting','placed'].includes(o.status)).forEach(o=>{const a=pickCopy(o.title,c.id);
    if(a){const free=a.status==='available'&&!qlen(a);o.copyId=a.id;if(free){a.status='reserved';o.status='placed'}else o.status='waiting'}
    else{o.status='unfulfilled';addPts(o.uid,FEE,'Order unfulfilled')}});return{ok:1}};
R['POST /api/admin/reregister']=(u,b)=>{const x=user(+b.userId),l=x&&db.loans.find(v=>v.uid===x.id&&v.blacklisted);
  if(!x||x.status!=='blacklisted'||!l)throw'This person is not on the blacklist';
  if(day(today())<day(dueOf(l))+15)throw'Not eligible yet: 15 days from the due date have not passed';
  if(!l.returned)throw'The issued copy has not been collected';if(!l.paid)throw'Outstanding dues are not cleared';
  x.status='active';l.blacklisted=false;const c=copy(l.copyId);if(c.status==='archived'){c.status='available';promote(c)}return{ok:1}};
// ---- http ----
const J=(res,code,o)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
http.createServer((req,res)=>{
  if(req.method==='GET'&&!req.url.startsWith('/api')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(fs.readFileSync(path.join(__dirname,'index.html')))}
  let body='';req.on('data',c=>{body+=c;if(body.length>1e5)req.destroy()});
  req.on('end',()=>{try{const url=req.url.split('?')[0],key=req.method+' '+url,h=R[key];if(!h)throw'Not found';
    const b=body?JSON.parse(body):{};refresh();
    const t=(req.headers.authorization||'').replace('Bearer ','');let u=db.sessions[t]?user(db.sessions[t]):null;
    if(!/\/(otp|login)$/.test(url)){if(!u||u.status!=='active')throw'Please log in';if(url.startsWith('/api/admin')&&u.role!=='admin')throw'Admin only'}
    const out=h(u,b);save();J(res,200,out)}catch(e){J(res,400,{error:typeof e==='string'?e:'Something went wrong. Check the input and try again.'})}})
}).listen(PORT,()=>console.log('Library running at http://localhost:'+PORT));
