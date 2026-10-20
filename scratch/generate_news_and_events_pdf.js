import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "..", "server", "data", "docs");
const catalogPath = path.join(__dirname, "..", "server", "data", "news_and_events_catalog.json");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function buildNewsPdf() {
  const events = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  console.log(`Generating News & Events PDF from ${events.length} events...`);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const themeColor = rgb(0.06, 0.22, 0.45); // SRM Navy
  const accentColor = rgb(0.85, 0.65, 0.13); // SRM Gold

  function addPage(title, lines) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Header
    page.drawRectangle({
      x: 0,
      y: height - 55,
      width: width,
      height: 55,
      color: themeColor
    });

    page.drawText("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, TIRUCHIRAPPALLI", {
      x: 35,
      y: height - 32,
      size: 11,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    page.drawText(title.toUpperCase(), {
      x: 35,
      y: height - 47,
      size: 9,
      font: fontBold,
      color: accentColor
    });

    // Footer
    page.drawLine({
      start: { x: 35, y: 35 },
      end: { x: width - 35, y: 35 },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7)
    });

    page.drawText("Official University News & Events Compendium | Website: https://www.srmtrichy.edu.in/news-and-events", {
      x: 35,
      y: 22,
      size: 8,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Content Lines
    let currentY = height - 75;
    for (const line of lines) {
      if (currentY < 50) break; // stay within margins
      const isHeader = line.startsWith("###");
      const isSub = line.startsWith("##");
      const isBullet = line.startsWith("•");

      let text = line.replace(/^#{1,4}\s*/, "");
      let f = font;
      let size = 9;
      let color = rgb(0.15, 0.15, 0.15);

      if (isSub) {
        f = fontBold;
        size = 11;
        color = themeColor;
        currentY -= 6;
      } else if (isHeader) {
        f = fontBold;
        size = 9.5;
        color = rgb(0.1, 0.3, 0.5);
        currentY -= 4;
      } else if (isBullet) {
        f = font;
        size = 8.5;
      }

      // Truncate line if too long for A4 width
      if (text.length > 95) {
        text = text.slice(0, 92) + "...";
      }

      page.drawText(text, {
        x: isBullet ? 45 : 35,
        y: currentY,
        size,
        font: f,
        color
      });

      currentY -= (size + 3.8);
    }
  }

  // --- PAGE 1: News & Events Overview ---
  addPage("OFFICIAL NEWS & EVENTS OVERVIEW", [
    "## SRM IST Tiruchirappalli - Campus News, Events & Activities",
    "SRM IST Trichy hosts a dynamic ecosystem of national and international conferences, technical",
    "hackathons, faculty development programs (FDPs), industry symposia, and cultural galas.",
    "",
    "### Key Annual Mega Events & Highlights:",
    "• Milan Cultural Fest: South India's premier multi-college cultural festival with celebrity concerts.",
    "• Tarang & Project Fiesta: Annual inter-department innovation showcase and engineering project expo.",
    "• TENSOR'26: Elite technical hackathon & endurance challenge conducted by Department of AI & DS.",
    "• International Conferences: Scopus-indexed research conferences across Engineering, Health, and MBA.",
    "• National Health Awareness Days: Periodic community mega rallies, blood drives, and hospital camps.",
    "• Industry Centers of Excellence: Inaugurations with global partners Apple, Oracle, and Fortinet.",
    "",
    "### Official Contact & Media Cell:",
    "• Website Portal: https://www.srmtrichy.edu.in/news-and-events",
    "• Campus Venue: SRM Auditorium, Open Air Theatre, and Multi-purpose Seminar Halls, SRM Nagar, NH-45.",
    "• Toll-Free Admissions Helpline: 1800 202 4565 | Office: 0431 - 2258900",
    "",
    "### Comprehensive Event Statistics:",
    `• Total Recorded Official Events: ${events.length}+ programs conducted across university faculties.`,
    "• Active Faculties: Engineering & Tech, Management (DoMS), Physiotherapy, Occupational Therapy, Allied Health.",
    "• Academic Collaborations: IIT Guwahati, IIT Delhi, Apple Inc., Oracle, Fortinet, Cisco, and AICTE-ATAL."
  ]);

  // --- PAGE 2: Computing, AI & CSE Events ---
  const compEvents = events.filter(e => e.category === "Computing & AI");
  addPage("COMPUTING, AI & CSE EVENTS", [
    "## Department of Computer Science & School of Computing Events",
    "The School of Computing actively organizes international hackathons, workshops, and CoE events.",
    "",
    "### Flagship Computing Programs:",
    "• Project Fiesta 2026 – A Mega Showcase of Innovation: Organized by Dr. S. Kanaga Suba Raja (HoD CSE).",
    "• TENSOR’26: Where Innovation Met Endurance! Flagship AI hackathon led by Dr. R. Balaji Ganesh.",
    "• Inauguration of Oracle Centre of Excellence: Advanced database, cloud computing, and ERP suites.",
    "• iOS App Development using Swift: Conducted at the Apple iMac Centre of Excellence by Ms. R. Sharanya.",
    "• Internal Hackathon 2026: University-wide coding sprint preparing teams for the Smart India Hackathon.",
    "• Power BI Data Analyst Associate One-Week FDP: Organized by Dr. N. Saranya & Dr. S. P. Ramya.",
    "• MATLAB and Simulink Integration FDP: Led by Dr. Chithradevi D for engineering modeling.",
    "• Workshop on Professional Digital Profile & Placement Readiness: Career branding by FLABS CSE.",
    "• Building Intelligent Predictive Models for Optimized Solutions: Hands-on machine learning workshop.",
    "• Prompt Engineering and Generative AI FDP: Jointly hosted with IIT Guwahati & E&ICT Academy.",
    "",
    "### Computing Laboratories Featured in Events:",
    "• Apple iMac Centre of Excellence: Dedicated Swift, macOS, and iOS native software development.",
    "• Fortinet Cyber Security SOC Lab: Live defensive capture-the-flag (CTF) security drills.",
    "• NVIDIA GPU Neural Computing Labs: Training deep learning models and large language transformers."
  ]);

  // --- PAGE 3: Mechanical, Electrical & Electronics Events ---
  addPage("ENGINEERING & TECHNOLOGY CONFERENCES", [
    "## Mechanical, Electrical & Electronics Engineering Highlights",
    "Highlighting Industry 4.0 innovations, renewable energy, and student patent achievements.",
    "",
    "### School of Mechanical Engineering:",
    "• ICIDDM 2K25: International Conference on Interactive Design and Digital Manufacturing.",
    "• AICTE-ATAL FDP on Sustainable Hydrogen Energy: Technology, Innovation, and Entrepreneurship.",
    "• Manufacturing Goes Digital: Hands-on industrial 3D printing and digital twin manufacturing.",
    "• 3D Printing & Functional Fabrication: Multi-disciplinary workshop bridging Healthcare & Pharma.",
    "",
    "### Department of Electrical & Electronics Engineering (EEE) & ECE:",
    "• 8 Patents Published by EEE Students: Heartiest congratulations for pioneering energy research.",
    "• SPICE SURGE – Ultimate LTspice Simulation Contest: Conducted under the VoltEx Innovation Club.",
    "• Green Tech Challenge – Innovate for a Sustainable Future: Hosted through ELECTRONOVA club.",
    "• Smart Grids & HVDC Technologies: Two-Day specialized national technical workshop.",
    "• Python for Data Science Industry Connect: Joint training with ECE Data Science division.",
    "• Electronics in Automotive Systems: Expert industry lecture on EV ECUs and embedded protocols.",
    "• Ayudha Pooja & Cultural Celebrations: Annual traditional celebration across engineering labs."
  ]);

  // --- PAGE 4: Management Studies (DoMS) Events ---
  addPage("MANAGEMENT STUDIES (DoMS) EVENTS", [
    "## Faculty of Management Studies – Symposia & Corporate Events",
    "DoMS bridges boardroom leadership, case-study analytics, and national business tournaments.",
    "",
    "### Flagship Business Fests & Competitions:",
    "• CONFLUENCE 2K25: Annual National Management and Business Symposium with corporate leaders.",
    "• RASRA NG 2025 – Player Pursuit (IPL Auction): Strategic bidding and budget optimization contest.",
    "• Exemplar 2025 – IPL Auction: Inter-collegiate tournament hosted at Hindustan College.",
    "• Yukti'25 TSM National-level Management Fest: High-ranking management tournament participation.",
    "• FROM VISION TO VENTURE: Executive seminar on turning ideas into venture-backed startups.",
    "• CORPORATE WALK: Executive branding and leadership development initiative by DoMS.",
    "• Best Paper Presenter Award: Won 1st place at SRM IST Ramapuram Research Conclave.",
    "• Apprenticeship Embedded Degree Programme (AEDP) in B.Com Logistics: Sensitization session.",
    "",
    "### Corporate Placement Connects:",
    "• 100% placement track record with top recruiting firms: Deloitte, HDFC, ICICI, EY, Federal Bank.",
    "• Executive internships and live Harvard Business School case study discussion sessions."
  ]);

  // --- PAGE 5: Physiotherapy, Occupational Therapy & Allied Health ---
  addPage("HEALTHCARE & MEDICAL SCIENCES EVENTS", [
    "## College of Physiotherapy, Occupational Therapy & Allied Health",
    "Regularly hosting national medical conferences, patient rallies, and clinical rehabilitation meets.",
    "",
    "### College of Physiotherapy (BPT & MPT):",
    "• REVIVE '24: 1st National Physiotherapy Conference bringing together 500+ clinical specialists.",
    "• Physio-Tech’26: 1st & 2nd National Physiotherapy Symposiums on cutting-edge rehabilitation tech.",
    "• Project Day & Project Day 2023: Annual healthcare innovation expo featuring 123+ student models.",
    "• Hands-on Spinal Manipulation Workshop: Specialized training focusing on Sacro-Iliac joint mechanics.",
    "• World Physiotherapy Day Osteoarthritis Rally: Public awareness rally from Chathiram to Anna statue.",
    "• 21st Tamil Nadu State Senior Para Athletic Championship - 2026: Official university delegation.",
    "• CME Program on Respiratory Dysfunction: Keynote by Dr. Vikram Mohan Ph.D., Bournemouth Univ UK.",
    "",
    "### College of Occupational Therapy (BOT) & Allied Health Sciences:",
    "• National Conference on Sensory Integration & Hand Splinting Workshop for pediatric rehab.",
    "• Wheelchair Marathon & Rehab Meet 2025: Fostering inclusivity and community accessibility.",
    "• DIACON2K26 National Conference: Renal Dialysis Technology annual healthcare symposium.",
    "• PERFUSE 2K26: Cardiac Perfusion Technology symposium and life-support technology demos.",
    "• National CPR Week: Critical Care Technology life-saving emergency medical demonstration.",
    "• Art Therapy Workshop & World Autism Day: Clinical Psychology community awareness program."
  ]);

  // --- PAGE 6: Biotechnology, Food Tech & Community Outreach ---
  addPage("BIOTECHNOLOGY, FOOD TECH & COMMUNITY", [
    "## Biotechnology, Food Innovation & Community Service",
    "Focusing on food safety, bio-entrepreneurship, and public welfare outreach.",
    "",
    "### Biotechnology & Food Technology Highlights:",
    "• ICMISF-2025: 4th International Conference on Microbial Innovations for a Sustainable Future.",
    "• ETILS-2025: International Conference on Emerging Trends & Innovations in Life Sciences.",
    "• 16th ICSIE 2025: International Conference on Science and Innovative Engineering.",
    "• Future Food Forum (World Food Day 2025): Innovations in food processing and nutrition security.",
    "• FoSTaC Training in Basic Manufacturing: Official Food Safety Training & Certification by FSSAI.",
    "• Moringa – Farm to Fork Ideathon: Agri-food business venture competition and farmer outreach.",
    "• 2nd International Colloquium on Bioinformatics (iCOBLET2024): Computational biology training.",
    "• Behind Every Vaccine: Specialized lecture on biopharmaceutical manufacturing and quality control.",
    "",
    "### Community Service & National Observances:",
    "• National Handwashing Week, World Immunization Day, World Cancer Day, and World TB Day.",
    "• Human Chain Against Drug Abuse & Illicit Trafficking: Mega campus student rally.",
    "• Postal Services and Aadhaar Facilitation Camp: Conducted by NSS FLABS with India Post.",
    "• 77th Independence Day & Republic Day Celebrations with voter awareness pledges."
  ]);

  const pdfBytes = await pdfDoc.save();
  const dest = path.join(DOCS_DIR, "11_Official_News_and_Events_Guide.pdf");
  fs.writeFileSync(dest, pdfBytes);
  console.log(`Saved ${dest} (${pdfBytes.length} bytes, 6 pages).`);
}

buildNewsPdf().catch(console.error);
