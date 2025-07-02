import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Lock, Unlock } from "lucide-react";
import { useTranslation } from "react-i18next";

type Transaction = {
  id: number;
  fee: number;
  feePervB: number;
  hidden?: boolean;
};

const TransactionBlock = ({ 
  tx, 
  isSelected, 
  isHidden,
  onClick,
  isInteractive,
  t
}: { 
  tx: Transaction;
  isSelected: boolean;
  isHidden: boolean;
  onClick: () => void;
  isInteractive: boolean;
  t: (key: string) => string;
}) => {
  return (
    <motion.div
      onClick={isInteractive ? onClick : undefined}
      className={`
        relative p-4 rounded-sm border transition-all duration-300
        ${isInteractive ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-not-allowed'}
        ${isSelected ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-800 bg-black/20'}
        ${isHidden ? 'opacity-20' : 'opacity-100'}
      `}
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
    >
      <div className="flex flex-col gap-2 font-mono text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t("transactionControl.feeRate")}</span>
          <span className={isSelected ? 'text-cyan-500' : 'text-muted-foreground'}>
            {tx.feePervB} sat/vB
          </span>
        </div>
        <div className="text-right">
          <span className={isSelected ? 'text-cyan-500' : 'text-muted-foreground'}>
            {tx.fee.toFixed(8)} BTC
          </span>
        </div>
      </div>

      {!isInteractive && isHidden && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-sm flex items-center justify-center">
          <span className="text-xs text-red-500 font-mono">{t("transactionControl.hidden")}</span>
        </div>
      )}

      {isSelected && isInteractive && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full" />
      )}
    </motion.div>
  );
};

const FeeDisplay = ({ totalFees, isInteractive, t }: { totalFees: number; isInteractive: boolean; t: (key: string) => string }) => (
  <div className={`flex items-center justify-between p-4 rounded-sm border ${
    isInteractive ? 'border-cyan-500/20' : 'border-gray-800'
  }`}>
    <span className="text-sm font-mono text-muted-foreground">{t("transactionControl.totalFees")}</span>
    <span className={`text-sm font-mono ${isInteractive ? 'text-cyan-500' : 'text-muted-foreground'}`}>
      {totalFees.toFixed(8)} BTC
    </span>
  </div>
);

export function TransactionControl() {
  const { t } = useTranslation();
  const [selectedTxs, setSelectedTxs] = useState<number[]>([]);

  const transactions = [
    { id: 1, fee: 0.00025, feePervB: 10, hidden: true },
    { id: 2, fee: 0.00045, feePervB: 15 },
    { id: 3, fee: 0.00015, feePervB: 10, hidden: true },
    { id: 4, fee: 0.00060, feePervB: 30 },
    { id: 5, fee: 0.00035, feePervB: 20 },
    { id: 6, fee: 0.00055, feePervB: 25 },
  ].sort((a, b) => b.feePervB - a.feePervB);

  // Pool pre-selects visible transactions with lower fees
  const poolSelectedTxs = transactions
    .filter(tx => !tx.hidden)
    .slice(1, 4)
    .map(tx => tx.id);

  const calculateTotalFees = (txIds: number[]) => {
    return transactions
      .filter(tx => txIds.includes(tx.id))
      .reduce((sum, tx) => sum + tx.fee, 0);
  };

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">{t("transactionControl.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("transactionControl.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pool-Controlled */}
          <Card className="p-6 bg-black/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-mono mb-2">{t("transactionControl.currentReality.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("transactionControl.currentReality.description")}
                </p>
              </div>
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {transactions.map(tx => (
                <TransactionBlock
                  key={tx.id}
                  tx={tx}
                  isSelected={poolSelectedTxs.includes(tx.id)}
                  isHidden={tx.hidden || false}
                  onClick={() => {}}
                  isInteractive={false}
                  t={t}
                />
              ))}
            </div>

            <FeeDisplay 
              totalFees={calculateTotalFees(poolSelectedTxs)}
              isInteractive={false}
              t={t}
            />
          </Card>

          {/* Miner-Controlled */}
          <Card className="p-6 bg-black/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-mono mb-2">{t("transactionControl.withStratumV2.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("transactionControl.withStratumV2.description")}
                </p>
              </div>
              <Unlock className="w-6 h-6 text-cyan-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {transactions.map(tx => (
                <TransactionBlock
                  key={tx.id}
                  tx={tx}
                  isSelected={selectedTxs.includes(tx.id)}
                  isHidden={false}
                  onClick={() => {
                    setSelectedTxs(prev => 
                      prev.includes(tx.id) 
                        ? prev.filter(id => id !== tx.id)
                        : [...prev, tx.id]
                    );
                  }}
                  isInteractive={true}
                  t={t}
                />
              ))}
            </div>

            <FeeDisplay 
              totalFees={calculateTotalFees(selectedTxs)}
              isInteractive={true}
              t={t}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}