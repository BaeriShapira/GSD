import AppHeader from '../components/MoneyKeeper/AppHeader'
import EmploymentContract from '../components/MoneyKeeper/EmploymentContract'
import PayslipAnalysis from '../components/MoneyKeeper/PayslipAnalysis'

function MoneyKeeperApp() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AppHeader />

      <main className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6">
          <EmploymentContract />
          <PayslipAnalysis />
        </div>
      </main>
    </div>
  )
}

export default MoneyKeeperApp
