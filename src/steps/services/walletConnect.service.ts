import WalletConnect from "@walletconnect/client";
import { ethers, Wallet } from "ethers";


export class WalletConnectMockService {
  private static instance: WalletConnectMockService;
  public connector!:WalletConnect;
  private lastRequestPayload:any;
  private wallet!:Wallet;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() { }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): WalletConnectMockService {
    if (!WalletConnectMockService.instance) {
      WalletConnectMockService.instance = new WalletConnectMockService();
    }

    return WalletConnectMockService.instance;
  }

  public connect(uri:string){
    this.connector = new WalletConnect({uri});
    this.connector.on('session_request', async (error, payload) => {

    })
    this.connector.on('call_request', async (error, payload: any) => {
      this.lastRequestPayload = payload;
    });
  }


  public approveConnection(chain:number, mnemonic:string){
    this.wallet = ethers.Wallet.fromMnemonic(mnemonic);
    this.connector.approveSession({
      chainId: chain,
      accounts: [
        this.wallet.address
      ]
    });
  }

  public personal_signLastPayload(){
    let data: string | Uint8Array = this.lastRequestPayload.params[0].startsWith('0x') ? ethers.utils.arrayify(this.lastRequestPayload.params[0]) : this.lastRequestPayload.params[0];
    this.connector.approveRequest({
      id: this.lastRequestPayload.id,
      result: this.wallet.signMessage(data)
    });
  }


}
