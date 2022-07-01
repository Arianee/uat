import { Given, Then } from "@cucumber/cucumber";
import { WalletConnectMockService } from "./services/walletConnect.service";

const wcService = WalletConnectMockService.getInstance();
const wallets:{[key:string]:string} = {}

Given("walletConnect connect to {selector}", async function (selectorName:any) {
  //@ts-ignore
  const element = await this.page.waitForSelector(selectorName, {
    visible: true,
    strict:true
  });
  //@ts-ignore
  const wcuriWithDeeplink = await element.getAttribute('data-wcuri');
  const wcUri = wcuriWithDeeplink.match(/wc:.*/)[0];
  wcService.connect(wcUri);
});


Given("_user wallet accepts wallet connect request on chain {int} and wallet {string}", function(chainId:number, alias:string){
  wcService.approveConnection(chainId, wallets[alias]);
})


Given("_user wallet accepts last personal signature", function(){
  wcService.personal_signLastPayload();
});

Given("_user has wallet {string} as {string}", function(mnemonic:string, alias:string){
  wallets[alias] = mnemonic;
})

Then("_user wait for session request", function(){
  return new Promise((resolve:(value:unknown)=>void, reject)=>{
    wcService.connector.on('session_request', async (error, payload) => {
      resolve(true);
    })
  })
})

Then("_user wait for personal signature request", function(){
  return new Promise((resolve, reject)=> {
    wcService.connector.on('call_request', async (erro: any, payload: any) => {
      if(payload.method === 'personal_sign'){
        resolve(true);
      }
    })
  })
})
