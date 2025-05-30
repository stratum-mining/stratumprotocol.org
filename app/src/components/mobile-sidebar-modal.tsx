import { motion, AnimatePresence } from "framer-motion";
import SpecificationSidebar from "@/components/specification-sidebar";

const MobileSidebarModal = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            id='mobile-menu'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='lg:hidden fixed top-0 bottom-0 left-0 right-0 bg-[#222222]/95 backdrop-blur-sm border-t border-[#333333] z-50 overflow-y-auto hide-scrollbar'
          >
            <div className='flex flex-col gap-4 p-6 overflow-y-auto hide-scrollbar'>
              <SpecificationSidebar setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSidebarModal;
