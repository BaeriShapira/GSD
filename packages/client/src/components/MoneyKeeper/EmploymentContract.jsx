import { useState } from 'react'
import { Upload, FileText, Check, X, Edit2, Loader2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { analyzeContract, convertToSummaryFormat } from '../../utils/contractAnalysis'

// TODO: Move to environment variable or settings
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

function EmploymentContract() {
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [contractSummary, setContractSummary] = useState(null)
  const [fullContractData, setFullContractData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState('')
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

      // Analyze contract with OpenAI
      const contractData = await analyzeContract(uploadedFile, OPENAI_API_KEY)

      // Convert to summary format
      const summary = convertToSummaryFormat(contractData)

      setFullContractData(contractData)
      setContractSummary(summary)
      setEditedSummary(JSON.stringify(contractData, null, 2))
      setIsAnalyzing(false)
    } catch (err) {
      console.error('Error analyzing contract:', err)
      setError(err.message)
      setIsAnalyzing(false)

      // Fallback to mock data for development
      if (import.meta.env.DEV) {
        console.log('Using mock data for development')
        const mockData = getMockContractData()
        const summary = convertToSummaryFormat(mockData)
        setFullContractData(mockData)
        setContractSummary(summary)
        setEditedSummary(JSON.stringify(mockData, null, 2))
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedSummary(JSON.stringify(fullContractData, null, 2))
  }

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editedSummary)
      const summary = convertToSummaryFormat(parsed)
      setFullContractData(parsed)
      setContractSummary(summary)
      setIsEditing(false)
      // TODO: Save to database
      console.log('Saving to DB:', parsed)
    } catch (error) {
      alert('שגיאה בפורמט ה-JSON. אנא בדוק את הנתונים.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedSummary(JSON.stringify(fullContractData, null, 2))
  }

  return (
    <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <FileText className="text-red-600" size={24} />
          <h2 className="text-xl font-bold text-black/90">חוזה העסקה</h2>
          {contractSummary && (
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
                <p className="text-sm font-medium text-red-800 mb-1">שגיאה בניתוח החוזה</p>
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
          {!contractSummary && (
            <div className="border-2 border-dashed border-black/20 rounded-lg p-8 text-center">
              <input
                type="file"
                id="contract-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              <label
                htmlFor="contract-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="text-red-600 animate-spin" size={48} />
                    <p className="text-lg font-medium text-black/80">מנתח את החוזה עם AI...</p>
                    <p className="text-sm text-black/60">אנא המתן, זה עשוי לקחת מספר שניות</p>
                  </>
                ) : (
                  <>
                    <Upload className="text-black/40" size={48} />
                    <div>
                      <p className="text-lg font-medium text-black/80 mb-1">
                        העלה את חוזה העסקה שלך
                      </p>
                      <p className="text-sm text-black/60">
                        טקסט או Word (PDF בקרוב)
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

          {/* Summary Section */}
          {contractSummary && !isEditing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Check size={20} />
                  <span className="font-medium">החוזה נותח בהצלחה</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit()
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <Edit2 size={16} />
                  <span className="text-sm font-medium">ערוך</span>
                </button>
              </div>

              {/* Basic Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-black/90 mb-3 text-lg">פרטי בסיס</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SummaryField label="מעסיק" value={contractSummary.employerName} />
                  <SummaryField label="עובד" value={contractSummary.employeeName} />
                  <SummaryField label="סוג העסקה" value={contractSummary.position} />
                  <SummaryField label="תאריך התחלה" value={contractSummary.startDate} />
                  <SummaryField label="היקף משרה" value={contractSummary.scope} />
                </div>
              </div>

              {/* Salary */}
              <div className="mb-6">
                <h3 className="font-semibold text-black/90 mb-3 text-lg">שכר</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SummaryField label="שכר בסיס ברוטו" value={contractSummary.salary} />
                  <SummaryField label="סוג שכר" value={contractSummary.salaryType} />
                </div>

                {contractSummary.fixedComponents && contractSummary.fixedComponents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-black/80 mb-2 text-sm">רכיבי שכר קבועים:</h4>
                    <div className="space-y-2">
                      {contractSummary.fixedComponents.map((comp, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-black/70">{comp.name}</span>
                          <span className="text-sm font-medium text-black/90">{comp.amount} ₪ ({comp.frequency})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Working Hours */}
              <div className="mb-6">
                <h3 className="font-semibold text-black/90 mb-3 text-lg">שעות עבודה</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SummaryField label="שעות תקן" value={contractSummary.workHours} />
                </div>
              </div>

              {/* Time Off */}
              <div className="mb-6">
                <h3 className="font-semibold text-black/90 mb-3 text-lg">זכויות זמן</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SummaryField label="חופשה שנתית" value={contractSummary.vacationDays} />
                  <SummaryField label="ימי מחלה" value={contractSummary.sickDays} />
                </div>
              </div>

              {/* Social Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold text-black/90 mb-3 text-lg">הפרשות סוציאליות</h3>
                <div className="grid grid-cols-1 gap-4">
                  <SummaryField label="פנסיה" value={contractSummary.pension} />
                  {contractSummary.trainingFund && (
                    <SummaryField label="קרן השתלמות" value={contractSummary.trainingFund} />
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="mb-6">
                <h3 className="font-semibold text-black/90 mb-3 text-lg">תשלום שכר</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SummaryField label="מועד תשלום" value={contractSummary.paymentDate} />
                </div>
              </div>

              {contractSummary.additionalNotes && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">הערות נוספות:</h3>
                  <p className="text-sm text-blue-800">{contractSummary.additionalNotes}</p>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setContractSummary(null)
                }}
                className="mt-6 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                העלה חוזה אחר
              </button>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-black/80">עריכת תקציר החוזה</h3>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSave()
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check size={16} />
                    <span className="text-sm font-medium">שמור</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancel()
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black/80 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X size={16} />
                    <span className="text-sm font-medium">ביטול</span>
                  </button>
                </div>
              </div>

              <textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-96 p-4 border border-black/20 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                dir="ltr"
              />
              <p className="text-xs text-black/60">
                ערוך את ה-JSON למעלה. וודא שהפורמט תקין לפני השמירה.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryField({ label, value }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-sm text-black/60 mb-1">{label}</p>
      <p className="font-medium text-black/90">{value}</p>
    </div>
  )
}

/**
 * Mock contract data for development/fallback
 */
function getMockContractData() {
  return {
    employerIdentity: {
      legalName: "טק קומפני בע״מ",
      registrationNumber: "514123456",
      address: "רחוב הרצל 123, תל אביב"
    },
    employeeIdentity: {
      fullName: "ישראל ישראלי",
      idNumber: "123456789",
      address: "רחוב בן יהודה 45, תל אביב"
    },
    employmentDates: {
      startDate: "01/01/2024",
      endDate: null
    },
    employmentType: "שכיר",
    scope: {
      percentageOfPosition: "100",
      weeklyHours: "42",
      daysPerWeek: "5"
    },
    workplace: {
      type: "היברידי",
      location: "משרדי החברה, תל אביב"
    },
    baseSalary: {
      type: "חודשי",
      grossAmount: "25000",
      currency: "₪"
    },
    fixedSalaryComponents: [
      {
        name: "נסיעות",
        amount: "1500",
        frequency: "חודשי"
      },
      {
        name: "תוספת תפקיד",
        amount: "2000",
        frequency: "חודשי"
      },
      {
        name: "אחזקת רכב",
        amount: "1200",
        frequency: "חודשי"
      }
    ],
    variableSalaryComponents: [
      {
        name: "בונוס שנתי",
        calculationModel: "עד 2 משכורות בהתאם לביצועים",
        paymentTiming: "פברואר מדי שנה"
      }
    ],
    pensionableSalary: "שכר בסיס + תוספת תפקיד",
    workingHours: {
      standardDaily: "8.4",
      standardWeekly: "42",
      overtimePolicy: {
        dailyThreshold: "מעל 8.4 שעות ליום",
        weeklyThreshold: "מעל 42 שעות לשבוע",
        rates: {
          standard: "125%",
          weekend: "150%",
          holiday: "150%"
        }
      }
    },
    timeOffRights: {
      vacation: {
        annualQuota: "20",
        accrual: "יום וחצי לחודש",
        redemption: "ניתן לפדות עד 5 ימים בשנה"
      },
      sickLeave: {
        paymentPolicy: "יום 1-2: 50%, יום 3+: 100%",
        accrual: "יום וחצי לחודש"
      },
      holidays: {
        paid: "כן",
        eligibility: "כל החגים הרשמיים"
      },
      other: [
        {
          type: "ימי השתלמות",
          quota: "6 ימים בשנה"
        }
      ]
    },
    socialBenefits: {
      pension: {
        employeePercentage: "6",
        employerPercentage: "6.5",
        compensationPercentage: "6",
        startDate: "מיום ראשון",
        baseCalculation: "שכר קובע (בסיס + תוספת תפקיד)"
      },
      trainingFund: {
        employeePercentage: "2.5",
        employerPercentage: "7.5",
        salaryCeiling: null
      },
      funds: [
        {
          name: "מגדל מקפת",
          track: "מסלול כללי"
        }
      ]
    },
    taxableBenefits: [
      {
        name: "רכב צמוד",
        value: "2500",
        employeeContribution: "500"
      },
      {
        name: "ביטוח בריאות פרטי",
        value: "300",
        employeeContribution: "0"
      }
    ],
    expensesAndReimbursements: {
      reimbursableExpenses: [
        {
          type: "הוצאות נסיעה לחו״ל",
          mechanism: "החזר מלא מול קבלות",
          ceiling: null
        }
      ],
      travel: {
        mechanism: "קצובה חודשית",
        ceiling: "1500 ₪"
      }
    },
    deductions: [],
    paymentTiming: {
      paymentDate: "9 לחודש",
      method: "העברה בנקאית",
      futureAdjustments: "הצמדה למדד המחירים לצרכן פעם בשנה"
    },
    additionalNotes: "בונוס שנתי בהתאם לביצועים. אופציות להשתתפות בתוכנית רכישת מניות עובדים."
  }
}

export default EmploymentContract
