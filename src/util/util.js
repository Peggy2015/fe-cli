
export const to = p => p.then(data => [null, data]).catch(err => [err, null]);

export async function waitTime(time){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    },time);
  });
}
