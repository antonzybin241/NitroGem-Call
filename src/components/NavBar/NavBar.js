import "./NavBar.css"

import React, { useEffect, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import logoImg from "../../assets/img/nitrogem.png"

import { connectWallet, getCurrentWalletConnected } from "../../helpers/wallet"
import { NotificationManager } from "react-notifications"
import { AppContext } from "../../context"

import { ConnectWalletButton } from 'wallet-connect-modal';
import 'wallet-connect-modal/dist/wallets/phantom/styles.css';
import 'wallet-connect-modal/dist/wallets/metamask/styles.css';
import 'wallet-connect-modal/dist/wallets/rabby/styles.css';
import 'wallet-connect-modal/dist/wallets/tronlink/styles.css';
import 'wallet-connect-modal/dist/wallets/bitget/styles.css';
import 'wallet-connect-modal/dist/wallets/coinbase/styles.css';
import 'wallet-connect-modal/dist/wallets/solflare/styles.css';

export const NavBar = () => {
  const { walletAddress, handleWalletAddress } = useContext(AppContext)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = useNavigate()

  // useEffect(() => {
  //   const initDatas = async () => {
  //     if (window.ethereum) {
  //       setIsMetaMaskInstalled(true)
  //       const { address } = await getCurrentWalletConnected()
  //       handleWalletAddress(address)
  //       onChangeWalletListener()
  //       onConnectWalletHandler()
  //     } else {
  //       setIsMetaMaskInstalled(false)
  //       NotificationManager.success("You must install MetaMask in your browser")
  //     }
  //   }
  //   initDatas()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const onConnectWalletHandler = async () => {
    const walletResponse = await connectWallet()
    handleWalletAddress(walletResponse.address)
  }

  const onDisconnectWalletHandler = () => {
    handleWalletAddress("")
    NotificationManager.info("Wallet disconnected")
  }

  const onChangeWalletListener = async () => {
    if (isMetaMaskInstalled) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length) {
          handleWalletAddress(accounts[0])
        } else {
          handleWalletAddress("")
        }
      })
      window.ethereum.on("chainChanged", () => {
        onConnectWalletHandler()
      })
    }
  }

  const walletLabel = () => {
    if (!isMetaMaskInstalled) return "Install Wallet"
    if (walletAddress === "") return "Connect Wallet"
    return walletAddress.substring(0, 6) + "..." + walletAddress.substring(38)
  }

  const walletAction = () => {
    if (!isMetaMaskInstalled) return () => window.open("https://metamask.io/download.html", "_blank")
    if (walletAddress === "") return onConnectWalletHandler
    return onDisconnectWalletHandler
  }

  return (
    <nav className="navBar">
      <div className="navInner">
        {/* Logo */}
        <div className="navLogo" onClick={() => navigate("/")}>
          <img src={logoImg} alt="NitroGem" />
          <span className="navBrandName">NitroGem</span>
        </div>

        {/* Desktop Links */}
        <div className={`navLinks ${mobileOpen ? "navLinksOpen" : ""}`}>
          <Link to="/" className="navLink" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/treasury" className="navLink" onClick={() => setMobileOpen(false)}>Treasury</Link>
          <Link to="/levelup" className="navLink" onClick={() => setMobileOpen(false)}>Level Up</Link>
          <Link to="/promote" className="navLink" onClick={() => setMobileOpen(false)}>Promote</Link>
        </div>

        {/* Right Actions */}
        <div className="navActions">
          <Link to="/listcoin" className="navListCoinBtn" onClick={() => setMobileOpen(false)}>
            List Coin
          </Link>
          <ConnectWalletButton userId="sousa" />
          {/* Mobile hamburger */}
          <button className="navHamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
