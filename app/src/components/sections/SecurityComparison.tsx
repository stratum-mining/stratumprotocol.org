import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";

// Simple message transition animation
const MessageTransition = ({ t }: { t: (key: string) => string }) => {
  return (
    <div className="relative h-48 w-full bg-black/20 rounded-lg border border-border overflow-hidden">
      {/* Split line */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-border" />

      {/* Labels */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <ShieldOff className="w-4 h-4 text-red-500" />
        <span className="text-xs sm:text-base font-mono text-red-500">{t("sections.securityComparison.v1Label")}</span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-xs sm:text-base font-mono text-cyan-500">{t("sections.securityComparison.v2Label")}</span>
        <Shield className="w-4 h-4 text-cyan-500" />
      </div>

      {/* Message animation */}
      <motion.div
        className="absolute top-[35%] sm:top-1/2 -translate-y-1/2"
        initial={{ left: "10%" }}
        animate={{ left: "90%" }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* V1 Message */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{
            opacity: [1, 1, 0, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.45, 0.55, 1]
          }}
        >
          <span className="px-3 py-1.5 rounded bg-red-500/10 border border-red-500/20 font-mono text-xs sm:text-base">
            ["myWorkerName", "mypwd"]
          </span>
        </motion.div>

        {/* V2 Message */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{
            opacity: [0, 0, 1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.45, 0.55, 1]
          }}
        >
          <span className="px-3 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-mono text-xs sm:text-base">
            🔒 a7x9•••f3d2
          </span>
        </motion.div>
      </motion.div>

      {/* Protocol descriptions */}
      <div className="absolute bottom-4 left-4 max-w-[40%]">
        <p className="text-xs sm:text-base text-muted-foreground">
          {t("sections.securityComparison.plaintextDescription")}
        </p>
      </div>
      <div className="absolute bottom-4 right-4 max-w-[40%] text-right">
        <p className="text-xs sm:text-base text-muted-foreground">
          {t("sections.securityComparison.encryptedDescription")}
        </p>
      </div>
    </div>
  );
};

export function SecurityComparison() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4 bg-muted/50">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">{t("sections.securityComparison.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            {t("sections.securityComparison.subtitle")}
          </p>
        </motion.div>

        <Card className="p-6">
          <MessageTransition t={t} />
        </Card>
      </div>
    </section>
  );
}