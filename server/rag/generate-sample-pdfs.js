import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "..", "data", "docs");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function createProspectusPdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper to add a formatted page
  function addPageWithContent(title, lines) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Header banner
    page.drawRectangle({
      x: 0,
      y: height - 60,
      width: width,
      height: 60,
      color: rgb(0.06, 0.22, 0.45) // SRM Blue
    });

    page.drawText("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, TIRUCHIRAPPALLI", {
      x: 35,
      y: height - 35,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    page.drawText(title.toUpperCase(), {
      x: 35,
      y: height - 50,
      size: 10,
      font: font,
      color: rgb(0.85, 0.9, 1)
    });

    // Content lines
    let y = height - 90;
    for (const item of lines) {
      if (typeof item === "string") {
        if (item.startsWith("## ")) {
          y -= 8;
          page.drawText(item.replace("## ", ""), {
            x: 35,
            y,
            size: 12,
            font: fontBold,
            color: rgb(0.06, 0.22, 0.45)
          });
          y -= 18;
        } else if (item.startsWith("• ")) {
          page.drawText(item, {
            x: 45,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.15, 0.15, 0.15)
          });
          y -= 15;
        } else {
          page.drawText(item, {
            x: 35,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 15;
        }
      }
    }

    // Footer
    page.drawText("Official SRM IST Trichy Document | Helpline: 1800 202 4565 | admissions@srmtrichy.edu.in", {
      x: 35,
      y: 25,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  // Page 1: Overview & Leadership
  addPageWithContent("Official Information & Admissions Prospectus 2026 — Part 1", [
    "## 1. INSTITUTION OVERVIEW",
    "SRM Institute of Science and Technology (SRM IST), Tiruchirappalli Campus is a premier Category-1",
    "Deemed-to-be University accredited with the highest NAAC A++ grade. Situated on a sprawling 50+ acre",
    "eco-friendly smart campus along the Trichy-Chennai National Highway (NH-45) near Samayapuram.",
    "",
    "## 2. ACCREDITATIONS AND RECOGNITION",
    "• UGC Category-1 Deemed to be University status with total academic autonomy.",
    "• NAAC A++ Accreditation (Highest possible national ranking grade).",
    "• AICTE Approved Technical Engineering & Management Programs.",
    "• ABET Accredited Engineering Curricula meeting global Washington Accord standards.",
    "• ISO 9001 Certified Quality Management for academic excellence.",
    "",
    "## 3. APEX UNIVERSITY LEADERSHIP",
    "• Founder Chancellor: Dr. T. R. Paarivendhar (Member of Parliament, Philanthropist).",
    "• Pro-Chancellor (Administration): Dr. Ravi Pachamoothoo.",
    "• Pro-Chancellor (Academics): Dr. P. Sathyanarayanan.",
    "• Vice Chancellor: Dr. C. Muthamizhchelvan.",
    "• Registrar: Dr. S. Ponnusamy."
  ]);

  // Page 2: Programs & Eligibility
  addPageWithContent("Academic Programmes and Eligibility Criteria — Part 2", [
    "## 1. FACULTY OF ENGINEERING AND TECHNOLOGY (B.TECH - 4 YEARS)",
    "• B.Tech Computer Science and Engineering (CSE) - Specializations in Cloud, AI, and Full-Stack.",
    "• B.Tech Artificial Intelligence and Data Science (AI & DS) with NVIDIA GPU Computing Labs.",
    "• B.Tech Cyber Security with Defense-grade network security architecture.",
    "• B.Tech Information Technology (IT) and Electronics & Communication (ECE).",
    "• B.Tech Biotechnology, Mechanical Engineering, and Civil Engineering.",
    "",
    "## 2. B.TECH ELIGIBILITY CRITERIA (AICTE & SRM NORMS)",
    "• Candidate must have passed 10+2 / Higher Secondary Examination.",
    "• Minimum 60% aggregate marks in Physics, Chemistry, and Mathematics (PCM).",
    "• Admission via SRMJEEE national entrance rank or direct 12th Board PCM Merit.",
    "• Important: Without 12th Mathematics, direct admission into B.Tech is strictly not permissible.",
    "",
    "## 3. MANAGEMENT, SCIENCE AND HUMANITIES",
    "• MBA (2 Years): Dual specialization in Finance, Marketing, HR, and Business Analytics.",
    "• BBA (3 Years): Bachelor of Business Administration with industry internships.",
    "• BCA (3 Years): Bachelor of Computer Applications (Data Science & Cloud Computing).",
    "• B.Com (3 Years): General and Information Systems, M.Com (2 Years).",
    "",
    "## 4. HEALTH SCIENCES (SRM MEDICAL COLLEGE HOSPITAL)",
    "• BPT (Bachelor of Physiotherapy - 4.5 Years with clinical internship).",
    "• BOT (Bachelor of Occupational Therapy - 4.5 Years).",
    "• Allied Health Sciences: Hands-on clinical training at on-campus 750-bed teaching hospital."
  ]);

  // Page 3: Fee Structure & Scholarships
  addPageWithContent("Fee Structure and Merit Scholarships 2026-27 — Part 3", [
    "## 1. ANNUAL TUITION FEE STRUCTURE",
    "• B.Tech Computer Science & Engineering (CSE): Rs. 1,75,000 to Rs. 2,50,000 per year.",
    "• B.Tech Core Branches (ECE, Biotech, Mechanical): Rs. 1,50,000 to Rs. 2,00,000 per year.",
    "• MBA Program: Rs. 1,75,000 to Rs. 2,25,000 per year.",
    "• BCA / BBA / B.Com Programs: Rs. 70,000 to Rs. 1,10,000 per year.",
    "• BPT (Physiotherapy): Rs. 1,10,000 to Rs. 1,60,000 per year.",
    "• Allied Health Sciences: Rs. 90,000 to Rs. 1,40,000 per year.",
    "",
    "## 2. MERIT SCHOLARSHIP SCHEMES",
    "• 90%+ in 12th Board Exams: 50% Tuition Fee Waiver for all 4 years (subject to CGPA).",
    "• 80% to 89% in 12th Board Exams: 25% Tuition Fee Waiver.",
    "• SRMJEEE Top 100 Rankers: Up to 100% full tuition fee concession.",
    "• Sports Quota: Up to 100% tuition and hostel fee waiver for National/State medalists.",
    "• Socio-Economic and Rural Merit Grants available upon application review.",
    "",
    "## 3. APPLICATION AND COUNSELING PROCESS",
    "• Online Application URL: https://admissions.srmtrichy.edu.in/",
    "• Application Fee: Rs. 1,200 (Non-refundable, payable online).",
    "• Documents: 10th & 12th marksheets, Transfer Certificate, Community Certificate, Photo ID."
  ]);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(DOCS_DIR, "SRM_IST_Trichy_Admissions_Prospectus_2026.pdf"), pdfBytes);
  console.log("Created SRM_IST_Trichy_Admissions_Prospectus_2026.pdf");
}

async function createPlacementsPdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  function addPageWithContent(title, lines) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 0,
      y: height - 60,
      width: width,
      height: 60,
      color: rgb(0.1, 0.45, 0.3) // Emerald
    });

    page.drawText("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, TIRUCHIRAPPALLI", {
      x: 35,
      y: height - 35,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    page.drawText(title.toUpperCase(), {
      x: 35,
      y: height - 50,
      size: 10,
      font: font,
      color: rgb(0.85, 1, 0.9)
    });

    let y = height - 90;
    for (const item of lines) {
      if (typeof item === "string") {
        if (item.startsWith("## ")) {
          y -= 8;
          page.drawText(item.replace("## ", ""), {
            x: 35,
            y,
            size: 12,
            font: fontBold,
            color: rgb(0.1, 0.45, 0.3)
          });
          y -= 18;
        } else if (item.startsWith("• ")) {
          page.drawText(item, {
            x: 45,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.15, 0.15, 0.15)
          });
          y -= 15;
        } else {
          page.drawText(item, {
            x: 35,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 15;
        }
      }
    }

    page.drawText("SRM Trichy Career Development Centre (CDC) | placements@srmtrichy.edu.in", {
      x: 35,
      y: 25,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  addPageWithContent("Annual Placement and Corporate Engagement Report 2026", [
    "## 1. EXECUTIVE PLACEMENT SUMMARY",
    "SRM IST Tiruchirappalli has demonstrated an industry-leading placement track record for 2025-2026.",
    "With active corporate recruitment by global tech giants and Fortune 500 corporations.",
    "",
    "• Placement Percentage: 95%+ of eligible registered students successfully placed.",
    "• Highest Salary Package: Rs. 50.00 LPA (50 Lakhs Per Annum).",
    "• Average Salary Package: Rs. 8.50 LPA across engineering and management.",
    "• Total Recruiting Companies: 600+ top multinational and domestic enterprises.",
    "• Super Dream Offers (Rs. 10 LPA+): 320+ students selected for premium high-package roles.",
    "",
    "## 2. TOP RECRUITERS & CORPORATE PARTNERS",
    "• Tier-1 Tech Giants: Amazon, Microsoft, Google, Zoho Corporation, Adobe.",
    "• IT Consulting & Services: TCS (Ninja & Digital), Infosys, Wipro, Cognizant, Accenture, Capgemini.",
    "• Core & Product Engineering: Renault Nissan, Bosch, L&T Technology Services, Hyundai Mobis.",
    "• Finance & Analytics: Barclays, Deloitte, Ernst & Young, HDFC Bank, Standard Chartered.",
    "",
    "## 3. CAREER DEVELOPMENT CENTRE (CDC) 4-YEAR FRAMEWORK",
    "• Year 1: Foundational verbal aptitude, personality development, communication bootcamps.",
    "• Year 2: Data Structures, Algorithms (DSA), Full-Stack Web Development, Git version control.",
    "• Year 3: System Design, Cloud certifications (AWS/Azure), AI hackathons, and corporate mentorship.",
    "• Year 4: Intensive mock technical & HR interviews, resume screening, and dream placement drives."
  ]);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(DOCS_DIR, "SRM_Trichy_Placements_and_Career_Report_2026.pdf"), pdfBytes);
  console.log("Created SRM_Trichy_Placements_and_Career_Report_2026.pdf");
}

async function createHostelPdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  function addPageWithContent(title, lines) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 0,
      y: height - 60,
      width: width,
      height: 60,
      color: rgb(0.55, 0.2, 0.1) // Terracotta
    });

    page.drawText("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, TIRUCHIRAPPALLI", {
      x: 35,
      y: height - 35,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    page.drawText(title.toUpperCase(), {
      x: 35,
      y: height - 50,
      size: 10,
      font: font,
      color: rgb(1, 0.9, 0.85)
    });

    let y = height - 90;
    for (const item of lines) {
      if (typeof item === "string") {
        if (item.startsWith("## ")) {
          y -= 8;
          page.drawText(item.replace("## ", ""), {
            x: 35,
            y,
            size: 12,
            font: fontBold,
            color: rgb(0.55, 0.2, 0.1)
          });
          y -= 18;
        } else if (item.startsWith("• ")) {
          page.drawText(item, {
            x: 45,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.15, 0.15, 0.15)
          });
          y -= 15;
        } else {
          page.drawText(item, {
            x: 35,
            y,
            size: 9.5,
            font: font,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 15;
        }
      }
    }

    page.drawText("Campus Living & Student Affairs | hostel@srmtrichy.edu.in | 0431 - 2258900", {
      x: 35,
      y: 25,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  addPageWithContent("Hostel, Dining & Campus Life Handbook 2026", [
    "## 1. RESIDENTIAL HOSTEL BLOCKS",
    "SRM IST Trichy provides comprehensive residential facilities within the campus perimeter.",
    "Ensuring safety, academic concentration, and comfortable student community living.",
    "",
    "• Separate dedicated, biometric & CCTV secured blocks for Boys and Girls.",
    "• Room Configurations: 2-sharing, 3-sharing, and 4-sharing in Air Conditioned (AC) and Non-AC.",
    "• Annual Hostel Fee: Rs. 85,000 to Rs. 1,35,000 per year (covers room, electricity, food, Wi-Fi).",
    "• In-room amenities: Study tables, ergonomic chairs, individual wardrobes, high-speed Wi-Fi.",
    "• Round-the-clock security, resident wardens, and 24/7 power backup.",
    "",
    "## 2. MULTI-CUISINE DINING & FOOD STANDARDS",
    "• State-of-the-art automated, hygienic central kitchens preparing fresh nutritious meals.",
    "• Multi-cuisine menu featuring South Indian and North Indian vegetarian and non-vegetarian selections.",
    "• Multi-stage RO purified drinking water plants in every hostel floor.",
    "• Special dietary arrangements and festive banquet menus on holidays.",
    "",
    "## 3. CAMPUS HEALTHCARE, SPORTS & TRANSPORTATION",
    "• 750-Bed Teaching Hospital: On-campus SRM Super Speciality Hospital provides 24/7 emergency care.",
    "• Sports & Athletics: Full-sized cricket pitch, football turf, basketball courts, badminton, indoor gymnasium.",
    "• Transport Fleet: 40+ air-conditioned and standard university buses operating across Trichy, Thanjavur, Karur."
  ]);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(DOCS_DIR, "SRM_Trichy_Hostel_and_Campus_Life_Handbook.pdf"), pdfBytes);
  console.log("Created SRM_Trichy_Hostel_and_Campus_Life_Handbook.pdf");
}

export async function generateAllSamplePdfs() {
  await createProspectusPdf();
  await createPlacementsPdf();
  await createHostelPdf();
  console.log("All sample PDFs successfully generated!");
}

if (process.argv[1] && process.argv[1].endsWith("generate-sample-pdfs.js")) {
  generateAllSamplePdfs();
}
