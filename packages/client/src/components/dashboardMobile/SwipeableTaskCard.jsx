import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import MobileCard from "../UI/MobileCard";

/**
 * Swipeable Task Card with animations
 * Swipe right → Complete (green)
 * Swipe left → Delete (red)
 */
export default function SwipeableTaskCard({ task, onComplete, onDelete, onEdit, children }) {
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isRemoving, setIsRemoving] = useState(false);

    const SWIPE_THRESHOLD = 80; // pixels needed to trigger action

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            // Only allow horizontal swipes
            if (Math.abs(eventData.deltaX) > Math.abs(eventData.deltaY)) {
                setSwipeOffset(eventData.deltaX);
            }
        },
        onSwiped: (eventData) => {
            const swipedRight = eventData.deltaX > SWIPE_THRESHOLD;
            const swipedLeft = eventData.deltaX < -SWIPE_THRESHOLD;

            if (swipedRight) {
                // Complete action
                handleComplete();
            } else if (swipedLeft) {
                // Delete action
                handleDelete();
            } else {
                // Return to original position
                setSwipeOffset(0);
            }
        },
        trackMouse: true,
        trackTouch: true,
    });

    const handleComplete = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onComplete(task.id);
        }, 300);
    };

    const handleDelete = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onDelete(task.id);
        }, 300);
    };

    // Calculate background color based on swipe
    const getBackgroundColor = () => {
        if (swipeOffset > 30) return "bg-green-100";
        if (swipeOffset < -30) return "bg-red-100";
        return "";
    };

    // Show action icon based on swipe direction
    const showCompleteIcon = swipeOffset > 30;
    const showDeleteIcon = swipeOffset < -30;

    return (
        <AnimatePresence>
            {!isRemoving && (
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: swipeOffset > 0 ? 100 : -100 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    {/* Background action indicators */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        {/* Complete indicator (left side) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showCompleteIcon ? 1 : 0 }}
                            className="flex items-center gap-2 text-green-600"
                        >
                            <Check className="w-6 h-6" />
                            <span className="font-semibold">Complete</span>
                        </motion.div>

                        {/* Delete indicator (right side) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showDeleteIcon ? 1 : 0 }}
                            className="flex items-center gap-2 text-red-600"
                        >
                            <span className="font-semibold">Delete</span>
                            <Trash2 className="w-6 h-6" />
                        </motion.div>
                    </div>

                    {/* Card content */}
                    <motion.div
                        {...handlers}
                        animate={{ x: swipeOffset }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`relative z-10 ${getBackgroundColor()} rounded-lg transition-colors`}
                    >
                        <MobileCard className="cursor-grab active:cursor-grabbing">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1" onClick={() => onEdit && onEdit(task)}>
                                    {children}
                                </div>
                            </div>
                        </MobileCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
