import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "..", "server", "data", "docs");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function buildEngineeringPdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const themeColor = rgb(0.06, 0.22, 0.45); // SRM Blue

  function addPage(title, lines) {
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

    page.drawText(title.toUpperCase(), {
      x: 35,
      y: height - 50,
      size: 9.5,
      font: font,
      color: rgb(0.9, 0.95, 1)
    });

    let y = height - 85;
    for (const item of lines) {
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

      if (y < 45) break;
    }

    // Footer
    page.drawText("Faculty of Engineering and Technology | https://www.srmtrichy.edu.in/institution/engineering-and-technology", {
      x: 35,
      y: 22,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  // Page 1: Overview, Leadership & Schools
  addPage("Engineering & Technology — Dean, Mission & Schools", [
    "## 1. FACULTY OF ENGINEERING AND TECHNOLOGY OVERVIEW",
    "The Faculty of Engineering and Technology at SRM IST Tiruchirappalli is a center of global excellence,",
    "accredited with NAAC A++ and Category-1 Deemed University status by UGC. It offers cutting-edge",
    "industry-driven education across Computer Science, AI, Cyber Security, ECE, Biotechnology, and Mechanical.",
    "",
    "## 2. ACADEMIC LEADERSHIP & ASSOCIATE DEAN",
    "• Associate Dean: Dr. Balasundaram R (Professor & Associate Dean, 30+ Years Academic & Research Experience).",
    "• Dean's Vision: Nurturing creativity, critical thinking, and problem-solving through comprehensive curricula,",
    "  interdisciplinary research, and active industry partnerships addressing real-world technical challenges.",
    "",
    "## 3. SCHOOLS UNDER FACULTY OF ENGINEERING AND TECHNOLOGY",
    "• School of Computing: Computing, AI, Data Science, Cyber Security, IT, and Software Engineering.",
    "• School of Electrical & Electronics Engineering: ECE, VLSI Design, IoT, 5G Wireless, and Robotics.",
    "• School of Biosciences & Technology: Genetic Engineering, Industrial Biotechnology, and Bio-pharma.",
    "• School of Mechanical Engineering: CAD/CAM, Robotics, Electric Vehicles (EV), and Industrial Automation."
  ]);

  // Page 2: All Programmes, Eligibility & Fees
  addPage("Engineering & Technology — Programmes, Eligibility & Fees", [
    "## 1. UNDERGRADUATE B.TECH PROGRAMMES (4 YEARS)",
    "• B.Tech Computer Science and Engineering (CSE) — Annual Fee: Rs. 2,00,000 to Rs. 2,50,000.",
    "• B.Tech CSE with Specialization in Artificial Intelligence and Machine Learning (AIML).",
    "• B.Tech CSE with Specialization in Cyber Security (with Fortinet Industry Lab).",
    "• B.Tech CSE with Specialization in Data Sciences (Data Scientist, ML Engineer roles).",
    "• B.Tech Artificial Intelligence and Data Science (AI & DS) with NVIDIA GPU Labs.",
    "• B.Tech Artificial Intelligence and Future Technologies.",
    "• B.Tech Software Product Engineering (Product Architecture & Agile Dev).",
    "• B.Tech Computer Science and Business Systems (CSBS - Technology & Business Analytics).",
    "• B.Tech Information Technology (IT) — Cloud architectures, mobile tech, and enterprise networking.",
    "• B.Tech Electronics & Communication Engineering (ECE) — Annual Fee: Rs. 1,50,000 to Rs. 2,00,000.",
    "• B.Tech Biotechnology — Annual Fee: Rs. 1,50,000 to Rs. 2,00,000.",
    "• B.Tech Mechanical Engineering — Annual Fee: Rs. 1,50,000 to Rs. 2,00,000.",
    "",
    "## 2. POSTGRADUATE & RESEARCH DEGREES",
    "• M.Tech CSE with Specialization in AI & ML (2 Years) — Annual Fee: Rs. 1,00,000 to Rs. 1,50,000.",
    "• Ph.D. in Engineering & Technology — Full-Time and Part-Time doctoral research under Ph.D. guides.",
    "",
    "## 3. ELIGIBILITY NORMS (AICTE & SRM IST REGULATIONS)",
    "• 10+2 pattern passed with Minimum 60% aggregate in Physics, Chemistry, and Mathematics (PCM).",
    "• Without 12th Mathematics, direct admission into B.Tech Engineering is strictly not permitted.",
    "• Admissions accepted via SRMJEEE National Entrance Rank or Direct 12th Board PCM Merit.",
    "• 3-Year Polytechnic Diploma holders with 60%+ are eligible for Direct 2nd Year Lateral Entry B.Tech."
  ]);

  // Page 3: Cutting-Edge Laboratories & Centers of Excellence
  addPage("Engineering & Technology — Advanced Labs & Infrastructure", [
    "## 1. APPLE iMAC LAB (APP DEVELOPMENT CENTER OF EXCELLENCE)",
    "• Established in direct collaboration with Apple Inc.",
    "• Hardware: Premium Apple iMac workstations and MacBooks.",
    "• Software & Tools: Apple Xcode, Swift programming environment, iOS/iPadOS/macOS SDKs.",
    "• Training: Hands-on iOS app development, Apple Developer certifications, and mobile app incubation.",
    "",
    "## 2. AUGMENTED REALITY & VIRTUAL REALITY LAB (ARVR LAB)",
    "• Hands-on immersive technology facility equipped with modern AR/VR headsets and tracking systems.",
    "• Project Domains: Interactive education, healthcare anatomy simulations, gaming, and industrial digital twins.",
    "",
    "## 3. FORTINET CYBER SECURITY INDUSTRY LABORATORY",
    "• Dedicated defense-grade infrastructure: FortiGate Next-Gen Firewalls, FortiAnalyzer, FortiManager, FortiSIEM.",
    "• Hands-on training in Threat Monitoring, SIEM Security Operations Center (SOC), and Ethical Hacking.",
    "• Industry engagement with Cisco Networking Academy and Fortinet certification pathways.",
    "",
    "## 4. NVIDIA GPU ARTIFICIAL INTELLIGENCE COMPUTING LABS",
    "• High-performance GPU computing clusters powering Deep Learning, Neural Networks, Computer Vision, and NLP.",
    "• High-speed 1 Gbps campus-wide optical fiber network connecting all engineering laboratories 24/7."
  ]);

  // Page 4: Student Technical Chapters, Placements & Careers
  addPage("Engineering & Technology — Chapters, Placements & Careers", [
    "## 1. PROFESSIONAL STUDENT CHAPTERS & HACKATHONS",
    "• ACM Student Chapter & IEEE Student Chapter for engineering research, symposia, and global networking.",
    "• Annual FLABS Internal Hackathon: Real-world prototyping and interdisciplinary software innovation.",
    "• Capture The Flag (CTF) Competitions & Ethical Hacking challenges organized by Cyber Security dept.",
    "",
    "## 2. ENGINEERING PLACEMENT STATISTICS (2025-2026)",
    "• 95%+ of eligible engineering students successfully placed in top tech companies.",
    "• Highest Salary Package: Rs. 50.00 LPA (50 Lakhs Per Annum).",
    "• Average Salary Package: Rs. 8.50 LPA across computing and core engineering disciplines.",
    "• 600+ Top Recruiting Companies: Amazon, Microsoft, Google, Adobe, Zoho, TCS, Infosys, Wipro,",
    "  Cognizant, Accenture, Bosch, Renault Nissan, L&T Technology Services, Barclays, Deloitte.",
    "",
    "## 3. 4-YEAR CAREER DEVELOPMENT CENTRE (CDC) ROADMAP",
    "• Year 1: Foundational verbal aptitude, logical reasoning, and technical presentation skills.",
    "• Year 2: Data Structures & Algorithms (DSA), Full-Stack web development, and Git version control.",
    "• Year 3: System Design, Cloud Computing (AWS/Azure/GCP), AI projects, and paid summer internships.",
    "• Year 4: Intensive mock technical & HR interviews, portfolio optimization, and dream campus drives.",
    "",
    "## 4. ADMISSIONS HELPLINE & ONLINE PORTAL",
    "• Online Application URL: https://admissions.srmtrichy.edu.in/",
    "• Application Fee: Rs. 1,200 | National Toll-Free: 1800 202 4565 | Email: admissions@srmtrichy.edu.in"
  ]);

  const pdfBytes = await pdfDoc.save();
  const dest = path.join(DOCS_DIR, "SRM_Trichy_Faculty_of_Engineering_and_Technology_Comprehensive_Guide_2026.pdf");
  fs.writeFileSync(dest, pdfBytes);
  console.log(`Generated: SRM_Trichy_Faculty_of_Engineering_and_Technology_Comprehensive_Guide_2026.pdf (${pdfBytes.length} bytes, 4 pages)`);
}

buildEngineeringPdf();
