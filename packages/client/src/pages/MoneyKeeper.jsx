import Hero from '../components/MoneyKeeper/Hero'
import Features from '../components/MoneyKeeper/Features'
import SignupButton from '../components/MoneyKeeper/SignupButton'
import MoneyKeeperLogo from '../assets/MK_LOGO_WHITE.svg'

function MoneyKeeper() {
  return (
    <div className="min-h-screen bg-[#360606]" dir="rtl">
      <div style={{
        background: 'linear-gradient(110deg, rgba(54, 6, 6, 1) 0%, rgba(94, 17, 17, 1) 30%, rgba(149, 57, 57, 1) 69%, rgba(183, 81, 81, 1) 91%, rgba(201, 94, 94, 1) 100%)'
      }}>
        <header className="p-6">
          <div className="container mx-auto flex justify-end">
            <img src={MoneyKeeperLogo} alt="Money Keeper" className="h-12 md:h-14" />
          </div>
        </header>
        <div className="flex items-center justify-center py-12 px-6">
          <div className="max-w-4xl w-full">
            <Hero />
          </div>
        </div>
      </div>
      <div className="py-12 px-6">
        <div className="max-w-4xl w-full mx-auto">
          <Features />
          <SignupButton />
        </div>
      </div>
    </div>
  )
}

export default MoneyKeeper
