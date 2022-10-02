const puppeteer = require('puppeteer');
const spawn = require("child_process").spawn;

function playBeep() {
  const child = spawn("powershell.exe",[".\\beep.ps1"]);
  child.stdout.on("data",function(data){
      console.log("Powershell Data: " + data);
  });
  child.stderr.on("data",function(data){
      console.log("Powershell Errors: " + data);
  });
  child.on("exit",function(){
      console.log("Powershell Script finished");
  });
  child.stdin.end();
}

const dealy = (ms) => new Promise((r) => setTimeout(r, ms))

const forLook = [
  { month: 10, day: 10 },
  { month: 10, day: 11 },
];

for(const { month, day } of forLook) {
  const url = `https://ibe.belavia.by/select?journey=MSQEVN2022${month}${day}&adults=1&children=0&infants=0`;
  
  (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    while (true) {
      console.log('before delay');
      await dealy(3000);
      const el = await page.$('.offer');
      if (el) {
        console.log('has offer');
        playBeep();
      } else {
        console.log('no offer');
        await dealy(6000);
        await page.reload();
      }
    }
  })();
}
