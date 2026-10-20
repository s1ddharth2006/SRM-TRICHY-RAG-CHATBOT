import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "..", "data", "docs");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

function createPdfHelper(themeColor = rgb(0.06, 0.22, 0.45)) {
  return async function buildPdf(filename, pages) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const p of pages) {
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();

      // Header Banner
      page.drawRectangle({
        x: 0,
        y: height - 60,
        width: width,
        height: 60,
        color: themeColor
      });

      page.drawText("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, TIRUCHIRAPPALLI", {
        x: 35,
        y: height - 35,
        size: 12.5,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText(p.title.toUpperCase(), {
        x: 35,
        y: height - 50,
        size: 9.5,
        font: font,
        color: rgb(0.9, 0.95, 1)
      });

      let y = height - 85;
      for (const item of p.lines) {
        if (!item || item.trim() === "") {
          y -= 8;
          continue;
        }

        if (item.startsWith("### ")) {
          y -= 4;
          page.drawText(item.replace("### ", ""), {
            x: 35,
            y,
            size: 10.5,
            font: fontBold,
            color: themeColor
          });
          y -= 15;
        } else if (item.startsWith("## ")) {
          y -= 6;
          page.drawText(item.replace("## ", ""), {
            x: 35,
            y,
            size: 11.5,
            font: fontBold,
            color: themeColor
          });
          y -= 16;
        } else if (item.startsWith("• ")) {
          page.drawText(item, {
            x: 45,
            y,
            size: 9.2,
            font: font,
            color: rgb(0.12, 0.12, 0.12)
          });
          y -= 14;
        } else {
          page.drawText(item, {
            x: 35,
            y,
            size: 9.2,
            font: font,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 14;
        }

        if (y < 45) break; // Keep inside page
      }

      // Footer
      page.drawText("Official SRM IST Trichy Document | https://www.srmtrichy.edu.in | Helpline: 1800 202 4565", {
        x: 35,
        y: 22,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
    }

    const pdfBytes = await pdfDoc.save();
    const dest = path.join(DOCS_DIR, filename);
    fs.writeFileSync(dest, pdfBytes);
    console.log(`Generated: ${filename} (${pages.length} pages, ${pdfBytes.length} bytes)`);
  };
}

// 1. ADMISSIONS PROSPECTUS
async function generateAdmissionsPdf() {
  const build = createPdfHelper(rgb(0.06, 0.22, 0.45)); // SRM Blue
  await build("SRM_Trichy_Admissions_Prospectus_2026.pdf", [
    {
      title: "Admissions Prospectus 2026 — Eligibility & Selection",
      lines: [
        "## 1. INSTITUTION OVERVIEW & CATEGORY-1 STATUS",
        "SRM Institute of Science and Technology (SRM IST), Tiruchirappalli Campus is a premier Category-1",
        "Deemed-to-be University accredited with the highest NAAC A++ grade. Situated on a sprawling 50+ acre",
        "smart campus along the Trichy-Chennai National Highway (NH-45) near Samayapuram.",
        "",
        "## 2. B.TECH ADMISSION NORMS & ELIGIBILITY",
        "• Minimum 60% aggregate in 12th Higher Secondary Exam (Physics, Chemistry, and Mathematics - PCM).",
        "• Admissions are granted based on SRMJEEE National Rank or 12th Board PCM Merit Score.",
        "• Without 12th Mathematics, direct admission into B.Tech Engineering is strictly not permitted.",
        "• Students with Biology (PCB) can enroll in B.Tech Biotechnology, BPT, BCA, BBA, and B.Com.",
        "• 3-Year Diploma holders with 60%+ are eligible for Direct 2nd Year B.Tech Lateral Entry.",
        "",
        "## 3. APPLICATION PROCEDURE & ENTRANCE HELPLINE",
        "• Online Application Portal: https://admissions.srmtrichy.edu.in/",
        "• Application Processing Fee: Rs. 1,200 (Non-refundable, payable online).",
        "• Required Documents: 10th & 12th Marksheets, Transfer Certificate, Community Certificate, Aadhaar.",
        "• National Toll-Free Helpline: 1800 202 4565 | Office: 0431 - 2258900 | admissions@srmtrichy.edu.in."
      ]
    },
    {
      title: "Admissions Prospectus 2026 — Non-Engineering & Lateral Entry",
      lines: [
        "## 1. MANAGEMENT AND HUMANITIES ELIGIBILITY",
        "• MBA (2 Years): Any undergraduate degree with min 50% aggregate + SRM MAT / CAT / TANCET.",
        "• BBA (3 Years): 10+2 pass in any stream (Commerce, Science, or Arts) with minimum 50% aggregate.",
        "• BCA (3 Years): 10+2 with Mathematics, Computer Science, or Statistics.",
        "• B.Com (3 Years): 10+2 with Commerce, Accountancy, or Economics.",
        "",
        "## 2. PHYSIOTHERAPY & HEALTH SCIENCES (SRM MEDICAL CAMPUS)",
        "• BPT (Bachelor of Physiotherapy - 4.5 Years with 6 months clinical internship): 10+2 PCB min 50%.",
        "• BOT (Bachelor of Occupational Therapy - 4.5 Years): 10+2 PCB min 50%.",
        "• Clinical Postings: Conducted at the on-campus 750-bed SRM Super Speciality Teaching Hospital.",
        "",
        "## 3. UGC REFUND POLICY & BANK EDUCATION LOAN",
        "• 100% Fee Refund (minus Rs. 1,000 processing fee) if withdrawal requested 15+ days before deadline.",
        "• College provides prompt Bonafide Certificates and Fee Estimates for SBI, Canara Bank, and HDFC loans."
      ]
    }
  ]);
}

// 2. ACADEMIC PROGRAMMES & SCHOOLS
async function generateAcademicPdf() {
  const build = createPdfHelper(rgb(0.12, 0.35, 0.65)); // Navy
  await build("SRM_Trichy_Academic_Programmes_and_Schools_2026.pdf", [
    {
      title: "Academic Programmes & Schools — Engineering & Computing",
      lines: [
        "## 1. SCHOOL OF COMPUTING (FACULTY OF ENGINEERING & TECHNOLOGY)",
        "• B.Tech Computer Science and Engineering (CSE) — 4 Years (Annual Fee: Rs. 2,00,000 - 2,50,000).",
        "  Specializations in Cloud Architecture, Full-Stack Engineering, and Distributed Systems.",
        "• B.Tech Artificial Intelligence & Data Science (AI & DS) — 4 Years (Annual Fee: Rs. 2,00,000 - 2,50,000).",
        "  Curriculum features NVIDIA GPU Deep Learning Labs, Neural Networks, and Big Data Analytics.",
        "• B.Tech Cyber Security — 4 Years (Annual Fee: Rs. 1,75,000 - 2,25,000).",
        "  Hands-on training in Ethical Hacking, Defense Cryptography, Digital Forensics, and SOC Operations.",
        "• Department of Information Technology (IT) and Software Engineering.",
        "",
        "## 2. SCHOOL OF EEE, MECHANICAL & BIOSCIENCES",
        "• B.Tech Electronics & Communication Engineering (ECE) — 4 Years (Fee: Rs. 1,50,000 - 2,00,000).",
        "  Embedded IoT Systems, VLSI Design, 5G Wireless Communications, and Robotics.",
        "• B.Tech Biotechnology — 4 Years (Annual Fee: Rs. 1,50,000 - 2,00,000).",
        "  Genetic Engineering, Bio-Pharmaceuticals, Industrial Fermentation, and Bio-Informatics.",
        "• B.Tech Mechanical Engineering — 4 Years: CAD/CAM, Electric Vehicles (EV), and Automation."
      ]
    },
    {
      title: "Academic Programmes & Schools — Management, Science & Health",
      lines: [
        "## 1. SCHOOL OF MANAGEMENT STUDIES & COMMERCE",
        "• Master of Business Administration (MBA) — 2 Years (Annual Fee: Rs. 1,75,000 - 2,25,000).",
        "  Dual Specializations in Finance, Marketing, HR, Business Analytics, and Logistics.",
        "• Bachelor of Business Administration (BBA) — 3 Years (Annual Fee: Rs. 85,000 - 1,10,000).",
        "• Bachelor of Computer Applications (BCA) — 3 Years (Annual Fee: Rs. 80,000 - 1,05,000).",
        "• Bachelor of Commerce (B.Com / B.Com ISM) — 3 Years (Annual Fee: Rs. 75,000 - 95,000).",
        "• B.Sc. Hotel Management and Catering Technology — 3 Years (Annual Fee: Rs. 90,000 - 1,20,000).",
        "",
        "## 2. HEALTH SCIENCES & CLINICAL DISCIPLINES",
        "• BPT (Bachelor of Physiotherapy) — 4.5 Years with 6 Months Internship (Fee: Rs. 1,25,000 - 1,60,000).",
        "  Orthopedic, Neurological, Cardio-respiratory, and Sports Physiotherapy Rehabilitation.",
        "• BOT (Bachelor of Occupational Therapy) — 4.5 Years (Annual Fee: Rs. 1,10,000 - 1,40,000).",
        "• Allied Health Sciences (Medical Lab Technology, Radiology & Imaging Technology, Anesthesia)."
      ]
    }
  ]);
}

// 3. PLACEMENTS & CAREERS
async function generatePlacementsPdf() {
  const build = createPdfHelper(rgb(0.08, 0.45, 0.3)); // Emerald Green
  await build("SRM_Trichy_Placements_and_Career_Report_2026.pdf", [
    {
      title: "Career Development Centre — Annual Placement Report 2026",
      lines: [
        "## 1. KEY PLACEMENT STATISTICS (2025-2026 BATCH)",
        "• Overall Placement Percentage: 95%+ of eligible registered students successfully placed.",
        "• Highest Salary Package: Rs. 50.00 LPA (50 Lakhs Per Annum).",
        "• Average Salary Package: Rs. 8.50 LPA across Engineering, Computing, and Management.",
        "• Total Corporate Recruiters: 600+ National and Global Enterprises visiting the campus.",
        "• Super Dream Offers (Rs. 10 LPA and above): 320+ high-tier selections.",
        "• Total Job Offers Extended: 1,850+ offers across all graduating streams.",
        "",
        "## 2. TOP CORPORATE RECRUITERS & GLOBAL RECRUITMENT TIE-UPS",
        "• Tier-1 Product Companies: Amazon, Microsoft, Google, Adobe, Zoho Corporation, PayPal.",
        "• IT & Consulting Giants: TCS (Ninja & Digital), Infosys, Wipro, Cognizant, Accenture, Capgemini.",
        "• Core Engineering & Automotive: Bosch, Renault Nissan, L&T Technology Services, Hyundai Mobis.",
        "• Banking & Financial Analytics: Barclays, Deloitte, Ernst & Young, HDFC Bank, Standard Chartered.",
        "",
        "## 3. CAREER DEVELOPMENT CENTRE (CDC) 4-YEAR FRAMEWORK",
        "• 1st Year: Foundational communication, verbal aptitude, presentation skills bootcamps.",
        "• 2nd Year: Data Structures, Algorithms (DSA), Full-Stack Web Development, and Open-Source coding.",
        "• 3rd Year: Cloud Computing (AWS/GCP), AI Hackathons, and paid summer corporate internships.",
        "• 4th Year: Intensive mock technical & HR interview rounds, portfolio screening, dream drives."
      ]
    }
  ]);
}

// 4. HOSTELS & CAMPUS LIFE
async function generateHostelsPdf() {
  const build = createPdfHelper(rgb(0.55, 0.22, 0.1)); // Terracotta
  await build("SRM_Trichy_Hostels_Dining_and_Campus_Life_2026.pdf", [
    {
      title: "Campus Living Handbook — Accommodation, Dining & Transport",
      lines: [
        "## 1. RESIDENTIAL HOSTEL FACILITIES (BOYS & GIRLS)",
        "• Dedicated modern hostel blocks with 24/7 CCTV surveillance, biometric turnstiles, and security guards.",
        "• Room Configurations: 2-sharing, 3-sharing, and 4-sharing options in Air Conditioned (AC) and Non-AC.",
        "• Annual Hostel Fee: Rs. 85,000 to Rs. 1,35,000 per year (covers room, electricity, all meals, Wi-Fi).",
        "• Room Amenities: Individual ergonomic study desk, ergonomic chair, wardrobe, and high-speed Wi-Fi.",
        "• Hostel Timings & Curfew: 8:30 PM for Boys hostel; 7:00 PM for Girls hostel.",
        "",
        "## 2. DINING HALLS & FOOD STANDARDS",
        "• Hygienic, state-of-the-art steam-automated central kitchen preparing 4 nutritious meals daily.",
        "• Multi-cuisine menu featuring authentic South Indian and North Indian vegetarian and non-vegetarian.",
        "• Multi-stage commercial RO water purification systems installed on every hostel floor.",
        "",
        "## 3. 750-BED TEACHING HOSPITAL & TRANSPORTATION",
        "• SRM Super Speciality Teaching Hospital on campus provides 24/7 emergency casualty care and ambulances.",
        "• Free and subsidized outpatient consultations and diagnostic services for SRM students.",
        "• Transport Fleet: 40+ college buses operating on dedicated routes across Trichy, Thanjavur, Karur, Srirangam."
      ]
    }
  ]);
}

// 5. FEES & SCHOLARSHIPS
async function generateFeesPdf() {
  const build = createPdfHelper(rgb(0.45, 0.12, 0.45)); // Purple
  await build("SRM_Trichy_Fees_Scholarships_and_Financial_Aid_2026.pdf", [
    {
      title: "Fee Schedule & Merit Scholarships 2026-27",
      lines: [
        "## 1. COMPREHENSIVE ANNUAL TUITION FEE STRUCTURE",
        "• B.Tech Computer Science & Engineering (CSE): Rs. 2,00,000 to Rs. 2,50,000 per year.",
        "• B.Tech Artificial Intelligence & Data Science (AI & DS): Rs. 2,00,000 to Rs. 2,50,000 per year.",
        "• B.Tech Cyber Security: Rs. 1,75,000 to Rs. 2,25,000 per year.",
        "• B.Tech Core Branches (ECE, Biotech, Mechanical): Rs. 1,50,000 to Rs. 2,00,000 per year.",
        "• MBA Program: Rs. 1,75,000 to Rs. 2,25,000 per year.",
        "• BBA / BCA Programs: Rs. 80,000 to Rs. 1,10,000 per year.",
        "• B.Com / B.Com ISM: Rs. 75,000 to Rs. 95,000 per year.",
        "• BPT (Physiotherapy): Rs. 1,25,000 to Rs. 1,60,000 per year.",
        "",
        "## 2. MERIT SCHOLARSHIP SCHEMES",
        "• 90%+ in 12th Board Examinations: 50% Tuition Fee Waiver for all 4 years (subject to CGPA).",
        "• 80% to 89% in 12th Board Examinations: 25% Tuition Fee Waiver.",
        "• SRMJEEE Top 100 National Rankers: Up to 100% full tuition fee concession.",
        "• Sports Quota: Up to 100% tuition and hostel fee waiver for State/National medalists.",
        "• Socio-Economic and Rural Scholarship Grants upon application evaluation.",
        "",
        "## 3. BANK LOANS & UGC REFUND GUIDELINES",
        "• Admission cell issues immediate Bonafide & Fee Structure letters for SBI, Canara Bank, Indian Bank.",
        "• 100% refund (minus Rs. 1,000 processing fee) for withdrawals requested 15+ days before admission cutoff."
      ]
    }
  ]);
}

// 6. GOVERNANCE, ACCREDITATION & FAQ DIRECTORY
async function generateGovernancePdf() {
  const build = createPdfHelper(rgb(0.15, 0.2, 0.3)); // Slate Dark
  await build("SRM_Trichy_Governance_Accreditation_and_Student_Handbook_2026.pdf", [
    {
      title: "Governance, Accreditations & Student Policies 2026",
      lines: [
        "## 1. APEX UNIVERSITY LEADERSHIP",
        "• Founder Chancellor: Dr. T. R. Paarivendhar (Member of Parliament, Philanthropist).",
        "• Pro-Chancellor (Administration): Dr. Ravi Pachamoothoo.",
        "• Pro-Chancellor (Academics): Dr. P. Sathyanarayanan.",
        "• Vice Chancellor: Dr. C. Muthamizhchelvan.",
        "• Registrar: Dr. S. Ponnusamy.",
        "",
        "## 2. NATIONAL & INTERNATIONAL ACCREDITATIONS",
        "• NAAC A++ Grade: Highest institutional accreditation awarded by National Assessment & Accreditation Council.",
        "• UGC Category-1 University: Autonomous Deemed-to-be University status by Ministry of Education, Govt. of India.",
        "• AICTE Approved: All technical B.Tech and MBA programmes approved by All India Council for Technical Education.",
        "• ABET (USA) Accredited Engineering Curricula meeting Washington Accord global recognition.",
        "",
        "## 3. STUDENT POLICIES, DRESS CODE & ANTI-RAGGING",
        "• Zero-Tolerance Anti-Ragging Policy: Mandated by Supreme Court and UGC; anti-ragging squad active 24/7.",
        "• Dress Code: Formal and decent smart-casual attire. Wearing university student ID card is compulsory.",
        "• Campus Address: SRM Nagar, Trichy - Chennai Highway (NH-45), near Samayapuram, Tiruchirappalli - 621105.",
        "• Official Contact: 1800 202 4565 | 0431 - 2258900 | admissions@srmtrichy.edu.in."
      ]
    }
  ]);
}

export async function generateAllPdfs() {
  console.log("Generating all 6 official comprehensive SRM Trichy PDFs...");
  await generateAdmissionsPdf();
  await generateAcademicPdf();
  await generatePlacementsPdf();
  await generateHostelsPdf();
  await generateFeesPdf();
  await generateGovernancePdf();
  console.log("All 6 official PDFs successfully generated in server/data/docs/ !");
}

if (process.argv[1] && process.argv[1].endsWith("generate-all-pdfs.js")) {
  generateAllPdfs().catch(err => {
    console.error("PDF generation failed:", err);
    process.exit(1);
  });
}
