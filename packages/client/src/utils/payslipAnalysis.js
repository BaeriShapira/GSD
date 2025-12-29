/**
 * Payslip Analysis using OpenAI API
 * Extracts structured data from salary payslips
 */

import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use unpkg for better compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const PAYSLIP_ANALYSIS_PROMPT = `אתה עוזר מקצועי לניתוח תלושי שכר בישראל. תפקידך לחלץ מידע מובנה מתלוש משכורת.

נתח את התלוש והחזר JSON מובנה עם הפרמטרים הבאים:

{
  "employeeInfo": {
    "fullName": "שם מלא",
    "idNumber": "תעודת זהות",
    "employeeNumber": "מספר עובד"
  },
  "employerInfo": {
    "name": "שם המעסיק",
    "employerNumber": "מספר מעסיק"
  },
  "payPeriod": {
    "month": "חודש (1-12)",
    "year": "שנה (YYYY)",
    "displayText": "חודש/שנה בעברית"
  },
  "workDetails": {
    "percentageOfPosition": "אחוז משרה",
    "workedDays": "ימי עבודה",
    "workedHours": "שעות עבודה",
    "absenceDays": "ימי היעדרות",
    "sickDays": "ימי מחלה",
    "vacationDays": "ימי חופשה"
  },
  "earnings": [
    {
      "description": "תיאור רכיב השכר",
      "amount": "סכום (מספר)",
      "category": "בסיס/תוספת/שעות נוספות/בונוס/החזר הוצאות/אחר"
    }
  ],
  "deductions": [
    {
      "description": "תיאור הניכוי",
      "amount": "סכום (מספר)",
      "category": "מס הכנסה/ביטוח לאומי/ביטוח בריאות/פנסיה/קרן השתלמות/הלוואה/אחר"
    }
  ],
  "employerContributions": [
    {
      "description": "תיאור ההפרשה",
      "amount": "סכום (מספר)",
      "category": "פנסיה/קרן השתלמות/ביטוח לאומי/אחר"
    }
  ],
  "summary": {
    "grossSalary": "שכר ברוטו (מספר)",
    "totalDeductions": "סך ניכויים (מספר)",
    "netSalary": "שכר נטו (מספר)",
    "employerTotal": "סך הפרשות מעסיק (מספר)"
  },
  "taxDetails": {
    "taxableIncome": "הכנסה חייבת במס",
    "taxPoints": "נקודות זכות",
    "taxRate": "שיעור מס",
    "incomeTax": "מס הכנסה"
  },
  "socialSecurity": {
    "nationalInsurance": {
      "employee": "ביטוח לאומי עובד",
      "employer": "ביטוח לאומי מעסיק"
    },
    "healthInsurance": {
      "employee": "ביטוח בריאות עובד",
      "employer": "ביטוח בריאות מעסיק"
    }
  },
  "pensionDetails": {
    "pensionBase": "בסיס חישוב פנסיה",
    "employeeContribution": "הפרשת עובד",
    "employerContribution": "הפרשת מעסיק",
    "severancePay": "פיצויים"
  },
  "balances": {
    "vacationBalance": "יתרת חופשה (ימים)",
    "sickLeaveBalance": "יתרת מחלה (ימים)",
    "recuperationBalance": "יתרת הבראה (סכום)"
  },
  "notes": "הערות והסברים נוספים"
}

חשוב:
1. אם מידע לא מצוין בתלוש, השתמש ב-null
2. מספרים צריכים להיות ללא מטבע או סימנים (רק ספרות)
3. סכומים שליליים (ניכויים) כמספר חיובי
4. תענה רק עם JSON תקין, בלי טקסט נוסף

נתח את התלוש הבא:`;

/**
 * Analyze payslip using OpenAI
 * @param {File} file - The payslip file
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} - Structured payslip data
 */
export async function analyzePayslip(file, apiKey) {
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'אתה מומחה לניתוח תלושי שכר בישראל. אתה מחלץ מידע מובנה מתלושים ומחזיר JSON תקין בלבד.'
          },
          {
            role: 'user',
            content: `${PAYSLIP_ANALYSIS_PROMPT}\n\n${fileContent}`
          }
        ],
        temperature: 0,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const payslipData = JSON.parse(data.choices[0].message.content);

    return payslipData;
  } catch (error) {
    console.error('Error analyzing payslip:', error);
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
