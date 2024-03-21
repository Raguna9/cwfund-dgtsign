import React, { useState, useEffect } from "react";
import { MdCircle } from "react-icons/md";
import { useWeb3 } from './Web3Provider';
import Identicons from 'react-identicons'

const UserEthAddress = () => {
    const [isConnected, setIsConnected] = useState(false);
    const { accounts } = useWeb3();
  
    useEffect(() => {
      const initializeWeb3 = async () => {
        if (typeof window.ethereum !== "undefined") {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setIsConnected(true);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error("Metamask not detected");
        }
      };
      initializeWeb3();
  
      if (isConnected) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            setIsConnected(false);
          } else {
            setIsConnected(true);
          }
        });
        return () => {
          window.ethereum.removeAllListeners("accountsChanged");
        };
      }
    }, [isConnected]);
    function formatAddress(address) {
        // Sesuaikan dengan panjang karakter yang diinginkan
        const truncatedAddress = address.substring(0, 7) + " . . . . " + address.slice(-5);
        return <span>{truncatedAddress}</span>;
      }
  return (
    <div className="hidden md:block">
      {isConnected ? (
        <div className="text-black mx-4 flex items-center">
          
          <Identicons
                className="rounded-full shadow-md mx-2"
                string={accounts[0]}
                size={18}
              />
              {formatAddress(accounts[0])}
          <MdCircle className="text-green-600 ml-1 h-3 m-auto" />
        </div>
      ) : (
        <div className="text-black mx-4 flex items-center">
          Not Connected
          <MdCircle className="text-red-600 ml-1 h-3 m-auto" />
        </div>
      )}

    </div>
  )
}

export default UserEthAddress