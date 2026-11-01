import {session,OUT,srv} from './cap.mjs';
const {b,pg}=await session();
const shot=async n=>{await pg.waitForTimeout(400);await pg.screenshot({path:`${OUT}/${n}.png`});};
await pg.click('[data-act=tab][data-v=shop]');await shot('shop1');
await pg.click('.item:has-text("牛乳") [data-act=sh-check]');await pg.click('.item:has-text("卵") [data-act=sh-check]');await pg.click('.item:has-text("食パン") [data-act=sh-check]');
await pg.evaluate(()=>window.scrollTo(0,0));await shot('shop2');
await pg.click('[data-act=sh-expense]');await pg.fill('#f-amount','1280');
await pg.evaluate(()=>{const e=document.querySelector('#f-memo');e.scrollIntoView({block:'center'});});await shot('shop3');
await b.close();srv.close();
