import React from 'react';
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import QRCode from 'react-qr-code'

interface ActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
}

const ActionSheet: React.FC<ActionSheetProps> = ({ isOpen, onClose, walletAddress }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
            <div className="bg-white w-full max-w-md rounded-t-2xl p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Receive SOL</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <QRCode value={walletAddress} size={200} />
                    <p className="text-sm font-mono break-all">{walletAddress}</p>
                    <Button className="w-full" onClick={() => navigator.clipboard.writeText(walletAddress)}>
                        Copy Address
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ActionSheet;