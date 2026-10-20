import fs from 'fs';

const original = fs.readFileSync('public/srm-tamil-widget.js', 'utf8');
const lines = original.split('\n');

// Part 1: Top of file up to line 360
const part1 = lines.slice(0, 360).join('\n') + `
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </button>
              <!-- Close Window -->
              <button class="wa-header-btn" id="niaaChatClose" type="button" title="Close">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- WhatsApp Language Sub-Bar -->
          <div class="niaa-lang-subbar">
            <span class="niaa-lang-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Language:
            </span>
            <div class="niaa-lang-bar" id="niaaLangBar">
              <button type="button" class="niaa-lang-btn active" data-lang="en">English</button>
              <button type="button" class="niaa-lang-btn" data-lang="ta">தமிழ்</button>
              <button type="button" class="niaa-lang-btn" data-lang="hi">हिंदी</button>
              <button type="button" class="niaa-lang-btn" data-lang="te">తెలుగు</button>
            </div>
          </div>

          <!-- WhatsApp Messages Canvas -->
          <div class="niaa-chat-messages" id="niaaChatMessages">
            <!-- End-to-End Encryption Notice Banner -->
            <div class="wa-encryption-banner">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Messages are end-to-end encrypted. Official SRM IST Trichy Admission Desk.</span>
            </div>
            <!-- Today date divider -->
            <div class="wa-date-divider">
              <span>TODAY</span>
            </div>
          </div>

          <!-- WhatsApp Typing Indicator -->
          <div class="niaa-typing" id="niaaTyping">
            <div class="niaa-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- WhatsApp Quick Replies Container -->
          <div class="niaa-quick-replies" id="niaaQuickReplies"></div>

          <!-- Chat Input Form -->
          <form class="niaa-chat-input-container" id="niaaChatForm">
            <input 
              type="text" 
              class="niaa-chat-input" 
              id="niaaChatInput" 
              placeholder="Type a message..." 
              autocomplete="off" 
            />
            <button type="submit" class="niaa-chat-send" id="niaaChatSend" title="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>

          <!-- Footer -->
          <div class="niaa-powered-by">
            <span>Official Admissions Desk · SRM Institute of Science and Technology</span>
          </div>
        </div>
      </div>
    \`;
    document.body.appendChild(root);

    // Elements
    const chatBtn = document.getElementById("niaaChatButton");
    const chatWindow = document.getElementById("niaaChatWindow");
    const closeBtn = document.getElementById("niaaChatClose");
    const restartBtn = document.getElementById("niaaChatRestart");
    const messagesContainer = document.getElementById("niaaChatMessages");
    const typingIndicator = document.getElementById("niaaTyping");
    const quickRepliesContainer = document.getElementById("niaaQuickReplies");
    const chatForm = document.getElementById("niaaChatForm");
    const chatInput = document.getElementById("niaaChatInput");
    const badge = document.getElementById("niaaBadge");
    const statusText = document.getElementById("niaaStatusText");
    const langBar = document.getElementById("niaaLangBar");
    const siteLangBtn = document.getElementById("srm-ta-lang");
    const indicator = document.getElementById("niaaIndicator");
    const indicatorClose = document.getElementById("niaaIndicatorClose");
    const indicatorText = document.getElementById("niaaIndicatorText");

    // State
    let isChatOpen = false;
    let currentLang = localStorage.getItem("niaa_chat_lang") || "en";
    let conversationHistory = [];

    // Lead Capture State (1st Email -> 2nd Phone -> 3rd Name)
    let leadData = null;
    try {
      leadData = JSON.parse(localStorage.getItem("niaa_lead_data") || "null");
    } catch (e) {
      leadData = null;
    }

    let leadStage = (leadData && leadData.email && leadData.phone && leadData.name) ? "DONE" : "EMAIL";

    // React Native Input Value Setter & Form Auto-fill Engine
    function setReactInputValue(input, value) {
      if (!input || !value) return;
      try {
        const prototype = Object.getPrototypeOf(input);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
        if (descriptor && descriptor.set) {
          descriptor.set.call(input, value);
        } else {
          input.value = value;
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.classList.add("mozhi-autofilled");
        setTimeout(() => input.classList.remove("mozhi-autofilled"), 4000);
      } catch (err) {
        input.value = value;
      }
    }

    // Auto-fill all on-page registration and enquiry forms
    function autofillPageForms(lead) {
      if (!lead) return false;
      let filledAny = false;

      // 1. Name
      if (lead.name) {
        const parts = lead.name.trim().split(/\\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        const fnInputs = document.querySelectorAll('input[name="firstName"], input[name="fname"], input[placeholder*="First Name" i], input[name="name"]');
        fnInputs.forEach(el => { setReactInputValue(el, firstName); filledAny = true; });

        const lnInputs = document.querySelectorAll('input[name="lastName"], input[name="lname"], input[placeholder*="Last Name" i]');
        lnInputs.forEach(el => { if (lastName) { setReactInputValue(el, lastName); filledAny = true; } });
      }

      // 2. Email
      if (lead.email) {
        const emailInputs = document.querySelectorAll('input[name="email"], input[type="email"], input[placeholder*="Email" i]');
        emailInputs.forEach(el => { setReactInputValue(el, lead.email); filledAny = true; });
      }

      // 3. Phone
      if (lead.phone) {
        const phoneInputs = document.querySelectorAll('input[name="phone"], input[type="tel"], input[placeholder*="Phone" i], input[placeholder*="Mobile" i]');
        phoneInputs.forEach(el => { setReactInputValue(el, lead.phone); filledAny = true; });
      }

      return filledAny;
    }

    // Multi-Language Strings & Knowledge Base
    const I18N = {
      en: {
        indicator: "<strong>SRM Admissions Desk</strong>: Need guidance on SRM Trichy admissions? Chat now!",
        status: "online",
        placeholder: "Type a message...",
        welcome: \`👋 **Welcome to SRM IST Trichy!**\\n\\nI'm **Mozhi AI**, your official virtual admission counselor.\\n\\nTo assist you with official admissions, eligibility, and brochure downloads, please provide your **Email ID**:\`,
        step1_email: \`📧 **Step 1 of 3: Email Address**\\nPlease enter your **Email ID** to begin:\`,
        step2_phone: \`📱 **Step 2 of 3: Mobile Number**\\nThank you! Please share your **Mobile Number** (10 digits):\`,
        step3_name: \`👤 **Step 3 of 3: Candidate Name**\\nGreat! What is your **Full Name**?\`,
        regSuccess: (name) => \`🎉 Thank you, **\${name}**! Your admission inquiry has been registered with SRM IST Trichy.\\n\\n✅ **We have pre-filled your registration form on the page!**\\n\\nHow can I help you today? Choose a topic below or ask any question:\`,
        invalidEmail: \`⚠️ Please enter a valid email address (e.g. student@gmail.com):\`,
        invalidPhone: \`⚠️ Please enter a valid 10-digit mobile number:\`,
        skipLabel: "Skip to Questions ➔",
        langSwitched: "Language switched to **English**.",
        topics: ["Admissions 2026", "Engineering & Courses", "Fee Structure & Scholarships", "Placements (₹50 LPA)", "Hostels & Accommodation", "News & Events", "Campus Life", "Contact Counselors"],
        knowledge: {
          admissions: {
            title: "Admissions 2026",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`🎓 **SRM IST Trichy Admissions Open for 2026-27!**\\n\\n**Admission Pathways:**\\n• **SRMJEEE 2026:** National entrance exam for B.Tech programs.\\n• **Direct Board Merit:** Based on 12th Board PCM marks (minimum 60% aggregate).\\n\\n**How to Apply:**\\n1. Visit the [Official SRM Trichy Admission Portal](https://www.srmtrichy.edu.in/admission)\\n2. Register and fill the application at [Apply Now Portal](https://admissions.srmtrichy.edu.in/)\\n3. Upload 10th & 12th marksheets\\n4. Pay application fee (₹1,200) online\\n5. Save application number for counseling\\n\\n**Admission Helpline:**\\n📞 Toll-Free: **1800 202 4565** | 📧 **admissions@srmtrichy.edu.in**\\n📍 [Campus Location & Contact Details](https://www.srmtrichy.edu.in/contact)\`,
            quickReplies: ["Engineering & Courses", "Fee Structure & Scholarships", "Contact Counselors"]
          },
          courses: {
            title: "Engineering & Courses",
            source: "https://www.srmtrichy.edu.in/institution/programmes",
            response: \`📚 **Academic Programs at SRM IST Trichy:**\\n\\n**Engineering (B.Tech - 4 Years):**\\n• Computer Science & Engineering (CSE)\\n• Artificial Intelligence & Data Science (AI & DS)\\n• Cyber Security\\n• Biotechnology\\n• Information Technology (IT)\\n• Electronics & Communication (ECE)\\n• Mechanical & Civil Engineering\\n\\n**Management:**\\n• MBA (Dual Specialization - 2 Years)\\n• BBA (Bachelor of Business Administration - 3 Years)\\n\\n**Science & Humanities:**\\n• BCA (Cloud Computing & DevOps / Data Science)\\n• B.Com (General / Information Systems), M.Com\\n• B.Sc & M.Sc programs\\n\\n**Health Sciences:**\\n• BPT (Bachelor of Physiotherapy - 4.5 Years)\\n• BOT (Bachelor of Occupational Therapy)\\n• Allied Health Sciences (750-bed Teaching Hospital)\\n\\n🔗 [Explore All Academic Programmes](https://www.srmtrichy.edu.in/institution/programmes)\`,
            quickReplies: ["Admissions 2026", "Fee Structure & Scholarships", "Placements (₹50 LPA)"]
          },
          fees: {
            title: "Fee Structure & Scholarships",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`💰 **Tuition & Hostel Fee Structure (2026-27):**\\n\\n**B.Tech Programs:**\\n• Tuition Fee: ₹1,75,000 – ₹2,50,000 / year (based on branch)\\n• Application Fee: ₹1,200\\n\\n**Management & Other Programs:**\\n• MBA: ₹1,75,000 – ₹2,25,000 / year\\n• BBA / BCA / B.Com: ₹70,000 – ₹1,10,000 / year\\n• BPT (Physiotherapy): ₹1,10,000 – ₹1,60,000 / year\\n\\n**Hostel & Mess Charges:**\\n• AC / Non-AC 2, 3, 4 Sharing: ₹85,000 – ₹1,35,000 / year\\n• Nutritious South & North Indian Multi-Cuisine Mess included\\n\\n**Scholarships Available:**\\n🌟 **Merit Scholarship (90%+ in 12th):** 50% tuition fee waiver\\n🌟 **Merit Scholarship (80%+ in 12th):** 25% tuition fee waiver\\n🌟 **SRMJEEE Top Rankers:** Up to 100% waiver\\n🌟 **Sports Quota:** Up to 100% fee waiver for state/national achievers\\n\\n🔗 [Official Fee Policy & Online Payment](https://www.srmtrichy.edu.in/admission)\`,
            quickReplies: ["Admissions 2026", "Hostels & Accommodation", "Contact Counselors"]
          },
          placements: {
            title: "Placements (₹50 LPA)",
            source: "https://www.srmtrichy.edu.in/placement",
            response: \`💼 **Placement Highlights at SRM IST Trichy:**\\n\\n**Placement Records:**\\n• **Highest Package:** **₹50 LPA**\\n• **Average Package:** **₹8.5 LPA**\\n• **Placement Rate:** **95%+** eligible students placed\\n• **Recruiters:** 600+ top companies visit annually\\n\\n**Top Multinational Recruiters:**\\n• Amazon, Microsoft, Google, Zoho\\n• TCS, Infosys, Wipro, Cognizant, Accenture\\n• Renault Nissan, Bosch, L&T, Deloitte, Barclays\\n\\n**Career Development Centre (CDC):**\\n✓ Coding, Full-Stack & DSA training from 1st year\\n✓ Soft Skills & Communication Bootcamps\\n✓ Mock Corporate Interviews & Live Hackathons\\n\\n🔗 [View Official Placement Report](https://www.srmtrichy.edu.in/placement)\`,
            quickReplies: ["Engineering & Courses", "Admissions 2026", "Contact Counselors"]
          },
          hostel: {
            title: "Hostels & Accommodation",
            source: "https://www.srmtrichy.edu.in/campus-life#accommodation",
            response: \`🏠 **SRM IST Trichy — Hostels & Accommodation Facilities:**\\n\\n• **Dedicated Blocks:** Separate secure, CCTV-monitored residential buildings for Boys and Girls on campus.\\n• **Room Configurations:** Modern AC and Non-AC rooms with 2, 3, and 4 sharing options.\\n• **Annual Cost:** **₹85,000 – ₹1,35,000 / year** (inclusive of boarding, food, Wi-Fi, electricity & gym).\\n• **Multi-Cuisine Dining:** Automated, hygienic mess providing nutritious South Indian & North Indian vegetarian & non-vegetarian menus.\\n• **Amenities:** 24/7 power backup, RO drinking water, Wi-Fi, medical care at on-campus 750-bed SRM Hospital.\\n\\n🔗 [Explore Hostels & Accommodation](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["Fee Structure & Scholarships", "Campus Life", "Contact Counselors"]
          },
          news: {
            title: "News & Events",
            source: "https://www.srmtrichy.edu.in/news-and-events",
            response: \`📢 **SRM IST Trichy — News, Events & Circulars:**\\n\\n• **Conferences & Workshops:** IEEE international symposia, AI & robotics hackathons, and national research workshops.\\n• **Cultural & Tech Festivities:** Annual cultural gala 'Milan / Tarang', national technical festival 'Technozion', and sports tournaments.\\n• **Official Updates:** Academic calendars, exam schedules, and corporate placement drive circulars.\\n\\n🔗 [Explore News & Events Portal](https://www.srmtrichy.edu.in/news-and-events) | [Academic Calendar](https://www.srmtrichy.edu.in/academic_calendar)\`,
            quickReplies: ["Admissions 2026", "Hostels & Accommodation", "Campus Life"]
          },
          campus: {
            title: "Campus Life",
            source: "https://www.srmtrichy.edu.in/campus-life",
            response: \`🏫 **Campus Facilities & Student Life:**\\n\\n**Campus Infrastructure:**\\n• 50+ Acres lush green eco-friendly Wi-Fi campus\\n• 50+ advanced high-tech engineering & AI computing labs\\n• Central Library with 50,000+ volumes & digital journals\\n• 750-bed SRM Super Speciality Medical College Hospital on campus\\n\\n**Sports & Recreation:**\\n• Football, cricket grounds, basketball, badminton & gymnasium\\n• 1,500-capacity air-conditioned auditorium\\n\\n**Location:**\\n📍 Trichy-Chennai NH-45 Highway, near Samayapuram Toll Plaza, Trichy - 621105\\n\\n🔗 [Explore Campus Life](https://www.srmtrichy.edu.in/campus-life) | [Hostels & Rooms](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["Hostels & Accommodation", "Engineering & Courses", "Contact Counselors"]
          },
          contact: {
            title: "Contact Counselors",
            source: "https://www.srmtrichy.edu.in/contact",
            response: \`📞 **SRM IST Trichy Admission Helpdesk:**\\n\\n**Address:**\\nSRM Institute of Science and Technology\\nSRM Nagar, Trichy-Chennai Highway (NH-45)\\nNear Samayapuram, Tiruchirappalli - 621 105, Tamil Nadu\\n\\n**Helpline Numbers:**\\n📞 Toll-Free: **1800 202 4565**\\n📞 Direct Admissions: **0431 - 2258900 / 2258901**\\n\\n**Official Email:**\\n📧 **admissions@srmtrichy.edu.in**\\n📧 **info@srmtrichy.edu.in**\\n\\n**Working Hours:**\\nMonday – Saturday: 9:00 AM – 5:00 PM\\n\\n🔗 [Online Contact Form & Directions](https://www.srmtrichy.edu.in/contact) | [Apply Online](https://admissions.srmtrichy.edu.in/)\`,
            quickReplies: ["Admissions 2026", "Fee Structure & Scholarships", "Engineering & Courses"]
          }
        }
      },
      ta: {
        indicator: "<strong>SRM சேர்க்கை மையம்</strong>: SRM திருச்சி சேர்க்கை விவரங்களை அறிய இங்கே பேசவும்!",
        status: "online",
        placeholder: "செய்தியை தட்டச்சு செய்யவும்...",
        welcome: \`👋 **SRM IST திருச்சிக்கு நல்வரவு!**\\n\\nநான் **மொழி AI (Mozhi AI)**, உங்கள் அதிகாரப்பூர்வ சேர்க்கை ஆலோசகர்.\\n\\nSRM திருச்சி சேர்க்கை வழிகாட்டுதல், தகுதிகள் மற்றும் விளக்க ஏடு பெற, முதலில் உங்கள் **மின்னஞ்சல் முகவரியை (Email ID)** உள்ளிடவும்:\`,
        step1_email: \`📧 **படி 1/3: மின்னஞ்சல் முகவரி**\\nதொடங்க உங்கள் **மின்னஞ்சலை (Email)** உள்ளிடவும்:\`,
        step2_phone: \`📱 **படி 2/3: கைபேசி எண்**\\nநன்றி! இப்போது உங்கள் **கைபேசி எண் (10 இலக்கங்கள்)** பகிரவும்:\`,
        step3_name: \`👤 **படி 3/3: மாணவர் பெயர்**\\nஅருமை! உங்கள் **முழுப் பெயரை (Full Name)** உள்ளிடவும்:\`,
        regSuccess: (name) => \`🎉 நன்றி, **\${name}**! உங்கள் சேர்க்கை விருப்பம் SRM IST திருச்சியில் பதிவு செய்யப்பட்டது.\\n\\n✅ **இணையதளத்தில் உள்ள பதிவுப் படிவத்தில் உங்கள் விவரங்கள் நிரப்பப்பட்டுள்ளன!**\\n\\nஇன்று நான் உங்களுக்கு எவ்வாறு உதவலாம்? கீழே உள்ள தலைப்பைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் கேள்வியைத் தட்டச்சு செய்யவும்:\`,
        invalidEmail: \`⚠️ தயவுசெய்து சரியான மின்னஞ்சலை உள்ளிடவும் (எ.கா: student@gmail.com):\`,
        invalidPhone: \`⚠️ தயவுசெய்து சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்:\`,
        skipLabel: "நேரடியாக கேள்விகள் கேட்க ➔",
        langSwitched: "மொழி **தமிழாக** மாற்றப்பட்டது.",
        topics: ["சேர்க்கை 2026", "பொறியியல் & படிப்புகள்", "கல்விக் கட்டணம் & சலுகை", "வேலைவாய்ப்பு (₹50 LPA)", "விடுதி வசதிகள் (Hostels)", "செய்திகள் & நிகழ்வுகள்", "வளாக வாழ்க்கை", "சேர்க்கை உதவி மையம்"],
        knowledge: {
          admissions: {
            title: "சேர்க்கை 2026",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`🎓 **SRM IST திருச்சி சேர்க்கை 2026-27 துவங்கப்பட்டது!**\\n\\n**சேர்க்கை வழிகள்:**\\n• **SRMJEEE 2026:** B.Tech பொறியியல் படிப்புகளுக்கான அகில இந்திய நுழைவுத் தேர்வு.\\n• **12-ஆம் வகுப்பு மெரிட் சேர்க்கை:** இயற்பியல், வேதியியல், கணிதத்தில் (PCM) குறைந்தபட்சம் 60% மதிப்பெண்கள்.\\n\\n**விண்ணப்பிக்கும் முறை:**\\n1. அதிகாரப்பூர்வ சேர்க்கைப் பக்கம்: [SRM திருச்சி சேர்க்கை](https://www.srmtrichy.edu.in/admission)\\n2. ஆன்லைனில் விண்ணப்பிக்க: [இப்போதே விண்ணப்பிக்கவும்](https://admissions.srmtrichy.edu.in/)\\n3. கல்விச் சான்றிதழ்களைப் பதிவேற்றி விண்ணப்பக் கட்டணம் (₹1,200) செலுத்தவும்.\\n\\n**சேர்க்கை உதவி மையம்:**\\n📞 இலவச அழைப்பு: **1800 202 4565** | 📧 **admissions@srmtrichy.edu.in**\\n📍 [முகவரி மற்றும் வரைபடம்](https://www.srmtrichy.edu.in/contact)\`,
            quickReplies: ["பொறியியல் & படிப்புகள்", "கல்விக் கட்டணம் & சலுகை", "சேர்க்கை உதவி மையம்"]
          },
          courses: {
            title: "பொறியியல் & படிப்புகள்",
            source: "https://www.srmtrichy.edu.in/institution/programmes",
            response: \`📚 **SRM IST திருச்சியில் வழங்கப்படும் பாடப்பிரிவுகள்:**\\n\\n**பொறியியல் (B.Tech - 4 ஆண்டுகள்):**\\n• கம்ப்யூட்டர் சயின்ஸ் & என்ஜினீயரிங் (CSE)\\n• AI & Data Science (செயற்கை நுண்ணறிவு & தரவு அறிவியல்)\\n• சைபர் செக்யூரிட்டி (Cyber Security)\\n• பயோடெக்னாலஜி (Biotechnology)\\n• தகவல் தொழில்நுட்பம் (IT), ECE, மெக்கானிக்கல் & சிவில்\\n\\n**மேலாண்மைப் படிப்புகள்:**\\n• MBA (2 ஆண்டுகள் - மனிதவளம், நிதி, சந்தைப்படுத்தல்)\\n• BBA (வணிக நிர்வாகவியல்)\\n\\n**கலை & அறிவியல்:**\\n• BCA (கிளவுட் கம்ப்யூட்டிங், டேட்டா சயின்ஸ்)\\n• B.Com (பொது & தகவல் அமைப்புகள்), M.Com\\n• B.Sc & M.Sc படிப்புகள்\\n\\n**மருத்துவம் & சுகாதார அறிவியல்:**\\n• BPT (இயன்முறை சிகிச்சை - 4.5 ஆண்டுகள்)\\n• BOT (தொழில்முறை சிகிச்சை)\\n• 750 படுக்கைகள் கொண்ட SRM மருத்துவமனையில் நேரடி பயிற்சி!\\n\\n🔗 [அனைத்துப் பாடப்பிரிவுகளையும் காண்க](https://www.srmtrichy.edu.in/institution/programmes)\`,
            quickReplies: ["சேர்க்கை 2026", "கல்விக் கட்டணம் & சலுகை", "வேலைவாய்ப்பு (₹50 LPA)"]
          },
          fees: {
            title: "கல்விக் கட்டணம் & சலுகை",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`💰 **கல்விக் கட்டணம் மற்றும் உதவித்தொகை விவரம்:**\\n\\n**B.Tech படிப்புகள்:**\\n• ஆண்டுக் கட்டணம்: ₹1,75,000 – ₹2,50,000 (பாடப்பிரிவைப் பொறுத்து)\\n\\n**MBA & கலை அறிவியல்:**\\n• MBA: ₹1,75,000 – ₹2,25,000 / ஆண்டு\\n• BBA / BCA / B.Com: ₹70,000 – ₹1,10,000 / ஆண்டு\\n• BPT (இயன்முறை சிகிச்சை): ₹1,10,000 – ₹1,60,000 / ஆண்டு\\n\\n**மெரிட் உதவித்தொகை சலுகைகள்:**\\n🌟 12-ஆம் வகுப்பில் 90%+ மதிப்பெண்: **50% கல்விக் கட்டணத் தள்ளுபடி**\\n🌟 12-ஆம் வகுப்பில் 80%+ மதிப்பெண்: **25% கல்விக் கட்டணத் தள்ளுபடி**\\n🌟 விளையாட்டு சாதனையாளர்கள் (Sports Quota): 100% வரை கட்டண விலக்கு\\n\\n🔗 [கட்டணக் கொள்கை & விவரங்கள்](https://www.srmtrichy.edu.in/admission)\`,
            quickReplies: ["சேர்க்கை 2026", "விடுதி வசதிகள் (Hostels)", "சேர்க்கை உதவி மையம்"]
          },
          placements: {
            title: "வேலைவாய்ப்பு (₹50 LPA)",
            source: "https://www.srmtrichy.edu.in/placement",
            response: \`💼 **SRM IST திருச்சி வேலைவாய்ப்பு சாதனைகள்:**\\n\\n**வேலைவாய்ப்பு புள்ளிவிவரங்கள்:**\\n• **அதிகபட்ச சம்பளம்:** **₹50 LPA**\\n• **சராசரி சம்பளம்:** **₹8.5 LPA**\\n• **வேலைவாய்ப்பு விகிதம்:** **95%+** மாணவர்கள் தேர்ச்சி\\n• **நிறுவனங்கள்:** 600+ முன்னணி சர்வதேச நிறுவனங்கள்\\n\\n**முக்கிய நிறுவனங்கள்:**\\n• Amazon, Microsoft, Google, Zoho\\n• TCS, Infosys, Wipro, Cognizant, Accenture\\n• Renault Nissan, Bosch, L&T, Deloitte, Barclays\\n\\n**CDC தொழில் வளர்ச்சி மையம்:**\\n✓ முதல் ஆண்டிலிருந்தே கோடிங் & மென்பொருள் பயிற்சி\\n✓ திறன் மேம்பாடு மற்றும் நேர்காணல் பயிற்சிகள்\\n\\n🔗 [அதிகாரப்பூர்வ வேலைவாய்ப்பு அறிக்கை](https://www.srmtrichy.edu.in/placement)\`,
            quickReplies: ["பொறியியல் & படிப்புகள்", "சேர்க்கை 2026", "சேர்க்கை உதவி மையம்"]
          },
          hostel: {
            title: "விடுதி வசதிகள் (Hostels)",
            source: "https://www.srmtrichy.edu.in/campus-life#accommodation",
            response: \`🏠 **SRM IST திருச்சி விடுதி & தங்குமிட வசதிகள்:**\\n\\n• **தனித்தனி விடுதிகள்:** மாணவர் மற்றும் மாணவியருக்கு 24/7 சிசிடிவி மற்றும் பாதுகாவலர் கண்காணிப்புடன் கூடிய பாதுகாப்பான வளாக விடுதிகள்.\\n• **அறை தேர்வுகள்:** ஏசி (AC) மற்றும் நான்-ஏசி (Non-AC) 2, 3 மற்றும் 4 நபர்கள் தங்கும் வசதியான அறைகள்.\\n• **கட்டணம்:** ஆண்டுக்கு சுமார் ₹85,000 முதல் ₹1,35,000 வரை (சுவையான மெஸ் உணவு, வைஃபை, உடற்பயிற்சிக் கூடம் உட்பட).\\n• **உணவு முறை:** தானியங்கி சமையலறையில் சுகாதாரமாக சமைக்கப்படும் தென்னிந்திய & வடஇந்திய சைவ, அசைவ உணவுகள்.\\n• **வசதிகள்:** 24 மணி நேர மின்சாரம், RO குடிநீர், வளாகத்திலேயே 750 படுக்கைகள் கொண்ட SRM சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை.\\n\\n🔗 [விடுதி & தங்குமிட விவரங்கள் (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["கல்விக் கட்டணம் & சலுகை", "வளாக வாழ்க்கை", "சேர்க்கை உதவி மையம்"]
          },
          news: {
            title: "செய்திகள் & நிகழ்வுகள்",
            source: "https://www.srmtrichy.edu.in/news-and-events",
            response: \`📢 **SRM IST திருச்சி — செய்திகள் மற்றும் நிகழ்வுகள் (News & Events):**\\n\\n• **மாநாடுகள் & பயிலரங்குகள்:** சர்வதேச ஆராய்ச்சி மாநாடுகள், தேசிய அளவிலான ஹேக்கத்தான்கள், IEEE கருத்தரங்குகள்.\\n• **கலாச்சார விழாக்கள்:** பிரம்மாண்டமான 'Milan / Tarang' கலாச்சார விழா மற்றும் 'Technozion' தேசிய தொழில்நுட்ப கருத்தரங்கு.\\n• **அறிவிப்புகள்:** தேர்வு அட்டவணைகள், கல்வி நாட்காட்டி மற்றும் வேலைவாய்ப்பு முகாம் தகவல்கள்.\\n\\n🔗 [அனைத்து செய்திகள் மற்றும் நிகழ்வுகள் (News & Events)](https://www.srmtrichy.edu.in/news-and-events) | [கல்வி நாள்காட்டி](https://www.srmtrichy.edu.in/academic_calendar)\`,
            quickReplies: ["சேர்க்கை 2026", "விடுதி வசதிகள் (Hostels)", "சேர்க்கை உதவி மையம்"]
          },
          campus: {
            title: "வளாக வாழ்க்கை",
            source: "https://www.srmtrichy.edu.in/campus-life",
            response: \`🏫 **வளாக வசதிகள் மற்றும் மாணவர் வாழ்க்கை:**\\n\\n• **வளாகம்:** 50+ ஏக்கர் பசுமை சூழல், முழுமையான வைஃபை (Wi-Fi) வசதி.\\n• **ஆய்வகங்கள்:** 50+ அதிநவீன பொறியியல் மற்றும் AI கம்ப்யூட்டர் லேப்கள்.\\n• **நூலகம்:** 50,000+ புத்தகங்கள் மற்றும் டிஜிட்டல் இதழ்கள் கொண்ட மத்திய நூலகம்.\\n• **மருத்துவமனை:** வளாகத்திலேயே 750 படுக்கைகள் கொண்ட SRM சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை.\\n• **விளையாட்டு:** கிரிக்கெட், கால்பந்து, கூடைப்பந்து மைதானங்கள் மற்றும் உடற்பயிற்சிக் கூடம்.\\n\\n📍 **அமைவிடம்:** திருச்சி-சென்னை தேசிய நெடுஞ்சாலை (NH-45), சமயபுரம் சுங்கச்சாவடி அருகில், திருச்சி - 621105.\\n\\n🔗 [வளாக வாழ்க்கை](https://www.srmtrichy.edu.in/campus-life) | [விடுதிகள்](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["விடுதி வசதிகள் (Hostels)", "பொறியியல் & படிப்புகள்", "சேர்க்கை உதவி மையம்"]
          },
          contact: {
            title: "சேர்க்கை உதவி மையம்",
            source: "https://www.srmtrichy.edu.in/contact",
            response: \`📞 **SRM IST திருச்சி தொடர்பு விவரங்கள்:**\\n\\n**முகவரி:**\\nSRM இன்ஸ்டிடியூட் ஆஃப் சயின்ஸ் அண்ட் டெக்னாலஜி\\nSRM நகர், திருச்சி-சென்னை நெடுஞ்சாலை (NH-45)\\nசமயபுரம் அருகில், திருச்சிராப்பள்ளி - 621 105, தமிழ்நாடு.\\n\\n**உதவி எண்கள்:**\\n📞 இலவச அழைப்பு: **1800 202 4565**\\n📞 நேரடி எண்கள்: **0431 - 2258900 / 2258901**\\n\\n**மின்னஞ்சல்:**\\n📧 **admissions@srmtrichy.edu.in**\\n📧 **info@srmtrichy.edu.in**\\n\\n**வேலை நேரம்:**\\nதிங்கள் முதல் சனி வரை: காலை 9:00 - மாலை 5:00 வரை\\n\\n🔗 [தொடர்பு மையம் & வரைபடம்](https://www.srmtrichy.edu.in/contact) | [ஆன்லைனில் விண்ணப்பிக்க](https://admissions.srmtrichy.edu.in/)\`,
            quickReplies: ["சேர்க்கை 2026", "கல்விக் கட்டணம் & சலுகை", "பொறியியல் & படிப்புகள்"]
          }
        }
      },
      hi: {
        indicator: "<strong>SRM प्रवेश केंद्र</strong>: SRM त्रिची प्रवेश एवं फीस संबंधी जानकारी के लिए यहाँ चैट करें!",
        status: "online",
        placeholder: "संदेश लिखें...",
        welcome: \`👋 **SRM IST त्रिची में आपका स्वागत है!**\\n\\nमैं **मोझी एआई (Mozhi AI)**, आपका आधिकारिक प्रवेश सहायक हूँ।\\n\\nप्रवेश प्रक्रिया, योग्यता एवं विवरणिका प्राप्त करने के लिए, कृपया अपना **ईमेल आईडी (Email ID)** दर्ज करें:\`,
        step1_email: \`📧 **चरण 1/3: ईमेल आईडी**\\nकृपया अपनी **ईमेल आईडी (Email)** दर्ज करें:\`,
        step2_phone: \`📱 **चरण 2/3: मोबाइल नंबर**\\nधन्यवाद! कृपया अपना **10 अंकों का मोबाइल नंबर** दर्ज करें:\`,
        step3_name: \`👤 **चरण 3/3: अभ्यर्थी का नाम**\\nबहुत बढ़िया! कृपया अपना **पूरा नाम (Full Name)** बताएं:\`,
        regSuccess: (name) => \`🎉 धन्यवाद, **\${name}**! आपका प्रवेश विवरण SRM IST त्रिची में दर्ज हो गया है।\\n\\n✅ **वेबसाइट के फॉर्म में आपका विवरण स्वतः भर दिया गया है!**\\n\\nआज मैं आपकी क्या सहायता कर सकता हूँ? नीचे दिए गए विकल्प चुनें या अपना प्रश्न पूछें:\`,
        invalidEmail: \`⚠️ कृपया एक मान्य ईमेल पता दर्ज करें (उदा. student@gmail.com):\`,
        invalidPhone: \`⚠️ कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें:\`,
        skipLabel: "सीधे प्रश्न पूछें ➔",
        langSwitched: "भाषा बदलकर **हिन्दी** कर दी गई है।",
        topics: ["प्रवेश 2026", "इंजीनियरिंग और पाठ्यक्रम", "फीस एवं छात्रवृत्ति", "प्लेसमेंट (₹50 LPA)", "हॉस्टल और मेस (Hostels)", "समाचार और कार्यक्रम", "कैंपस लाइफ", "परामर्शदाता संपर्क"],
        knowledge: {
          admissions: {
            title: "प्रवेश 2026",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`🎓 **SRM IST त्रिची प्रवेश सत्र 2026-27 खुला है!**\\n\\n**प्रवेश के तरीके:**\\n• **SRMJEEE 2026:** B.Tech के लिए राष्ट्रीय स्तर की प्रवेश परीक्षा।\\n• **12वीं बोर्ड मेरिट:** PCM में न्यूनतम 60% अंकों के आधार पर सीधा प्रवेश।\\n\\n**आवेदन कैसे करें:**\\n1. आधिकारिक प्रवेश पोर्टल: [SRM त्रिची प्रवेश](https://www.srmtrichy.edu.in/admission)\\n2. ऑनलाइन फॉर्म: [अभी आवेदन करें](https://admissions.srmtrichy.edu.in/)\\n3. दस्तावेज़ अपलोड करें और आवेदन शुल्क (₹1,200) का भुगतान करें।\\n\\n**हेल्पलाइन:**\\n📞 टोल-फ्री: **1800 202 4565** | 📧 **admissions@srmtrichy.edu.in**\\n📍 [कैंपस स्थान एवं संपर्क](https://www.srmtrichy.edu.in/contact)\`,
            quickReplies: ["इंजीनियरिंग और पाठ्यक्रम", "फीस एवं छात्रवृत्ति", "परामर्शदाता संपर्क"]
          },
          courses: {
            title: "इंजीनियरिंग और पाठ्यक्रम",
            source: "https://www.srmtrichy.edu.in/institution/programmes",
            response: \`📚 **SRM IST त्रिची में उपलब्ध प्रमुख पाठ्यक्रम:**\\n\\n**इंजीनियरिंग (B.Tech - 4 वर्ष):**\\n• कंप्यूटर साइंस एंड इंजीनियरिंग (CSE)\\n• आर्टिफिशियल इंटेलिजेंस एंड डेटा साइंस (AI & DS)\\n• साइबर सुरक्षा (Cyber Security)\\n• बायोटेक्नोलॉजी, आईटी, ईसीई, मैकेनिकल एवं सिविल\\n\\n**प्रबंधन पाठ्यक्रम:**\\n• MBA (2 वर्ष - ड्यूल स्पेशलाइजेशन)\\n• BBA (3 वर्ष)\\n\\n**विज्ञान एवं वाणिज्य:**\\n• BCA (क्लाउड कंप्यूटिंग एवं डेटा साइंस)\\n• B.Com, M.Com, B.Sc एवं M.Sc\\n\\n**स्वास्थ्य विज्ञान (Health Sciences):**\\n• BPT (फिजियोथेरेपी - 4.5 वर्ष)\\n• BOT (ऑक्यूपेशनल थेरेपी)\\n• 750 बेड का SRM मेडिकल अस्पताल परिसर में उपलब्ध!\\n\\n🔗 [सभी पाठ्यक्रमों की सूची देखें](https://www.srmtrichy.edu.in/institution/programmes)\`,
            quickReplies: ["प्रवेश 2026", "फीस एवं छात्रवृत्ति", "प्लेसमेंट (₹50 LPA)"]
          },
          fees: {
            title: "फीस एवं छात्रवृत्ति",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`💰 **फीस संरचना और छात्रवृत्ति (2026-27):**\\n\\n**B.Tech पाठ्यक्रम:**\\n• शिक्षण शुल्क: ₹1,75,000 – ₹2,50,000 / वर्ष\\n\\n**MBA एवं अन्य:**\\n• MBA: ₹1,75,000 – ₹2,25,000 / वर्ष\\n• BBA / BCA / B.Com: ₹70,000 – ₹1,10,000 / वर्ष\\n• BPT (फिजियोथेरेपी): ₹1,10,000 – ₹1,60,000 / वर्ष\\n\\n**हॉस्टल एवं मेस:**\\n• AC / Non-AC: ₹85,000 – ₹1,35,000 / वर्ष (स्वादिष्ट उत्तर और दक्षिण भारतीय भोजन सहित)\\n\\n**छात्रवृत्ति (Scholarships):**\\n🌟 12वीं में 90%+ अंक: **50% ट्यूशन फीस माफ़ी**\\n🌟 12वीं में 80%+ अंक: **25% ट्यूशन फीस माफ़ी**\\n🌟 स्पोर्ट्स कोटा: राष्ट्रीय स्तर के खिलाड़ियों हेतु 100% तक छूट\\n\\n🔗 [फीस विवरण एवं ऑनलाइन भुगतान](https://www.srmtrichy.edu.in/admission)\`,
            quickReplies: ["प्रवेश 2026", "हॉस्टल और मेस (Hostels)", "परामर्शदाता संपर्क"]
          },
          placements: {
            title: "प्लेसमेंट (₹50 LPA)",
            source: "https://www.srmtrichy.edu.in/placement",
            response: \`💼 **SRM IST त्रिची प्लेसमेंट रिकॉर्ड्स:**\\n\\n• **उच्चतम पैकेज:** **₹50 LPA**\\n• **औसत पैकेज:** **₹8.5 LPA**\\n• **प्लेसमेंट दर:** **95%+** योग्य छात्र चयनित\\n• **कंपनियां:** 600+ बहुराष्ट्रीय कंपनियां प्रतिवर्ष आती हैं\\n\\n**प्रमुख भर्तीकर्ता:**\\n• Amazon, Microsoft, Google, Zoho\\n• TCS, Infosys, Wipro, Cognizant, Accenture\\n• Renault Nissan, Bosch, L&T, Deloitte, Barclays\\n\\n**कैरियर डेवलपमेंट सेंटर (CDC):**\\n✓ प्रथम वर्ष से कोडिंग और तकनीकी प्रशिक्षण\\n✓ सॉफ्ट स्किल्स और मॉक इंटरव्यू की तैयारी\\n\\n🔗 [प्लेसमेंट रिपोर्ट देखें](https://www.srmtrichy.edu.in/placement)\`,
            quickReplies: ["इंजीनियरिंग और पाठ्यक्रम", "प्रवेश 2026", "परामर्शदाता संपर्क"]
          },
          hostel: {
            title: "हॉस्टल और मेस (Hostels)",
            source: "https://www.srmtrichy.edu.in/campus-life#accommodation",
            response: \`🏠 **SRM IST त्रिची हॉस्टल और भोजन सुविधाएं:**\\n\\n• **सुरक्षित परिसर हॉस्टल:** छात्र एवं छात्राओं के लिए 24/7 सुरक्षा एवं सीसीटीवी निगरानी युक्त अलग-अलग हॉस्टल ब्लॉक।\\n• **कमरों के विकल्प:** 2, 3 एवं 4 शेयरिंग में आधुनिक AC और Non-AC कमरे।\\n• **वार्षिक शुल्क:** ₹85,000 – ₹1,35,000 / वर्ष (पौष्टिक भोजन, वाई-फाई और जिम सहित)।\\n• **मेस एवं भोजन:** स्वच्छता से तैयार स्वादिष्ट उत्तर और दक्षिण भारतीय शाकाहारी एवं मांसाहारी भोजन।\\n• **अन्य सुविधाएं:** 24 घंटे पावर बैकअप, RO पेयजल, और आपातकालीन चिकित्सा हेतु 750 बेड का SRM अस्पताल।\\n\\n🔗 [हॉस्टल और आवास विवरण (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["फीस एवं छात्रवृत्ति", "कैंपस लाइफ", "परामर्शदाता संपर्क"]
          },
          news: {
            title: "समाचार और कार्यक्रम",
            source: "https://www.srmtrichy.edu.in/news-and-events",
            response: \`📢 **SRM IST त्रिची — समाचार और कार्यक्रम (News & Events):**\\n\\n• **अनुसंधान एवं कार्यशालाएं:** अंतरराष्ट्रीय सम्मेलन, हैकथॉन, IEEE तकनीकी कार्यशालाएं।\\n• **उत्सव एवं खेलकूद:** वार्षिक सांस्कृतिक उत्सव 'Milan / Tarang', राष्ट्रीय तकनीकी उत्सव 'Technozion' और खेल प्रतियोगिताएं।\\n• **परिपत्र एवं घोषणाएं:** परीक्षा समय-सारणी, प्लेसमेंट ड्राइव और शैक्षणिक कैलेंडर की अद्यतन जानकारी।\\n\\n🔗 [आधिकारिक समाचार और कार्यक्रम (News & Events)](https://www.srmtrichy.edu.in/news-and-events) | [शैक्षणिक कैलेंडर](https://www.srmtrichy.edu.in/academic_calendar)\`,
            quickReplies: ["प्रवेश 2026", "हॉस्टल और मेस (Hostels)", "परामर्शदाता संपर्क"]
          },
          campus: {
            title: "कैंपस लाइफ",
            source: "https://www.srmtrichy.edu.in/campus-life",
            response: \`🏫 **कैंपस सुविधाएं एवं जीवन:**\\n\\n• **परिसर:** 50+ एकड़ का हरा-भरा, आधुनिक वाई-फाई युक्त परिसर।\\n• **प्रयोगशालाएं:** 50+ अत्याधुनिक इंजीनियरिंग और AI कंप्यूटिंग लैब्स।\\n• **लाइब्रेरी:** 50,000+ पुस्तकों और डिजिटल जर्नल्स से सुसज्जित सेंट्रल लाइब्रेरी।\\n• **अस्पताल:** परिसर में ही 750 बेड का SRM सुपर स्पेशलिटी मेडिकल कॉलेज अस्पताल।\\n\\n📍 **स्थान:** त्रिची-चेन्नई NH-45 हाईवे, समयपुरम टोल प्लाजा के पास, त्रिची - 621105।\\n\\n🔗 [कैंपस लाइफ देखें](https://www.srmtrichy.edu.in/campus-life) | [हॉस्टल विवरण](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["हॉस्टल और मेस (Hostels)", "इंजीनियरिंग और पाठ्यक्रम", "परामर्शदाता संपर्क"]
          },
          contact: {
            title: "परामर्शदाता संपर्क",
            source: "https://www.srmtrichy.edu.in/contact",
            response: \`📞 **SRM IST त्रिची प्रवेश हेल्पडेस्क:**\\n\\n**पता:**\\nSRM इंस्टीट्यूट ऑफ साइंस एंड टेक्नोलॉजी\\nSRM नगर, त्रिची-चेन्नई हाईवे (NH-45)\\nसमयपुरम के पास, तिरुचिरापल्ली - 621 105, तमिलनाडु।\\n\\n**हेल्पलाइन नंबर्स:**\\n📞 टोल-फ्री: **1800 202 4565**\\n📞 डायरेक्ट फोन: **0431 - 2258900 / 2258901**\\n\\n**ईमेल:**\\n📧 **admissions@srmtrichy.edu.in**\\n\\n**समय:**\\nसोमवार से शनिवार: सुबह 9:00 बजे से शाम 5:00 बजे तक\\n\\n🔗 [संपर्क फॉर्म एवं नक्शा](https://www.srmtrichy.edu.in/contact) | [ऑनलाइन आवेदन](https://admissions.srmtrichy.edu.in/)\`,
            quickReplies: ["प्रवेश 2026", "फीस एवं छात्रवृत्ति", "इंजीनियरिंग और पाठ्यक्रम"]
          }
        }
      },
      te: {
        indicator: "<strong>SRM అడ్మిషన్ల డెస్క్</strong>: SRM తిరుచ్చి అడ్మిషన్ల వివరాలు మరియు మార్గదర్శనం కోసం ఇక్కడ చాట్ చేయండి!",
        status: "online",
        placeholder: "సందేశాన్ని టైప్ చేయండి...",
        welcome: \`👋 **SRM IST తిరుచిరాపల్లి క్యాంపస్‌కు స్వాగతం!**\\n\\nనేను **మొళి ఏఐ (Mozhi AI)**, మీ అధికారిక అడ్మిషన్ల సహాయకుడిని.\\n\\nSRM అడ్మిషన్లు, బ్రోచర్‌లు మరియు ప్రవేశ అర్హతల కోసం, దయచేసి మీ **ఈమెయిల్ (Email ID)** నమోదు చేయండి:\`,
        step1_email: \`📧 **దశ 1/3: ఈమెయిల్ ఐడి**\\nదయచేసి మీ **ఈమెయిల్ (Email ID)** నమోదు చేయండి:\`,
        step2_phone: \`📱 **దశ 2/3: మొబైల్ నంబర్**\\nధన్యవాదాలు! ఇప్పుడు మీ **10 అంకెల మొబైల్ నంబర్** నమోదు చేయండి:\`,
        step3_name: \`👤 **దశ 3/3: అభ్యర్థి పేరు**\\nచాలా బాగుంది! దయచేసి మీ **పూర్తి పేరు (Full Name)** చెప్పండి:\`,
        regSuccess: (name) => \`🎉 ధన్యవాదాలు, **\${name}**! మీ అడ్మిషన్ విచారణ SRM IST తిరుచ్చిలో నమోదు చేయబడింది.\\n\\n✅ **వెబ్‌సైట్‌లోని రిజిస్ట్రేషన్ ఫారమ్‌లో మీ వివరాలు భర్తీ చేయబడ్డాయి!**\\n\\nఈరోజు నేను మీకు ఎలా సహాయపడగలను? క్రింది అంశాన్ని ఎంచుకోండి లేదా మీ ప్రశ్నను టైప్ చేయండి:\`,
        invalidEmail: \`⚠️ దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి (ఉదా: student@gmail.com):\`,
        invalidPhone: \`⚠️ దయచేసి 10 అంకెల సరైన మొబైల్ నంబర్‌ను నమోదు చేయండి:\`,
        skipLabel: "నేరుగా ప్రశ్నలు అడగండి ➔",
        langSwitched: "భాష **తెలుగు** లోకి మార్చబడింది.",
        topics: ["ప్రవేశాలు 2026", "ఇంజనీరింగ్ కోర్సులు", "ఫీజుల వివరాలు & స్కాలర్‌షిప్", "ప్లేస్‌మెంట్‌లు (₹50 LPA)", "హాస్టల్ మరియు వసతి (Hostels)", "వార్తలు & ఈవెంట్లు", "క్యాంపస్ జీవితం", "హెల్ప్‌లైన్ సంప్రదించండి"],
        knowledge: {
          admissions: {
            title: "ప్రవేశాలు 2026",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`🎓 **SRM IST తిరుచిరాపల్లి ప్రవేశాలు 2026-27 ప్రారంభం!**\\n\\n**ప్రవేశ మార్గాలు:**\\n• **SRMJEEE 2026:** B.Tech ఇంజనీరింగ్ కొరకు జాతీయ ప్రవేశ పరీక్ష.\\n• **12వ తరగతి మెరిట్ ప్రవేశాలు:** 10+2 PCM లో కనీసం 60% మార్కులు.\\n\\n**దరఖాస్తు విధానం:**\\n1. అధికారిక ప్రవేశాల పేజీ: [SRM తిరుచ్చి అడ్మిషన్లు](https://www.srmtrichy.edu.in/admission)\\n2. ఆన్‌లైన్ దరఖాస్తు పోర్టల్: [ఇప్పుడే దరఖాస్తు చేయండి](https://admissions.srmtrichy.edu.in/)\\n3. సర్టిఫికెట్లు అప్‌లోడ్ చేసి ఫీజు (₹1,200) చెల్లించండి.\\n\\n**హెల్ప్‌లైన్:**\\n📞 టోల్-ఫ్రీ: **1800 202 4565** | 📧 **admissions@srmtrichy.edu.in**\\n📍 [క్యాంపస్ సంప్రదింపుల కేంద్రం](https://www.srmtrichy.edu.in/contact)\`,
            quickReplies: ["ఇంజనీరింగ్ కోర్సులు", "ఫీజుల వివరాలు & స్కాలర్‌షిప్", "హెల్ప్‌లైన్ సంప్రదించండి"]
          },
          courses: {
            title: "ఇంజనీరింగ్ కోర్సులు",
            source: "https://www.srmtrichy.edu.in/institution/programmes",
            response: \`📚 **SRM IST తిరుచిరాపల్లి లోని ప్రధాన కోర్సులు:**\\n\\n**ఇంజనీరింగ్ (B.Tech - 4 సంవత్సరాలు):**\\n• కంప్యూటర్ సైన్స్ & ఇంజనీరింగ్ (CSE)\\n• ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ & డేటా సైన్స్ (AI & DS)\\n• సైబర్ సెక్యూరిటీ (Cyber Security)\\n• బయోటెక్నాలజీ, IT, ECE, మెకానికల్ & సివిల్\\n\\n**మేనేజ్‌మెంట్ కోర్సులు:**\\n• MBA (2 సం|| - డ్యూయల్ స్పెషలైజేషన్)\\n• BBA (3 సం||)\\n\\n**సైన్స్ & కామర్స్:**\\n• BCA (క్లౌడ్ కంప్యూటింగ్ & డేటా సైన్స్)\\n• B.Com, M.Com, B.Sc & M.Sc\\n\\n**హెల్త్ సైన్సెస్ (వైద్య విభాగాలు):**\\n• BPT (ఫిజియోథెరపీ - 4.5 సం||)\\n• BOT (ఆక్యుపేషనల్ థెరపీ)\\n• క్యాంపస్‌లోనే 750 పడకల SRM సూపర్ స్పెషాలిటీ హాస్పిటల్!\\n\\n🔗 [అన్ని విద్యా కోర్సుల వివరాలు](https://www.srmtrichy.edu.in/institution/programmes)\`,
            quickReplies: ["ప్రవేశాలు 2026", "ఫీజుల వివరాలు & స్కాలర్‌షిప్", "ప్లేస్‌మెంట్‌లు (₹50 LPA)"]
          },
          fees: {
            title: "ఫీజుల వివరాలు & స్కాలర్‌షిప్",
            source: "https://www.srmtrichy.edu.in/admission",
            response: \`💰 **ఫీజుల నిర్మాణం మరియు స్కాలర్‌షిప్‌లు (2026-27):**\\n\\n**B.Tech ప్రోగ్రామ్‌లు:**\\n• ట్యూషన్ ఫీజు: ₹1,75,000 – ₹2,50,000 / సంవత్సరం\\n\\n**MBA & ఇతర కోర్సులు:**\\n• MBA: ₹1,75,000 – ₹2,25,000 / సం||\\n• BBA / BCA / B.Com: ₹70,000 – ₹1,10,000 / సం||\\n• BPT (ఫిజియోథెరపీ): ₹1,10,000 – ₹1,60,000 / సం||\\n\\n**హాస్టల్ & భోజన వసతి:**\\n• AC / Non-AC: ₹85,000 – ₹1,35,000 / సం|| (రుచికరమైన దక్షిణ & ఉత్తర భారతీయ ఆహారంతో)\\n\\n**మెరిట్ స్కాలర్‌షిప్‌లు:**\\n🌟 12వ తరగతిలో 90%+ మార్కులు: **50% ఫీజు మినహాయింపు**\\n🌟 12వ తరగతిలో 80%+ మార్కులు: **25% ఫీజు మినహాయింపు**\\n🌟 స్పోర్ట్స్ కోటా: జాతీయ స్థాయి క్రీడాకారులకు 100% వరకు ఫీజు రాయితీ\\n\\n🔗 [ఫీజు విధానం మరియు ఆన్‌లైన్ పేమెంట్](https://www.srmtrichy.edu.in/admission)\`,
            quickReplies: ["ప్రవేశాలు 2026", "హాస్టల్ మరియు వసతి (Hostels)", "హెల్ప్‌లైన్ సంప్రదించండి"]
          },
          placements: {
            title: "ప్లేస్‌మెంట్‌లు (₹50 LPA)",
            source: "https://www.srmtrichy.edu.in/placement",
            response: \`💼 **SRM IST తిరుచిరాపల్లి ప్లేస్‌మెంట్ రికార్డులు:**\\n\\n• **అత్యధిక ప్యాకేజీ:** **₹50 LPA**\\n• **సగటు ప్యాకేజీ:** **₹8.5 LPA**\\n• **ప్లేస్‌మెంట్ శాతం:** **95%+** మంది విద్యార్థులకు ఉద్యోగాలు\\n• **కంపెనీలు:** 600+ అంతర్జాతీయ సంస్థలు\\n\\n**టాప్ రిక్రూటర్లు:**\\n• Amazon, Microsoft, Google, Zoho\\n• TCS, Infosys, Wipro, Cognizant, Accenture\\n• Renault Nissan, Bosch, L&T, Deloitte, Barclays\\n\\n**కెరీర్ డెవలప్‌మెంట్ సెంటర్ (CDC):**\\n✓ 1వ సంవత్సరం నుండే కోడింగ్ మరియు సాఫ్ట్ స్కిల్స్ శిక్షణ\\n✓ మాక్ ఇంటర్వ్యూలు మరియు లైవ్ ప్రాజెక్ట్‌లు\\n\\n🔗 [అధికారిక ప్లేస్‌మెంట్ నివేదిక](https://www.srmtrichy.edu.in/placement)\`,
            quickReplies: ["ఇంజనీరింగ్ కోర్సులు", "ప్రవేశాలు 2026", "హెల్ప్‌లైన్ సంప్రదించండి"]
          },
          hostel: {
            title: "హాస్టల్ మరియు వసతి (Hostels)",
            source: "https://www.srmtrichy.edu.in/campus-life#accommodation",
            response: \`🏠 **SRM IST తిరుచిరాపల్లి హాస్టల్ మరియు భోజన వసతులు:**\\n\\n• **ప్రత్యేక సురక్షిత హాస్టళ్లు:** విద్యార్థులు మరియు విద్యార్థినులకు 24/7 భద్రత, CCTV పర్యవేక్షణతో కూడిన వసతి గృహాలు.\\n• **గదుల ఎంపికలు:** AC మరియు Non-AC గదులు 2, 3, 4 షేరింగ్ సదుపాయాలతో.\\n• **వార్షిక రుసుము:** సంవత్సరానికి ₹85,000 – ₹1,35,000 (రుచికరమైన భోజనం, వై-ఫై, విద్యుత్ & జిమ్ సహా).\\n• **మెస్ భోజనం:** నాణ్యమైన దక్షిణ & ఉత్తర భారతీయ శాకాహార, మాంసాహార భోజన వసతి.\\n• **సౌకర్యాలు:** 24 గంటల పవర్ బ్యాకప్, RO మినరల్ వాటర్, క్యాంపస్‌లోనే 750 పడకల SRM సూపర్ స్పెషాలిటీ హాస్పిటల్.\\n\\n🔗 [హాస్టల్ మరియు వసతి వివరాలు (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["ఫీజుల వివరాలు & స్కాలర్‌షిప్", "క్యాంపస్ జీవితం", "హెల్ప్‌లైన్ సంప్రదించండి"]
          },
          news: {
            title: "వార్తలు & ఈవెంట్లు",
            source: "https://www.srmtrichy.edu.in/news-and-events",
            response: \`📢 **SRM IST తిరుచిరాపల్లి వార్తలు & ఈవెంట్లు (News & Events):**\\n\\n• **సదస్సులు & వర్క్‌షాప్‌లు:** అంతర్జాతీయ పరిశోధనా సదస్సులు, జాతీయ హ్యాకథాన్‌లు, IEEE వర్క్‌షాప్‌లు.\\n• **సాంస్కృతిక ఉత్సవాలు:** వార్షిక సాంస్కృతిక వేడుక 'Milan / Tarang', జాతీయ టెక్నికల్ సింపోసియం 'Technozion' మరియు క్రీడా పోటీలు.\\n• **నోటిఫికేషన్లు:** సెమిస్టర్ పరీక్షల షెడ్యూల్‌లు, అకడమిక్ క్యాలెండర్ మరియు ప్లేస్‌మెంట్ డ్రైవ్ సమాచారం.\\n\\n🔗 [అన్ని వార్తలు & ఈవెంట్లు (News & Events)](https://www.srmtrichy.edu.in/news-and-events) | [అకడమిక్ క్యాలెండర్](https://www.srmtrichy.edu.in/academic_calendar)\`,
            quickReplies: ["ప్రవేశాలు 2026", "హాస్టల్ మరియు వసతి (Hostels)", "హెల్ప్‌లైన్ సంప్రదించండి"]
          },
          campus: {
            title: "క్యాంపస్ జీవితం",
            source: "https://www.srmtrichy.edu.in/campus-life",
            response: \`🏫 **క్యాంపస్ వసతులు మరియు విద్యార్థి జీవితం:**\\n\\n• **క్యాంపస్:** 50+ ఎకరాల పచ్చని వై-ఫై క్యాంపస్.\\n• **ప్రయోగశాలలు:** 50+ అత్యాధునిక ఇంజనీరింగ్ & AI ల్యాబ్‌లు.\\n• **లైబ్రరీ:** 50,000+ పుస్తకాలు మరియు డిజిటల్ జర్నల్స్‌తో కూడిన సెంట్రల్ లైబ్రరీ.\\n• **హాస్పిటల్:** క్యాంపస్‌లోనే 750 పడకల SRM సూపర్ స్పెషాలిటీ టీచింగ్ హాస్పిటల్.\\n\\n📍 **చిరునామా:** తిరుచ్చి-చెన్నై NH-45 జాతీయ రహదారి, సమయపురం టోల్ ప్లాజా సమీపంలో, తిరుచ్చి - 621105.\\n\\n🔗 [క్యాంపస్ జీవితం](https://www.srmtrichy.edu.in/campus-life) | [హాస్టల్స్](https://www.srmtrichy.edu.in/campus-life#accommodation)\`,
            quickReplies: ["హాస్టల్ మరియు వసతి (Hostels)", "ఇంజనీరింగ్ కోర్సులు", "హెల్ప్‌లైన్ సంప్రదించండి"]
          },
          contact: {
            title: "హెల్ప్‌లైన్ సంప్రదించండి",
            source: "https://www.srmtrichy.edu.in/contact",
            response: \`📞 **SRM IST తిరుచిరాపల్లి అడ్మిషన్ల హెల్ప్‌లైన్:**\\n\\n**చిరునామా:**\\nSRM ఇన్‌స్టిట్యూట్ ఆఫ్ సైన్స్ అండ్ టెక్నాలజీ\\nSRM నగర్, తిరుచ్చి-చెన్నై హైవే (NH-45)\\nసమయపురం సమీపంలో, తిరుచిరాపల్లి - 621 105, తమిళనాడు.\\n\\n**హెల్ప్‌లైన్ నంబర్లు:**\\n📞 టోల్-ఫ్రీ నంబర్: **1800 202 4565**\\n📞 నేరుగా సంప్రదించండి: **0431 - 2258900 / 2258901**\\n\\n**ఈమెయిల్:**\\n📧 **admissions@srmtrichy.edu.in**\\n\\n**పనివేళలు:**\\nసోమవారం నుండి శనివారం వరకు: ఉదయం 9:00 నుండి సాయంత్రం 5:00 వరకు\\n\\n🔗 [ఆన్‌లైన్ సంప్రదింపుల ఫారం](https://www.srmtrichy.edu.in/contact) | [ఆన్‌లైన్‌లో దరఖాస్తు చేయండి](https://admissions.srmtrichy.edu.in/)\`,
            quickReplies: ["ప్రవేశాలు 2026", "ఫీజుల వివరాలు & స్కాలర్‌షిప్", "ఇంజనీరింగ్ కోర్సులు"]
          }
        }
      }
    };
`;

// Part 2: Find where formatMessage starts
let formatIndex = -1;
for (let i = 800; i < lines.length; i++) {
  if (lines[i].includes('function formatMessage(text)')) {
    formatIndex = i;
    break;
  }
}

if (formatIndex === -1) {
  console.error('Could not find formatMessage');
  process.exit(1);
}

// Extract from formatMessage to end
let part2 = lines.slice(formatIndex).join('\n');

// In part2, update attachSource to show clean title and handle anchor clicks
part2 = part2.replace(
  /function attachSource\(\) \{[\s\S]*?scrollToBottom\(\);\s*\}/,
  \`function attachSource() {
        if (src && !src.includes("pollinations")) {
          const s = document.createElement("div");
          s.style.marginTop = "6px";
          s.style.fontSize = "11.5px";
          s.style.color = "#0284c7";
          let label = "Official Details";
          if (src.includes("accommodation")) label = "🏠 Hostels & Accommodation";
          else if (src.includes("news-and-events")) label = "📢 News & Events Portal";
          else if (src.includes("placement")) label = "💼 Placements & Packages";
          else if (src.includes("programmes")) label = "📚 Academic Programmes";
          else if (src.includes("admission") || src.includes("admissions.")) label = "🎓 Admissions Portal";
          else if (src.includes("campus-life")) label = "🏫 Campus Life";
          else if (src.includes("contact")) label = "📞 Contact & Helpline";
          s.innerHTML = \`<strong>Official Link:</strong> <a href="\${src}" target="_blank" rel="noopener noreferrer">\${label} (\${src})</a>\`;
          bodyEl.appendChild(s);
        }
        scrollToBottom();
      }\`
);

// In part2, update findLocalKnowledge
const findKnowledgeRegex = /function findLocalKnowledge\(query, lang = currentLang\) \{[\s\S]*?return null;\s*\}/;
const newFindKnowledge = \`function findLocalKnowledge(query, lang = currentLang) {
      const cur = I18N[lang] || I18N.en;
      const q = query.toLowerCase();

      // 1. Hostel & Accommodation (Must be checked BEFORE campus)
      if (/hostel|room|mess|accommodation|stay|விடுதி|தங்குமிடம்|உணவு|சாப்பாடு|हॉस्टल|ఆవాసం|హాస్టల్/i.test(q)) {
        return cur.knowledge.hostel || cur.knowledge.campus;
      }

      // 2. News, Events, Symposia, Happenings (Including user typos like "evating ents")
      if (/news|event|evating\\s*ents|happening|circular|workshop|symposium|fest|செய்தி|செய்திகள்|நிகழ்வு|நிகழ்வுகள்|நிகழ்ச்சி|விழா|கருத்தரங்கு|சுற்றறிக்கை|समाचार|कार्यक्रम|వార్తలు|ఈవెంట్/i.test(q)) {
        return cur.knowledge.news;
      }

      // 3. Admissions / Applications
      if (/admiss|apply|form|join|seat|cutoff|சேர்க்கை|விண்ணப்ப|பதிவு|प्रवेश|आवेदन|ప్రవేశ|దరఖాస్తు/i.test(q)) {
        return cur.knowledge.admissions;
      }

      // 4. Courses & Engineering
      if (/course|program|branch|degree|btech|mba|bba|bpt|படிப்பு|துறை|பாடத்திட்டம்|பாடப்பிரிவு|पाठ्यक्रम|కోర్సు/i.test(q)) {
        return cur.knowledge.courses;
      }

      // 5. Fees & Scholarships
      if (/fee|fees|cost|scholarship|concession|கட்டணம்|செலவு|உதவித்தொகை|சலுகை|फीस|शुल्क|छात्रवृत्ति|ఫీజు|స్కాలర్/i.test(q)) {
        return cur.knowledge.fees;
      }

      // 6. Placements
      if (/placement|job|package|salary|lpa|recruit|வேலை|சம்பளம்|प्लेसमेंट|नौकरी|पैकेज|ఉద్యోగ|ప్లేస్‌మెంట్/i.test(q)) {
        return cur.knowledge.placements;
      }

      // 7. General Campus (without hostel)
      if (/campus|facility|infrastructure|hospital|sports|bus|transport|வளாக|மருத்துவமனை|பேருந்து|परिसर|अस्पताल|క్యాంపస్|హాస్పిటల్/i.test(q)) {
        return cur.knowledge.campus;
      }

      // 8. Contact & Helpline
      if (/contact|phone|number|email|call|help|reach|தொடர்பு|எண்|முகவரி|संपर्क|फोन|సంప్రది|ఫోన్|హెల్ప్‌లైన్/i.test(q)) {
        return cur.knowledge.contact;
      }

      return null;
    }\`;

part2 = part2.replace(findKnowledgeRegex, newFindKnowledge);

// In part2, ensure processBotResponse passes local.source
part2 = part2.replace(
  'addBotMessage(local.response, "https://www.srmtrichy.edu.in", true);',
  'addBotMessage(local.response, local.source || "https://www.srmtrichy.edu.in", true);'
);
part2 = part2.replace(
  'addBotMessage(local.response, "https://www.srmtrichy.edu.in", true);',
  'addBotMessage(local.response, local.source || "https://www.srmtrichy.edu.in", true);'
);

const fullCode = part1 + '\n    ' + part2;
fs.writeFileSync('public/srm-tamil-widget.js', fullCode, 'utf8');
console.log('Successfully repaired public/srm-tamil-widget.js!');
