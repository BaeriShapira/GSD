/**
 * Contract Analysis using OpenAI API
 * Extracts structured data from employment contracts
 */

import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use unpkg for better compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const CONTRACT_ANALYSIS_PROMPT = `אתה עוזר מקצועי לניתוח חוזי העסקה בישראל. תפקידך לחלץ מידע מובנה מחוזה העסקה.

נתח את החוזה והחזר JSON מובנה עם הפרמטרים הבאים:

{
  "employerIdentity": {
    "legalName": "שם משפטי",
    "registrationNumber": "ח.פ/מס׳ תאגיד",
    "address": "כתובת"
  },
  "employeeIdentity": {
    "fullName": "שם מלא",
    "idNumber": "ת״ז",
    "address": "כתובת"
  },
  "employmentDates": {
    "startDate": "תאריך תחילה (DD/MM/YYYY)",
    "endDate": "תאריך סיום (DD/MM/YYYY) או null אם לא מוגבל"
  },
  "employmentType": "שכיר/שעתי/יומי/קבלן",
  "scope": {
    "percentageOfPosition": "אחוז משרה (למשל 100)",
    "weeklyHours": "שעות שבועיות",
    "daysPerWeek": "ימי עבודה בשבוע"
  },
  "workplace": {
    "type": "אתר/סניף/היברידי/מרחוק",
    "location": "מיקום פיזי אם קיים"
  },
  "baseSalary": {
    "type": "חודשי/שעתי/יומי",
    "grossAmount": "סכום ברוטו (מספר)",
    "currency": "מטבע (בדרך כלל ₪)"
  },
  "fixedSalaryComponents": [
    {
      "name": "שם הרכיב",
      "amount": "סכום (מספר)",
      "frequency": "תדירות (חודשי/שבועי/יומי)"
    }
  ],
  "variableSalaryComponents": [
    {
      "name": "שם הרכיב",
      "calculationModel": "מודל חישוב",
      "paymentTiming": "מועד תשלום"
    }
  ],
  "pensionableSalary": "הגדרת שכר קובע להפרשות",
  "workingHours": {
    "standardDaily": "שעות תקן ליום",
    "standardWeekly": "שעות תקן לשבוע",
    "overtimePolicy": {
      "dailyThreshold": "מתי נחשב שעות נוספות יומי",
      "weeklyThreshold": "מתי נחשב שעות נוספות שבועי",
      "rates": {
        "standard": "שיעור תשלום רגיל (125%/150%)",
        "weekend": "שיעור תשלום סופ״ש",
        "holiday": "שיעור תשלום חגים"
      }
    }
  },
  "timeOffRights": {
    "vacation": {
      "annualQuota": "מכסה שנתית (ימים)",
      "accrual": "צבירה (איך נצברים)",
      "redemption": "תשלום פדיון"
    },
    "sickLeave": {
      "paymentPolicy": "מדיניות תשלום (יום 1/2/3)",
      "accrual": "צבירה"
    },
    "holidays": {
      "paid": "האם משולמים (כן/לא)",
      "eligibility": "תנאי זכאות"
    },
    "other": [
      {
        "type": "סוג (ימי בחירה/ימי חברה/ימי השתלמות)",
        "quota": "מכסה"
      }
    ]
  },
  "socialBenefits": {
    "pension": {
      "employeePercentage": "אחוז עובד (מספר)",
      "employerPercentage": "אחוז מעסיק (מספר)",
      "compensationPercentage": "אחוז פיצויים (מספר)",
      "startDate": "מועד תחילת הפרשות",
      "baseCalculation": "על איזה בסיס שכר"
    },
    "trainingFund": {
      "employeePercentage": "אחוז עובד",
      "employerPercentage": "אחוז מעסיק",
      "salaryCeiling": "תקרת שכר"
    },
    "funds": [
      {
        "name": "שם גוף/קרן",
        "track": "מסלול"
      }
    ]
  },
  "taxableBenefits": [
    {
      "name": "שם ההטבה",
      "value": "שווי למס (מספר)",
      "employeeContribution": "השתתפות עובד"
    }
  ],
  "expensesAndReimbursements": {
    "reimbursableExpenses": [
      {
        "type": "סוג הוצאה",
        "mechanism": "מנגנון החזר",
        "ceiling": "תקרה"
      }
    ],
    "travel": {
      "mechanism": "יומי/חודשי/לפי ק״מ",
      "ceiling": "תקרה"
    }
  },
  "deductions": [
    {
      "type": "סוג הניכוי",
      "amount": "סכום/מספר תשלומים",
      "monthlyDeduction": "קיזוז חודשי"
    }
  ],
  "paymentTiming": {
    "paymentDate": "תאריך יעד לתשלום",
    "method": "אופן תשלום (העברה בנקאית)",
    "futureAdjustments": "הצמדות/עדכוני שכר עתידיים"
  },
  "additionalNotes": "הערות נוספות חשובות"
}

חשוב:
1. אם מידע לא מצוין בחוזה, השתמש ב-null
2. מספרים צריכים להיות ללא מטבע או סימנים (רק ספרות)
3. תאריכים בפורמט DD/MM/YYYY
4. אחוזים כמספר (למשל 7.5 ולא "7.5%")
5. תענה רק עם JSON תקין, בלי טקסט נוסף

נתח את החוזה הבא:`;

