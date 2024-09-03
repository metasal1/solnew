'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, ChevronLeft, CreditCard, Gift, Droplet, ExternalLink, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import * as web3 from '@solana/web3.js'
import QRCode from 'react-qr-code'
import ActionSheet from './ActionSheet'

interface SolanaGuideProps {
  onStepChange: (step: number) => void;
}

// CreateWalletPage component
function CreateWalletPage({ onWalletCreated }: { onWalletCreated: (address: string) => void }) {
  const [walletName, setWalletName] = useState('')
  const [wallet, setWallet] = useState<web3.Keypair | null>(null)
  const [email, setEmail] = useState('')

  const handleCreateWallet = () => {
    const newWallet = web3.Keypair.generate()
    setWallet(newWallet)
    console.log('Created new wallet:', newWallet.publicKey.toString())
    onWalletCreated(newWallet.publicKey.toString())
  }

  const handleEmailWallet = () => {
    if (!wallet) return;

    const publicKey = wallet.publicKey.toString()
    const privateKey = Buffer.from(wallet.secretKey).toString('hex')

    const subject = encodeURIComponent('My New Solana Wallet - KEEP THIS SAFE')
    const body = encodeURIComponent(
      `IMPORTANT: This email contains your wallet's private key. Keep it safe and never share it with anyone!\n\n` +
      `Wallet Name: ${walletName}\n` +
      `Public Address: ${publicKey}\n` +
      `Private Key: ${privateKey}\n\n` +
      `Please store this information securely and delete this email after saving the details.`
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="walletName">Wallet Name</Label>
        <Input
          id="walletName"
          placeholder="Enter a name for your wallet"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
        />
      </div>
      <Button
        className="w-full bg-[#9945FF] hover:bg-[#7D3AE0] text-white"
        onClick={handleCreateWallet}
      >
        Create Wallet
      </Button>
      {wallet && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-100 rounded-lg">
            <p className="text-sm font-semibold text-purple-800">Your Wallet Address:</p>
            <p className="text-xs font-mono break-all">{wallet.publicKey.toString()}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-[#14F195] hover:bg-[#10C77A] text-black"
            onClick={handleEmailWallet}
            disabled={!email}
          >
            Email Wallet Details to Myself
          </Button>
          <p className="text-sm text-red-600 font-semibold">
            Warning: Emailing private keys is not secure. This is for demonstration purposes only.
          </p>
        </div>
      )}
    </div>
  )
}

// GetSolPage component
function GetSolPage({ onSolObtained, walletAddress }: { onSolObtained: () => void, walletAddress: string }) {
  const [balance, setBalance] = useState<number | null>(null)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBalance()
  }, [walletAddress])

  const fetchBalance = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://mainnet.helius-rpc.com/?api-key=ff0d3523-6397-47bf-bf5d-acb7d765d5ff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletAddress]
        }),
      })
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error.message)
      }
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      setBalance(data.result.value / 1000000000)
    } catch (err) {
      setError('Failed to fetch balance. Please try again.')
      console.error('Error fetching balance:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuy = () => {
    console.log('Opening SOL purchase flow')
    onSolObtained()
  }

  const handleReceive = () => {
    setShowActionSheet(true)
  }

  const handleFaucet = () => {
    console.log('Requesting SOL from faucet')
    onSolObtained()
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-100 rounded-lg">
        <p className="text-lg font-semibold text-purple-800">Current Balance</p>
        {isLoading ? (
          <p className="text-3xl font-bold text-purple-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="text-3xl font-bold text-purple-600">{balance?.toFixed(4)} SOL</p>
        )}
        <Button
          onClick={fetchBalance}
          className="mt-2 bg-[#9945FF] hover:bg-[#7D3AE0] text-white"
          disabled={isLoading}
        >
          Refresh Balance
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Button
            className="w-full bg-[#14F195] hover:bg-[#10C77A] text-black"
            onClick={handleBuy}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Buy SOL
          </Button>
          <p className="mt-2 text-sm text-gray-600">Purchase SOL from an exchange or directly within some wallets.</p>
        </div>

        <div>
          <Button
            className="w-full bg-[#9945FF] hover:bg-[#7D3AE0] text-white"
            onClick={handleReceive}
          >
            <Gift className="mr-2 h-4 w-4" /> Receive SOL
          </Button>
          <p className="mt-2 text-sm text-gray-600">Receive SOL from another wallet or user.</p>
        </div>

        <div>
          <Button
            className="w-full bg-[#14F195] hover:bg-[#10C77A] text-black"
            onClick={handleFaucet}
          >
            <Droplet className="mr-2 h-4 w-4" /> Use Faucet (Testnet)
          </Button>
          <p className="mt-2 text-sm text-gray-600">Get free SOL on the testnet to experiment and develop.</p>
        </div>
      </div>

      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        walletAddress={walletAddress}
      />
    </div>
  )
}

