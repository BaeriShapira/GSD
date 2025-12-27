import AIIcon from '../../assets/AI_ICON.svg'

function Hero() {
  return (
    <div className="text-center mb-16">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
        <div className="whitespace-nowrap mb-1">
          להבין את התלוש. בלי כאב ראש.
        </div>
        <div className="text-[#ff0000] flex items-center justify-center gap-2 relative">
          <span>ובלי לאבד כסף.</span>
          <img src={AIIcon} alt="AI" className="h-5 md:h-6 lg:h-7 inline-block shrink-0 relative -top-3 -right-4" />
        </div>
      </h1>
      <p className="text-xl md:text-2xl text-white/90 font-bold mb-12">
        ניתוח חודשי, השוואה לחוזה, וזיהוי חריגות.
      </p>
    </div>
  )
}

export default Hero