/**
 * Analyze employment contract using OpenAI
 * @param {File} file - The contract file
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} - Structured contract data
 */
export async function analyzeContract(file, apiKey) {
  try {
    // Read file content
    const fileContent = await readFileContent(file);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // gpt-4o-mini זול יותר, gpt-4o לדיוק מקסימלי
        messages: [
          {
            role: 'system',
            content: 'אתה מומחה לניתוח חוזי העסקה בישראל. אתה מחלץ מידע מובנה מחוזים ומחזיר JSON תקין בלבד.'
          },
          {
            role: 'user',
            content: `${CONTRACT_ANALYSIS_PROMPT}\n\n${fileContent}`
          }
        ],
        temperature: 0, // Temperature 0 for maximum consistency
        max_tokens: 3000, // Maximum tokens for response
        response_format: { type: "json_object" } // Force JSON response
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const contractData = JSON.parse(data.choices[0].message.content);

    return contractData;
  } catch (error) {
    console.error('Error analyzing contract:', error);
    throw error;
  }
}

/**
 * Extract text from PDF file
 * @param {File} file - The PDF file to read
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items with spaces
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Read file content as text
 * @param {File} file - The file to read
 * @returns {Promise<string>} - File content
 */
async function readFileContent(file) {
  // Handle PDF files
  if (file.type === 'application/pdf') {
    return extractTextFromPDF(file);
  }

  // Handle text-based files (.txt, .docx, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Convert contract data to summary format for display
 * @param {Object} contractData - Full contract data from OpenAI
 * @returns {Object} - Summary format for UI display
 */
export function convertToSummaryFormat(contractData) {
  return {
    // Basic info
    employerName: contractData.employerIdentity?.legalName || 'לא צוין',
    employeeName: contractData.employeeIdentity?.fullName || 'לא צוין',
    position: contractData.employmentType || 'לא צוין',

    // Salary
    salary: contractData.baseSalary?.grossAmount
      ? `${contractData.baseSalary.grossAmount} ${contractData.baseSalary.currency || '₪'}`
      : 'לא צוין',
    salaryType: contractData.baseSalary?.type || 'לא צוין',

    // Dates
    startDate: contractData.employmentDates?.startDate || 'לא צוין',
    endDate: contractData.employmentDates?.endDate || 'לא מוגבל',

    // Scope
    scope: `${contractData.scope?.percentageOfPosition || '?'}% משרה, ${contractData.scope?.weeklyHours || '?'} שעות שבועיות`,

    // Work hours
    workHours: `${contractData.workingHours?.standardDaily || '?'} שעות ליום, ${contractData.workingHours?.standardWeekly || '?'} שעות לשבוע`,

    // Time off
    vacationDays: contractData.timeOffRights?.vacation?.annualQuota
      ? `${contractData.timeOffRights.vacation.annualQuota} ימים בשנה`
      : 'לא צוין',
    sickDays: contractData.timeOffRights?.sickLeave?.accrual || 'לא צוין',

    // Social benefits
    pension: contractData.socialBenefits?.pension
      ? `עובד: ${contractData.socialBenefits.pension.employeePercentage}%, מעסיק: ${contractData.socialBenefits.pension.employerPercentage}%, פיצויים: ${contractData.socialBenefits.pension.compensationPercentage}%`
      : 'לא צוין',

    trainingFund: contractData.socialBenefits?.trainingFund
      ? `עובד: ${contractData.socialBenefits.trainingFund.employeePercentage}%, מעסיק: ${contractData.socialBenefits.trainingFund.employerPercentage}%`
      : 'לא צוין',

    // Fixed components
    fixedComponents: contractData.fixedSalaryComponents || [],

    // Variable components
    variableComponents: contractData.variableSalaryComponents || [],

    // Benefits
    benefits: [
      ...(contractData.fixedSalaryComponents?.map(c => c.name) || []),
      ...(contractData.taxableBenefits?.map(b => b.name) || [])
    ],

    // Payment
    paymentDate: contractData.paymentTiming?.paymentDate || 'לא צוין',

    // Additional notes
    additionalNotes: contractData.additionalNotes || '',

    // Full data for editing
    fullData: contractData
  };
}
