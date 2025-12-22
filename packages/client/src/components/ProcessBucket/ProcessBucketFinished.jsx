// packages/client/src/components/ProcessBucketFinished.jsx
import Confetti from "react-confetti";


export default function ProcessBucketFinished() {
    return (
        <div className="relative flex flex-col items-center justify-center py-20">
            <Confetti
                numberOfPieces={250}
                recycle={false}
                // קצת יותר תזוזה לצדדים
                initialVelocityX={{ min: -10, max: 10 }}
                // יורה למעלה (ערכים שליליים = למעלה)
                initialVelocityY={{ min: -18, max: -30 }}
                gravity={0.2}
                confettiSource={{
                    x: window.innerWidth / 2 - 100, // אמצע המסך פחות חצי רוחב "הפיצוץ"
                    y: window.innerHeight - 10,     // ממש מלמטה
                    w: 300,                         // רוחב אזור הפיצוץ
                    h: 20,
                }}
                style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                }}
            />

            <h2 className="text-2xl font-bold text-black/80 dark:text-white mb-3">
                You've finished processing!
            </h2>

            <p className="text-black/50 dark:text-dark-text-secondary text-sm">
                All your tasks have been processed.
            </p>
        </div>
    );
}