// WalletNamePage component
function WalletNamePage({ onWalletNamed }: { onWalletNamed: () => void }) {
  const [name, setName] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const checkAvailability = () => {
    // Simulate API call to check name availability
    const mockAvailable = Math.random() > 0.5
    setIsAvailable(mockAvailable)
    if (mockAvailable) {
      onWalletNamed()
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="walletName">Wallet Name</Label>
        <Input
          id="walletName"
          placeholder="Enter desired wallet name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button
        onClick={checkAvailability}
        className="w-full bg-[#9945FF] hover:bg-[#7D3AE0] text-white"
      >
        Check Availability
      </Button>
      {isAvailable !== null && (
        <div className={`p-4 rounded-lg ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={isAvailable ? 'text-green-700' : 'text-red-700'}>
            {isAvailable ? `${name} is available!` : `${name} is not available.`}
          </p>
        </div>
      )}
    </div>
  )
}

// ExploreChainPage component
function ExploreChainPage() {
  const [solPrice, setSolPrice] = useState(0)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // Simulate fetching SOL price
    setSolPrice(Math.random() * 50 + 20) // Random price between $20 and $70

    // Simulate fetching recent transactions
    const mockTransactions = [
      { id: '0x1234...5678', type: 'Receive', amount: 1.5, date: '2023-06-01' },
      { id: '0x8765...4321', type: 'Send', amount: 0.5, date: '2023-05-30' },
      { id: '0x2468...1357', type: 'Swap', amount: 2.0, date: '2023-05-28' },
      { id: '0x1357...2468', type: 'Receive', amount: 0.75, date: '2023-05-25' },
    ]
    setTransactions(mockTransactions as never[])
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-white bg-opacity-90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#9945FF]">SOL Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <TrendingUp className="text-green-500 mr-2 h-8 w-8" />
            <span className="text-4xl font-bold">${solPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white bg-opacity-90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#9945FF]">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount (SOL)</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono">{tx.id}</TableCell>
                  <TableCell>
                    {tx.type === 'Receive' ? (
                      <span className="flex items-center text-green-500">
                        <ArrowDownRight className="mr-1 h-4 w-4" /> Receive
                      </span>
                    ) : tx.type === 'Send' ? (
                      <span className="flex items-center text-red-500">
                        <ArrowUpRight className="mr-1 h-4 w-4" /> Send
                      </span>
                    ) : (
                      <span className="flex items-center text-blue-500">
                        <ArrowUpRight className="mr-1 h-4 w-4" /> Swap
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{tx.amount} SOL</TableCell>
                  <TableCell>{tx.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Main SolanaGuide component
export const SolanaGuide: React.FC<SolanaGuideProps> = ({ onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [walletAddress, setWalletAddress] = useState('')
  const [walletCreated, setWalletCreated] = useState(false)
  const [solObtained, setSolObtained] = useState(false)
  const [walletNamed, setWalletNamed] = useState(false)

  const steps = [
    { title: "Welcome to sol.new", description: "Let's get you started with Solana!" },
    { title: "Create Wallet", description: "First, let's create your Solana wallet." },
    { title: "Get SOL", description: "Now, let's add some SOL to your wallet." },
    { title: "Get Wallet Name", description: "Let's give your wallet a unique name." },
    { title: "Explore The Chain", description: "Time to explore the Solana blockchain." },
    { title: "Find dApps", description: "Discover decentralized applications on Solana." },
    { title: "Mint NFT", description: "Create your first NFT on Solana." },
    { title: "Stake SOL", description: "Learn how to stake your SOL tokens." },
    { title: "Track Price", description: "Keep an eye on SOL price movements." },
    { title: "Share with Friends", description: "Invite your friends to join Solana." },
    { title: "Get Help", description: "Need assistance? We're here to help!" },
  ]

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleWalletCreated = (address: string) => {
    setWalletAddress(address)
    setWalletCreated(true)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Solana!</h2>
            <p className="mb-4">This guide will help you get started with Solana. We&apos;ll walk you through creating a wallet, getting some SOL, and more.</p>
            <Button onClick={handleNext} className="bg-[#9945FF] hover:bg-[#7D3AE0] text-white">
              Let&apos;s Get Started
            </Button>
          </div>
        )
      case 1:
        return <CreateWalletPage onWalletCreated={handleWalletCreated} />
      case 2:
        return <GetSolPage onSolObtained={() => setSolObtained(true)} walletAddress={walletAddress} />
      case 3:
        return <WalletNamePage onWalletNamed={() => setWalletNamed(true)} />
      case 4:
        return <ExploreChainPage />
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
            <p className="mb-4">{steps[currentStep].description}</p>
            <p className="text-gray-500">This step is not yet implemented in our demo.</p>
          </div>
        )
    }
  }

  useEffect(() => {
    onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
        <div className="mt-8">
          <p className="text-center text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-[#9945FF] h-2.5 rounded-full"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="border-[#9945FF] text-[#9945FF] hover:bg-[#9945FF] hover:text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 ||
            (currentStep === 1 && !walletCreated) ||
            (currentStep === 2 && !solObtained) ||
            (currentStep === 3 && !walletNamed)}
          className="bg-[#14F195] hover:bg-[#10C77A] text-black"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}