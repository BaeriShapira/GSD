import AIIcon from '../../assets/AI_ICON.svg'
import { IoIosRocket } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoMdNotifications } from "react-icons/io";

function Hero() {
  const features = [
    {
      icon: IoIosRocket,
      title: 'אוטמטי וללא מאמץ'
    },
    {
      icon: MdDashboard,
      title: 'השוואה לחוזה העסקה'
    },
    {
      icon: GiTakeMyMoney,
      title: 'השוואה לחוקי העסקה בישראל'
    },
    {
      icon: IoMdNotifications,
      title: 'התראות על חריגות'
    }
  ]

  return (
    <div className="text-center mb-8 md:mb-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-0">
        <div className="mb-1">
          להבין את התלוש. בלי כאב ראש.
        </div>
        <div className="text-[#ff0000] flex items-center justify-center gap-2 relative flex-wrap">
          <span>ובלי לאבד כסף.</span>
          <img src={AIIcon} alt="AI" className="h-4 sm:h-5 md:h-6 lg:h-7 inline-block shrink-0 relative -top-2 md:-top-3 -right-2 md:-right-4" />
        </div>
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-bold mb-8 md:mb-12 px-4">
        ניתוח חודשי, השוואה לחוזה, וזיהוי חריגות.
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-10 px-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="flex flex-col items-center text-center">
              <Icon className="text-2xl sm:text-3xl md:text-4xl text-white/80 mb-2 md:mb-3" />
              <h3 className="text-xs sm:text-sm md:text-base font-medium text-white leading-tight">
                {feature.title}
              </h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Hero
