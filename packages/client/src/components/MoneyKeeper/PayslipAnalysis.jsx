import { useState } from 'react'
import { Upload, Receipt, ChevronDown, ChevronUp, AlertCircle, Loader2, X } from 'lucide-react'
import { analyzePayslip } from '../../utils/payslipAnalysis'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

function PayslipAnalysis() {
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [payslipData, setPayslipData] = useState(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [error, setError] = useState(null)

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setIsAnalyzing(true)
    setError(null)

    try {
      // Check if API key is available
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API Key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.')
      }

      // Analyze payslip with OpenAI
      const data = await analyzePayslip(uploadedFile, OPENAI_API_KEY)
      setPayslipData(data)
      setIsAnalyzing(false)
    } catch (err) {
      console.error('Error analyzing payslip:', err)
      setError(err.message)
      setIsAnalyzing(false)

      // Fallback to mock data for development
      if (import.meta.env.DEV) {
        console.log('Using mock data for development')
        const mockData = getMockPayslipData()
        setPayslipData(mockData)
      }
    }
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-'
    return `₪${Number(amount).toLocaleString('he-IL')}`
  }

  return (
    <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Receipt className="text-red-600" size={24} />
          <h2 className="text-xl font-bold text-black/90">תלוש משכורת</h2>
          {payslipData && (
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              ✓ נותח
            </span>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronUp className="text-black/60" size={20} />
          ) : (
            <ChevronDown className="text-black/60" size={20} />
          )}
        </button>
      </div>

      {/* Content - Collapsible */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-black/10 pt-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">שגיאה בניתוח התלוש</p>
                <p className="text-sm text-red-700">{error}</p>
                {import.meta.env.DEV && (
                  <p className="text-xs text-red-600 mt-2">
                    במצב פיתוח - משתמש בנתוני דמו
                  </p>
                )}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Upload Section */}
          {!payslipData && (
            <div className="border-2 border-dashed border-black/20 rounded-lg p-8 text-center">
              <input
                type="file"
                id="payslip-upload"
                className="hidden"
                accept=".pdf,.txt,.jpg,.png"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              <label
                htmlFor="payslip-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="text-red-600 animate-spin" size={48} />
                    <p className="text-lg font-medium text-black/80">מנתח את התלוש עם AI...</p>
                    <p className="text-sm text-black/60">אנא המתן, זה עשוי לקחת מספר שניות</p>
                  </>
                ) : (
                  <>
                    <Upload className="text-black/40" size={48} />
                    <div>
                      <p className="text-lg font-medium text-black/80 mb-1">
                        העלה תלוש משכורת
                      </p>
                      <p className="text-sm text-black/60">
                        PDF, תמונה, או טקסט
                      </p>
                    </div>
                    {file && (
                      <p className="text-sm text-red-600 font-medium">
                        קובץ נבחר: {file.name}
                      </p>
                    )}
                  </>
                )}
              </label>
            </div>
          )}

          {/* Analysis Results */}
          {payslipData && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-black/10">
                <div>
                  <p className="text-sm text-black/60 mb-1">עובד</p>
                  <p className="font-semibold text-black/90">{payslipData.employeeInfo?.fullName || '-'}</p>
                  <p className="text-sm text-black/60">ת.ז: {payslipData.employeeInfo?.idNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-black/60 mb-1">תקופה</p>
                  <p className="font-semibold text-black/90">{payslipData.payPeriod?.displayText || '-'}</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                  label="שכר ברוטו"
                  value={formatCurrency(payslipData.summary?.grossSalary)}
                  color="blue"
                />
                <SummaryCard
                  label="ניכויים"
                  value={formatCurrency(payslipData.summary?.totalDeductions)}
                  color="red"
                />
                <SummaryCard
                  label="שכר נטו"
                  value={formatCurrency(payslipData.summary?.netSalary)}
                  color="green"
                />
              </div>

              {/* Earnings Table */}
              <div>
                <h3 className="font-semibold text-black/90 mb-3 text-lg">רכיבי שכר</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-right p-3 text-sm font-medium text-black/70 border-b border-black/10">תיאור</th>
                        <th className="text-right p-3 text-sm font-medium text-black/70 border-b border-black/10">קטגוריה</th>
                        <th className="text-left p-3 text-sm font-medium text-black/70 border-b border-black/10">סכום</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payslipData.earnings?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-black/80 border-b border-black/5">{item.description}</td>
                          <td className="p-3 text-sm text-black/60 border-b border-black/5">{item.category}</td>
                          <td className="p-3 text-sm font-medium text-black/90 border-b border-black/5 text-left">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="p-3 text-sm text-black/90" colSpan="2">סה״כ ברוטו</td>
                        <td className="p-3 text-sm text-black/90 text-left">
                          {formatCurrency(payslipData.summary?.grossSalary)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deductions Table */}
              <div>
                <h3 className="font-semibold text-black/90 mb-3 text-lg">ניכויים</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-right p-3 text-sm font-medium text-black/70 border-b border-black/10">תיאור</th>
                        <th className="text-right p-3 text-sm font-medium text-black/70 border-b border-black/10">קטגוריה</th>
                        <th className="text-left p-3 text-sm font-medium text-black/70 border-b border-black/10">סכום</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payslipData.deductions?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-black/80 border-b border-black/5">{item.description}</td>
                          <td className="p-3 text-sm text-black/60 border-b border-black/5">{item.category}</td>
                          <td className="p-3 text-sm font-medium text-red-600 border-b border-black/5 text-left">
                            -{formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-red-50 font-semibold">
                        <td className="p-3 text-sm text-black/90" colSpan="2">סה״כ ניכויים</td>
                        <td className="p-3 text-sm text-red-600 text-left">
                          -{formatCurrency(payslipData.summary?.totalDeductions)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-green-900">שכר נטו לתשלום</h3>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(payslipData.summary?.netSalary)}
                  </p>
                </div>
              </div>

              {/* Employer Contributions */}
              {payslipData.employerContributions && payslipData.employerContributions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-black/90 mb-3 text-lg">הפרשות מעסיק</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-right p-3 text-sm font-medium text-black/70 border-b border-black/10">תיאור</th>
                          <th className="text-right p-3 text-sm font-medium text-black/70 border-b border-black/10">קטגוריה</th>
                          <th className="text-left p-3 text-sm font-medium text-black/70 border-b border-black/10">סכום</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payslipData.employerContributions.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 text-sm text-black/80 border-b border-black/5">{item.description}</td>
                            <td className="p-3 text-sm text-black/60 border-b border-black/5">{item.category}</td>
                            <td className="p-3 text-sm font-medium text-green-600 border-b border-black/5 text-left">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Balances */}
              {payslipData.balances && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">יתרות</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {payslipData.balances.vacationBalance && (
                      <div>
                        <p className="text-sm text-blue-700">חופשה</p>
                        <p className="font-medium text-blue-900">{payslipData.balances.vacationBalance} ימים</p>
                      </div>
                    )}
                    {payslipData.balances.sickLeaveBalance && (
                      <div>
                        <p className="text-sm text-blue-700">מחלה</p>
                        <p className="font-medium text-blue-900">{payslipData.balances.sickLeaveBalance} ימים</p>
                      </div>
                    )}
                    {payslipData.balances.recuperationBalance && (
                      <div>
                        <p className="text-sm text-blue-700">הבראה</p>
                        <p className="font-medium text-blue-900">{formatCurrency(payslipData.balances.recuperationBalance)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setPayslipData(null)
                  setFile(null)
                }}
                className="mt-6 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                העלה תלוש אחר
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    green: 'bg-green-50 border-green-200 text-green-900'
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm mb-1 opacity-70">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

/**
 * Mock payslip data for development/fallback
 */
function getMockPayslipData() {
  return {
    employeeInfo: {
      fullName: "ישראל ישראלי",
      idNumber: "123456789",
      employeeNumber: "EMP-001"
    },
    employerInfo: {
      name: "טק קומפני בע״מ",
      employerNumber: "514123456"
    },
    payPeriod: {
      month: "12",
      year: "2024",
      displayText: "דצמבר 2024"
    },
    workDetails: {
      percentageOfPosition: "100",
      workedDays: "22",
      workedHours: "176",
      absenceDays: "0",
      sickDays: "0",
      vacationDays: "0"
    },
    earnings: [
      { description: "שכר יסוד", amount: "20000", category: "בסיס" },
      { description: "תוספת ותק", amount: "2000", category: "תוספת" },
      { description: "תוספת משפחה", amount: "500", category: "תוספת" },
      { description: "נסיעות", amount: "1500", category: "החזר הוצאות" },
      { description: "שעות נוספות", amount: "1200", category: "שעות נוספות" }
    ],
    deductions: [
      { description: "מס הכנסה", amount: "5200", category: "מס הכנסה" },
      { description: "ביטוח לאומי", amount: "1520", category: "ביטוח לאומי" },
      { description: "ביטוח בריאות", amount: "640", category: "ביטוח בריאות" },
      { description: "פנסיה - עובד", amount: "1512", category: "פנסיה" },
      { description: "קרן השתלמות - עובד", amount: "630", category: "קרן השתלמות" }
    ],
    employerContributions: [
      { description: "פנסיה - מעסיק", amount: "1638", category: "פנסיה" },
      { description: "פיצויים", amount: "1512", category: "פנסיה" },
      { description: "קרן השתלמות - מעסיק", amount: "1890", category: "קרן השתלמות" },
      { description: "ביטוח לאומי - מעסיק", amount: "2100", category: "ביטוח לאומי" }
    ],
    summary: {
      grossSalary: "25200",
      totalDeductions: "9502",
      netSalary: "15698",
      employerTotal: "7140"
    },
    taxDetails: {
      taxableIncome: "25200",
      taxPoints: "2.25",
      taxRate: "20.63",
      incomeTax: "5200"
    },
    socialSecurity: {
      nationalInsurance: {
        employee: "1520",
        employer: "2100"
      },
      healthInsurance: {
        employee: "640",
        employer: "0"
      }
    },
    pensionDetails: {
      pensionBase: "25200",
      employeeContribution: "1512",
      employerContribution: "1638",
      severancePay: "1512"
    },
    balances: {
      vacationBalance: "18",
      sickLeaveBalance: "45",
      recuperationBalance: "3500"
    },
    notes: "תלוש משכורת רגיל לחודש דצמבר"
  }
}

export default PayslipAnalysis
