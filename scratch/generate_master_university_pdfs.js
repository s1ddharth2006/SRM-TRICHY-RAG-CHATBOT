import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "..", "server", "data", "docs");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

function createPdfBuilder(themeColor) {
  return async function buildPdf(filename, pages) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const p of pages) {
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();

      // Top banner
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
            size: 9.0,
            font: font,
            color: rgb(0.12, 0.12, 0.12)
          });
          y -= 13.5;
        } else {
          page.drawText(item, {
            x: 35,
            y,
            size: 9.0,
            font: font,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 13.5;
        }

        if (y < 42) break;
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

// 1. Prospectus & Governance
async function genProspectus() {
  const build = createPdfBuilder(rgb(0.06, 0.22, 0.45));
  await build("01_SRM_Trichy_Complete_University_Prospectus_and_Governance_2026.pdf", [
    {
      title: "University Overview, Vision, Mission & Accreditations",
      lines: [
        "## 1. UNIVERSITY PROFILE & CATEGORY-1 AUTONOMY",
        "SRM Institute of Science and Technology (SRM IST), Tiruchirappalli Campus, is a premier Category-1",
        "Deemed-to-be University accredited with the highest NAAC A++ Grade by the Government of India.",
        "Situated on a 50+ acre eco-friendly smart campus along the Trichy-Chennai National Highway (NH-45)",
        "near the famous Samayapuram temple in Tiruchirappalli, Tamil Nadu (PIN: 621105).",
        "",
        "## 2. STATUTORY ACCREDITATIONS & GLOBAL RECOGNITION",
        "• NAAC A++ Grade (Highest possible institutional accreditation in India).",
        "• UGC / MHRD Category-1 Deemed to be University status with complete academic autonomy.",
        "• AICTE Approved Technical Engineering, Computing, and MBA Management Programmes.",
        "• ABET (USA) Accredited Engineering Curricula meeting Washington Accord global mobility.",
        "• ISO 9001 Certified Quality Management for high-standard teaching and research.",
        "",
        "## 3. APEX UNIVERSITY LEADERSHIP",
        "• Founder Chancellor: Dr. T. R. Paarivendhar (Member of Parliament, Philanthropist, Visionary).",
        "• Pro-Chancellor (Administration): Dr. Ravi Pachamoothoo.",
        "• Pro-Chancellor (Academics): Dr. P. Sathyanarayanan.",
        "• Vice Chancellor: Dr. C. Muthamizhchelvan.",
        "• Registrar: Dr. S. Ponnusamy.",
        "",
        "## 4. CAMPUS LOCATION & REACHABILITY",
        "• Location: SRM Nagar, NH-45 Trichy-Chennai Highway, near Samayapuram Toll Plaza, Trichy - 621105.",
        "• Connectivity: 20 km from Trichy Central Bus Stand and Railway Junction; 25 km from Trichy Airport (TRZ).",
        "• Helpline Toll-Free: 1800 202 4565 | Campus Office: 0431 - 2258900 | admissions@srmtrichy.edu.in."
      ]
    }
  ]);
}

// 2. Engineering & Technology Master
async function genEngineering() {
  const build = createPdfBuilder(rgb(0.08, 0.28, 0.55));
  await build("02_SRM_Trichy_Faculty_of_Engineering_and_Technology_Master_2026.pdf", [
    {
      title: "Engineering & Technology — Leadership, Schools & Curricula",
      lines: [
        "## 1. FACULTY LEADERSHIP & ACADEMIC STRUCTURE",
        "• Professor & Associate Dean: Dr. Balasundaram R (30+ Years Teaching & Research Experience).",
        "• School of Computing: Computing, Artificial Intelligence, Data Science, and Cyber Security.",
        "• School of Electrical & Electronics: ECE, VLSI Design, IoT, 5G Wireless, and Robotics.",
        "• School of Biosciences: Biotechnology and Food Technology.",
        "• School of Mechanical Engineering: CAD/CAM, Automation, and Electric Vehicles (EV).",
        "",
        "## 2. DISTINGUISHED HEADS OF DEPARTMENTS (HODs)",
        "• HoD Computer Science and Engineering (CSE): Dr. S. Kanaga Suba Raja (Professor & HoD).",
        "• HoD Cyber Security: Dr. R. Deebalakshmi (Associate Professor & HoD).",
        "• HoD AI & ML / Assistant Dean (Research): Dr. R. Balaji Ganesh.",
        "• HoD Artificial Intelligence: Dr. S. Shanmuga Priya.",
        "• HoD Big Data Analytics & Data Science: Dr. Yuvaraj Duraisamy.",
        "• HoD Information Technology (IT): Dr. Jubilant J. Kizhakkethottam (Professor & HoD).",
        "• HoD Computer Science & Business Systems (CSBS): Dr. E. Mohanraj (Professor & HoD).",
        "• HoD Electronics & Communication (ECE): Dr. P. Murugapandiyan (Professor & HoD).",
        "• HoD ECE Data Science: Dr. Rajasekar R | HoD EEE: Dr. Dheepanchakkravarthy A.",
        "• HoD Biotechnology: Dr. S. Hemanth Phani Kumar | HoD Food Tech: Dr. M. Maria Leena."
      ]
    },
    {
      title: "Engineering & Technology — Advanced Industry Labs & Hackathons",
      lines: [
        "## 1. APPLE iMAC APP DEVELOPMENT CENTER OF EXCELLENCE",
        "• Established directly with Apple Inc., equipped with Apple iMacs, MacBooks, Xcode, and Swift.",
        "• Training covers iOS/iPadOS app development, mobile architecture, and official Apple certifications.",
        "",
        "## 2. AUGMENTED & VIRTUAL REALITY (AR/VR) LAB",
        "• Immersive computing lab with modern VR/AR headsets and spatial tracking systems.",
        "• Applications in medical anatomy simulations, virtual surgical training, gaming, and industrial digital twins.",
        "",
        "## 3. FORTINET CYBER SECURITY INDUSTRY LABORATORY",
        "• Equipped with FortiGate Next-Gen Firewalls, FortiAnalyzer, FortiManager, and FortiSIEM.",
        "• Hands-on threat intelligence, Security Operations Center (SOC) monitoring, and network defense.",
        "",
        "## 4. NVIDIA GPU LABS & CISCO ACADEMY",
        "• High-performance NVIDIA GPU clusters for Deep Learning, Neural Networks, Computer Vision, and NLP.",
        "• Cisco Networking Academy for enterprise routing, switching, and cloud infrastructure.",
        "",
        "## 5. STUDENT CLUBS & HACKATHONS",
        "• Active ACM and IEEE Student Chapters for student research papers and technical symposia.",
        "• Annual FLABS Internal Hackathon fostering product prototyping and startup innovation.",
        "• Capture the Flag (CTF) Ethical Hacking Competitions organized by the Cyber Security department."
      ]
    }
  ]);
}

// 3. Management & Commerce
async function genManagement() {
  const build = createPdfBuilder(rgb(0.5, 0.2, 0.1));
  await build("03_SRM_Trichy_Faculty_of_Management_and_Commerce_2026.pdf", [
    {
      title: "Management & Commerce — MBA, BBA & B.Com Programmes",
      lines: [
        "## 1. FACULTY OF MANAGEMENT LEADERSHIP & MBA PROGRAMMES",
        "• Associate Dean: Dr. Prabir Chandra Padhy (Faculty of Management).",
        "• MBA General Management (2 Years) — Annual Fee: Rs. 1,75,000 to Rs. 2,25,000.",
        "• MBA Specializations: Finance, Marketing, Human Resource Management, Business Analytics,",
        "  Operations Management, and Healthcare & Hospital Management (HoD: Dr. R. Somasundaram).",
        "• HoD MBA: Dr. P. Parthiban | HoD BBA: Dr. J. Saradha (Bachelor of Business Administration - 3 Years).",
        "• Eligibility: Undergraduate degree in any discipline with min 50% aggregate + SRM MAT / CAT / TANCET.",
        "",
        "## 2. SCHOOL OF COMMERCE & ECONOMICS",
        "• HoD Commerce: Dr. Manivannan N.",
        "• B.Com. General (3 Years) — Annual Fee: Rs. 75,000 to Rs. 95,000.",
        "• B.Com. Accounting and Finance (3 Years) — Tailored for CA, CMA, and ACCA aspirants.",
        "• B.Com. Logistics (Honours - 3 Years) — Apprenticeship Embedded Degree Programme (AEDP).",
        "• B.Com. Information Systems and Management (ISM - 3 Years) — Blending commerce and ERP IT.",
        "• Eligibility: 10+2 Higher Secondary with Commerce, Accountancy, Economics, or Business Studies."
      ]
    }
  ]);
}

// 4. Science & Humanities
async function genScienceHumanities() {
  const build = createPdfBuilder(rgb(0.15, 0.4, 0.35));
  await build("04_SRM_Trichy_Faculty_of_Science_and_Humanities_2026.pdf", [
    {
      title: "Science & Humanities — Computing, Hotel Management & Languages",
      lines: [
        "## 1. COMPUTER APPLICATIONS & DATA SCIENCE (BCA & MCA)",
        "• HoD Computer Science: Dr. P. Lakshmi.",
        "• B.C.A. (Bachelor of Computer Applications - 3 Years) — Annual Fee: Rs. 80,000 to Rs. 1,05,000.",
        "• B.C.A. Data Science (3 Years) — Big Data, Python analytics, visualization, and cloud computing.",
        "• B.Sc. Computer Science (3 Years) — Software engineering, database systems, and mobile apps.",
        "• M.C.A. (Master of Computer Applications - 2 Years) — Full-stack web and enterprise development.",
        "• M.C.A. with Specialization in Generative AI Degree (2 Years) — Large Language Models & GenAI tools.",
        "• M.Sc. Applied Data Science (2 Years) — Predictive modeling, machine learning, and business intelligence.",
        "",
        "## 2. INSTITUTE OF HOTEL MANAGEMENT (HOSPITALITY)",
        "• B.Sc. Hotel and Hospitality Administration (3 Years / Optional 4th Year Honours under NEP).",
        "• Diploma in Hotel Management and Catering Science (3 Years).",
        "• State-of-the-art training commercial kitchens, mock bakery, guest suites, and front-office lab.",
        "• 100% placement track record in 5-Star luxury hotel chains: Taj, Marriott, Oberoi, and ITC.",
        "",
        "## 3. BASIC SCIENCES & LANGUAGES",
        "• Division of Mathematics: Dr. R. Sowrirajan (Associate Professor & HoD).",
        "• Division of Physics: Dr. D. Rajeswari (Associate Professor & HoD).",
        "• School of Language: Dr. C. Shanmuga Priya (Associate Professor & HoD)."
      ]
    }
  ]);
}

// 5. Health Sciences, Medical & Physiotherapy
async function genHealthSciences() {
  const build = createPdfBuilder(rgb(0.45, 0.1, 0.25));
  await build("05_SRM_Trichy_Health_Sciences_Medical_and_Physiotherapy_2026.pdf", [
    {
      title: "Health Sciences — 750-Bed Hospital, BPT, BOT & Allied Health",
      lines: [
        "## 1. 750-BED SRM SUPER SPECIALITY TEACHING HOSPITAL",
        "• Modern tertiary-care teaching hospital on campus with 24/7 emergency casualty, ICU, and ambulances.",
        "• Extensive clinical facilities: MRI, CT Scan, Cardiac Catheterization Lab, Dialysis Unit, and Blood Bank.",
        "• Subsidized and free healthcare services, consultations, and pharmacy for SRM students and faculty.",
        "",
        "## 2. COLLEGE OF PHYSIOTHERAPY (BPT & MPT)",
        "• Bachelor of Physiotherapy (BPT - 4.5 to 5 Years including 1 Year Comprehensive Clinical Internship).",
        "• Master of Physiotherapy (MPT - 2 Years) in 7 Specializations: Musculoskeletal Science, Neuroscience,",
        "  Cardio-Pulmonary Science, Sports Science, Pediatrics & Neonatology, Obstetrics & Gynecology, Oncology.",
        "• Clinical Postings: Daily hands-on clinical patient rehabilitation in hospital outpatient and inpatient wards.",
        "",
        "## 3. COLLEGE OF OCCUPATIONAL THERAPY (BOT & MOT)",
        "• Associate Dean: Dr. D. Suresh, Ph.D. (College of Occupational Therapy).",
        "• Bachelor of Occupational Therapy (BOT - 5 Years including 1 Year Internship).",
        "• Master of Occupational Therapy (MOT - 2 Years) & Ph.D. in Occupational Therapy.",
        "• 11 Specialized rehabilitation laboratories aligned with National NCAHP Act 2021 standards.",
        "",
        "## 4. ALLIED HEALTH SCIENCES (10 SPECIALIZED CLINICAL DISCIPLINES)",
        "• B.Sc. & M.Sc. Physician Associate | B.Sc. & M.Sc. Dialysis Therapy Technology.",
        "• B.Sc. & M.Sc. Anesthesia & Operation Theatre Technology | B.Sc. & M.Sc. Medical Laboratory Science.",
        "• B.Sc. & M.Sc. Respiratory Technology | B.Sc. Emergency Medical Technologist | M.Sc. Advanced Care Paramedic.",
        "• Bachelor & Master of Optometry | Bachelor & Master of Nutrition and Dietetics.",
        "• Bachelor & Master of Medical Radiology and Imaging Technology."
      ]
    }
  ]);
}

// 6. Placements & CDC
async function genPlacements() {
  const build = createPdfBuilder(rgb(0.08, 0.45, 0.3));
  await build("06_SRM_Trichy_Placements_Corporate_Relations_and_CDC_2026.pdf", [
    {
      title: "Career Development Centre — Annual Placement Report 2026",
      lines: [
        "## 1. KEY PLACEMENT MILESTONES (2025-2026)",
        "• Overall Placement Percentage: 95%+ of eligible registered students successfully placed.",
        "• Highest Salary Package: Rs. 50.00 LPA (50 Lakhs Per Annum).",
        "• Average Salary Package: Rs. 8.50 LPA across Engineering, Management, and Computing.",
        "• Corporate Recruiters: 600+ National, Multinational, and Fortune 500 enterprises visiting the campus.",
        "• Super Dream Offers (Rs. 10 LPA and above): 320+ premium offers extended.",
        "",
        "## 2. TOP CORPORATE RECRUITERS",
        "• Product Giants: Amazon, Microsoft, Google, Adobe, Zoho Corporation, PayPal.",
        "• IT & Consulting Leaders: TCS (Ninja & Digital), Infosys, Wipro, Cognizant, Accenture, Capgemini.",
        "• Core Engineering: Bosch, Renault Nissan, L&T Technology Services, Hyundai Mobis.",
        "• Banking & Financial Analytics: Barclays, Deloitte, Ernst & Young, HDFC Bank, Standard Chartered.",
        "",
        "## 3. CAREER DEVELOPMENT CENTRE (CDC) 4-YEAR FRAMEWORK",
        "• Year 1: Foundational aptitude, verbal reasoning, communication bootcamps, and personality grooming.",
        "• Year 2: Data Structures, Algorithms (DSA), Full-Stack web development, and open-source contributions.",
        "• Year 3: System Design, Cloud certifications (AWS/Azure/GCP), AI hackathons, and paid summer internships.",
        "• Year 4: Mock technical and HR interview panels, portfolio optimization, and dream placement drives.",
        "",
        "## 4. PLACEMENT CONTACT DIRECTORY",
        "• Email: placements@srmist.edu.in | dean.placement.try@srmist.edu.in | placementofficer.try@srmist.edu.in."
      ]
    }
  ]);
}

// 7. Hostels, Dining & Transport
async function genHostels() {
  const build = createPdfBuilder(rgb(0.55, 0.22, 0.1));
  await build("07_SRM_Trichy_Hostels_Dining_Transport_and_Campus_Life_2026.pdf", [
    {
      title: "Hostel Living, Dining Standards, Transport & Sports Facilities",
      lines: [
        "## 1. RESIDENTIAL HOSTEL BLOCKS (BOYS & GIRLS)",
        "• Dedicated separate blocks for Boys and Girls secured with biometric turnstiles and 24/7 CCTV.",
        "• Room Options: 2-sharing, 3-sharing, and 4-sharing in Air Conditioned (AC) and Non-AC configurations.",
        "• Annual Hostel Fee: Rs. 85,000 to Rs. 1,35,000 per year (covers room, electricity, all meals, Wi-Fi).",
        "• Timings & Curfew: 8:30 PM for Boys hostel; 7:00 PM for Girls hostel. Digital warden approval for outings.",
        "",
        "## 2. HYGIENIC DINING & FOOD STANDARDS",
        "• Steam-automated central kitchens preparing 4 fresh, nutritious meals daily (Breakfast, Lunch, Snacks, Dinner).",
        "• Multi-cuisine menu featuring authentic South Indian and North Indian vegetarian and non-vegetarian.",
        "• Multi-stage commercial RO water purification plants on every floor with regular lab quality testing.",
        "",
        "## 3. 40+ COLLEGE BUS TRANSPORT NETWORK",
        "• Comprehensive fleet of 40+ air-conditioned and regular buses operating across Central Tamil Nadu.",
        "• Routes: Trichy Central, Chathiram Bus Stand, Srirangam, Thanjavur, Karur, Perambalur, Pudukkottai, Ariyalur.",
        "• Annual Transport Fee: Rs. 25,000 to Rs. 40,000 per year based on boarding distance.",
        "",
        "## 4. SPORTS, ATHLETICS & CENTRAL LIBRARY",
        "• Full-sized cricket turf ground, football field, basketball court, volleyball, indoor badminton courts, and gym.",
        "• Multi-storey Central Digital Library: 50,000+ volumes, IEEE, ScienceDirect, and quiet AC reading halls."
      ]
    }
  ]);
}

// 8. Admissions, Scholarships & Portals
async function genAdmissions() {
  const build = createPdfBuilder(rgb(0.2, 0.15, 0.45));
  await build("08_SRM_Trichy_Admissions_Eligibility_Scholarships_and_Portals_2026.pdf", [
    {
      title: "Admissions Norms, Merit Scholarships & Official Portals",
      lines: [
        "## 1. B.TECH ELIGIBILITY CRITERIA & MATHS MANDATE",
        "• Minimum 60% aggregate in 12th Higher Secondary (Physics, Chemistry, and Mathematics - PCM).",
        "• Without 12th Mathematics, direct admission into B.Tech Engineering is strictly not permitted.",
        "• Direct admission via SRMJEEE National Entrance Rank or 12th Board PCM Merit Score.",
        "• 3-Year Polytechnic Diploma holders with 60%+ marks are eligible for Direct 2nd Year Lateral Entry.",
        "",
        "## 2. MERIT & SPORTS SCHOLARSHIP SCHEMES",
        "• 90%+ in 12th Board Examinations: 50% Tuition Fee Waiver for all 4 years (subject to CGPA).",
        "• 80% to 89% in 12th Board Examinations: 25% Tuition Fee Waiver.",
        "• SRMJEEE Top 100 National Rankers: Up to 100% full tuition fee concession.",
        "• Sports Quota: Up to 100% tuition and hostel fee waiver for State/National medalists.",
        "• Bank Loan Assistance: Prompt Bonafide & Fee Estimates issued for SBI, Canara Bank, Indian Bank.",
        "",
        "## 3. OFFICIAL ADMISSION PORTALS & HELPLINE",
        "• UG & PG Online Admissions: https://admissions.srmtrichy.edu.in/ (Application Fee: Rs. 1,200).",
        "• International Admissions: https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy",
        "• Ph.D. Doctoral Admissions: https://registration.srmtrichy.edu.in/ph-d-application-form-2027",
        "• Student Academic Portal: https://cubonline.biz/StudentLogin",
        "• National Toll-Free Helpline: 1800 202 4565 | Campus Landline: 0431 - 2258900 | admissions@srmtrichy.edu.in."
      ]
    }
  ]);
}

// 9. Research, PhD, Innovations & MoUs
async function genResearchPhd() {
  const build = createPdfBuilder(rgb(0.18, 0.22, 0.38));
  await build("09_SRM_Trichy_Research_Phd_Innovations_and_MoUs_2026.pdf", [
    {
      title: "Research, Doctoral Programs, Patents & Corporate MoUs",
      lines: [
        "## 1. RESEARCH ECOSYSTEM & FELLOWSHIPS",
        "• Assistant Dean (Research): Dr. R. Balaji Ganesh.",
        "• Full-Time & Part-Time Ph.D. Disciplines: CSE, AIML, Cyber Security, Mechanical, EEE, ECE, VLSI,",
        "  Renewable Energy, Physics, Chemistry, Mathematics, Management, Physiotherapy, and Occupational Therapy.",
        "• SRM University Research Fellowship (URF): Up to Rs. 31,000 per month for full-time research scholars.",
        "• Apply Online for Ph.D.: https://registration.srmtrichy.edu.in/ph-d-application-form-2027",
        "",
        "## 2. PATENTS, INNOVATIONS & CENTERS OF EXCELLENCE",
        "• Active Centers of Excellence: Apple iMac CoE, Fortinet Cyber Lab, AR/VR Immersive Lab, Cisco Academy.",
        "• 45+ Patents published and granted in AI diagnostics, wireless sensor networks, and sustainable energy.",
        "• External Funded Projects sponsored by DST, SERB, ICMR, and AICTE.",
        "",
        "## 3. CORPORATE MoUs & ACADEMIC COLLABORATIONS",
        "• Industry Partnerships: Tata Consultancy Services (TCS), Fortinet, Apple, Cisco Systems, Virtusa, Infosys.",
        "• Healthcare Partnerships: SRM Medical College Hospital & Research Centre for medical clinical research.",
        "• International MoUs: Global student and faculty exchange programs under SRM International Relations.",
        "• Contact: phd.info@srmtrichy.edu.in | research@srmtrichy.edu.in."
      ]
    }
  ]);
}

// 10. Master Directory of Hyperlinks & External Portals
async function genAllHyperlinks() {
  const build = createPdfBuilder(rgb(0.05, 0.35, 0.45));
  await build("10_SRM_Trichy_All_Hyperlinks_External_Portals_and_Directory_2026.pdf", [
    {
      title: "Official Hyperlinks, External Portals & University Directory",
      lines: [
        "## 1. OFFICIAL ADMISSION & APPLICATION HYPERLINKS",
        "• Main University Portal: https://www.srmtrichy.edu.in/",
        "• Online Admissions 2026: https://admissions.srmtrichy.edu.in/",
        "• Ph.D. Application Portal 2027: https://registration.srmtrichy.edu.in/ph-d-application-form-2027",
        "• International Application Portal: https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy",
        "• Student ERP Portal: https://cubonline.biz/StudentLogin",
        "",
        "## 2. ACADEMIC & INSTITUTIONAL REDIRECT HYPERLINKS",
        "• Engineering & Technology: https://www.srmtrichy.edu.in/institution/engineering-and-technology",
        "• Management Studies (DoMS): https://www.srmtrichy.edu.in/institution/management-studies",
        "• Science and Humanities: https://www.srmtrichy.edu.in/institution/science-and-humanities",
        "• Physiotherapy: https://www.srmtrichy.edu.in/institution/physiotherapy",
        "• Occupational Therapy: https://www.srmtrichy.edu.in/institution/occupational-therapy",
        "• Allied Health Sciences: https://www.srmtrichy.edu.in/institution/allied-health-sciences",
        "• Hotel Management: https://www.srmtrichy.edu.in/institution/institute-of-hotel-management",
        "• Placements: https://www.srmtrichy.edu.in/placement",
        "• Campus Life & Hostels: https://www.srmtrichy.edu.in/campus-life",
        "• Research & MoUs: https://www.srmtrichy.edu.in/research",
        "• Contact & Directions: https://www.srmtrichy.edu.in/contact",
        "",
        "## 3. CONTACTS, HOTLINES & SOCIAL PLATFORMS",
        "• Admissions Toll-Free: 1800 202 4565 | Mobile: +91 98429 16830 / +91 84899 03631",
        "• General Exchange: 0431 - 2258900 / 0431 - 2258901 | 24/7 Hospital: 0431 - 2258686",
        "• Emails: admissions@srmtrichy.edu.in | phd.info@srmtrichy.edu.in | info@srmtrichy.edu.in",
        "• X (Twitter): https://x.com/srmist_trichy | Facebook: http://facebook.com/srmist.trichy",
        "• Instagram: https://www.instagram.com/srmist.trichy/ | Location: NH-45, Samayapuram, Trichy 621105."
      ]
    }
  ]);
}

export async function generateMasterPdfs() {
  console.log("Generating full suite of 10 Master Official PDFs for SRM Trichy...");
  await genProspectus();
  await genEngineering();
  await genManagement();
  await genScienceHumanities();
  await genHealthSciences();
  await genPlacements();
  await genHostels();
  await genAdmissions();
  await genResearchPhd();
  await genAllHyperlinks();
  console.log("All 10 Master PDFs successfully generated in server/data/docs/ !");
}

generateMasterPdfs();
