import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { usePrivy } from "@privy-io/react-auth";
import { useFundWallet } from "@privy-io/react-auth/solana";
import Link from "next/link";

export const PaymentTab = () => {
    const { user, linkWallet, unlinkWallet } = usePrivy();
    const { fundWallet } = useFundWallet();
  
    const handlerFundWallet = async (address: string) => {
      await fundWallet(address,
        {
          cluster: { name: "devnet" },
          amount: "0.1",
        }
      );
    }
    return (
      <>
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Wallets</h3>
          <div className="flex justify-end mb-4">
            <button
              onClick={linkWallet}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg font-medium transition-colors"
            >
              + Connect Wallet
            </button>
          </div>
          {
            user?.linkedAccounts.map((account) => {
              if (account.type === "wallet") {
                return (
                  <div key={account.address} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex text-gray-900 dark:text-white font-medium">
                          <Link href={`/wallet/${account.address}`} className="mr-2 hover:text-primary">
                            {account.address.slice(0, 6)}...{account.address.slice(-4)}
                          </Link>
                          <DocumentDuplicateIcon className="w-4 h-4 cursor-pointer" onClick={() => navigator.clipboard.writeText(account.address)} />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Connected</div>
                      </div>
                    </div>
                    <div className='flex flex-col items-end'>
                      {
                        account.connectorType !== "embedded" &&
                        <button onClick={() => unlinkWallet(account.address)} className="text-primary hover:text-primary-dark">
                          Unlinked Wallet
                        </button>
                      }
                      <button
                        onClick={() => handlerFundWallet(account.address)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Funding Wallet
                      </button>
                    </div>
                  </div>
                )
              }
              else {
                return null;
              }
            })
          }
  
  
  
        </div>
  
        {/* <div className="absolute h-screen w-screen backdrop-blur-md top-0 left-0">
            <div className="absolute -translate-1/2 top-1/2 left-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fund Wallet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Fund your wallet with SOL to start using our services.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  value={dialogFoundWallet.address}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
                <button
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                  onClick={() => }
                >
                  Fund
                </button>
  
              </div>
            </div>
          </div> */}
      </>
    );
  };