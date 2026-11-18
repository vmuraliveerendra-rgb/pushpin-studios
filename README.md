# Pushpin Studios Web Application

> **Pushpin Studios – Where Creativity Meets Production Excellence**  
> *A Unit of Seven Kreations*  
> 📍 **Studio Address:** 1st Floor, Pno 13, 8-2-334, Banjara Hills Rd Number 3, behind TV9, Green Valley, Banjara Hills, Hyderabad, Telangana – 500034.  
> 📞 **Contact:** +91 99889 99956 | ✉️ **Email:** connect@7kpushpin.com | 🌐 **Web:** [7kpushpin.com](https://7kpushpin.com/) | 📸 **Instagram:** [@pushpinstudios](https://www.instagram.com/reel/DcYmhV0snSe/?srtk=Nmg3aHE1MnByZ3ll)

---

## 🌟 Overview

This is the official interactive web application for **Pushpin Studios**, Hyderabad's premier full-service podcast, multi-lingual dubbing, Dolby Atmos 7.1.4, and post-production studio.

Built with a high-contrast dark cinematic aesthetic inspired by world-class recording and DI suites, the app combines studio storytelling with practical client conversion tools.

---

## 🚀 Key Features

1. **Interactive Studio Session Booking & Live Cost Estimator**:
   - Clients can choose services (Podcast Recording, Multilingual Dubbing, Voice Over, Dolby Atmos 7.1.4 Mixing, Video Editing, DI Color Grading, Ad Shoots).
   - Dynamic schedule duration picker (1 hr, 2 hrs, 4 hrs half-day, 8 hrs full-day with automatic 10% shift discount).
   - Selectable add-ons: Senior Sound Engineer, Multi-Cam 4K Cinema Setup, Studio Teleprompter, Express Same-Day Rough Cut.
   - **One-Click WhatsApp Dispatch**: Instantly generates an encoded WhatsApp message with all booking specs sent directly to `+91 99889 99956`.
   - **Session Voucher Generator**: Generates a verifiable booking confirmation card with a unique reference number (e.g., `7K-PS-48192`).

2. **Web Audio API Studio Sound Room & Waveform Simulator**:
   - Real-time interactive acoustic simulator using browser-native Web Audio API.
   - 4 simulated presets: *Warm VO Preamp*, *Dolby Atmos 3D*, *Podcast Multi-Mic*, and *Mastering 808 & Highs*.
   - Live HTML5 Canvas visualizer rendering frequency spectrum waves with glowing gradient bars and VU meter level indicators.

3. **"Recent Frames" Portfolio Showcase**:
   - Interactive gallery containing authentic projects from the Pushpin Studios catalogue:
     - **Monsoon Reel** (High-Fashion & Automotive Commercial)
     - **Aurelia VO** (International OTT Series Dubbing)
     - **Ad Astra** (Global Tech Brand Campaign)
     - **Amber Frequency** (Song Recording & Acoustic Vocal Master)
     - **Saturday Edit** (Feature Film Video Editing)
     - **Glasshouse** (DI Suite & Post-Production Finishing)
     - **Afterglow** (Corporate & Brand Film)
     - **Airwave Sessions** (Live Multi-Mic Podcast & Dolby Atmos Mix)
   - Filterable by *All*, *Dubbing & Voice Over*, *Film & Commercials*, *Dolby Audio & Songs*, and *Editing & DI Process*.
   - Modal lightbox displaying full project scope and workflow deliverables.

4. **Complete 22+ Services Catalogue**:
   - **Core Deliverables**: Professional Dubbing, Voice Over, Sound Design, Audio Mixing & Mastering, Dolby ATMOS 7.1.4, Ad Film Shoots, Video Editing, Color Grading.
   - **On-Demand Services**: Song Recording, Corporate Videos, Photo/Video Shoots, Film Production, 2D/3D Animation, Motion Graphics & VFX, Digital Intermediate (DI), Logo Design, Poster Design, Graphic Design, Content Writing, Digital Marketing, Event Management.

5. **Meet The Team**:
   - **Suresh Bommera** (Founder)
   - **Mahender Reddy Thigulla** (Co-Founder)
   - **Karronya Katrynn** (CEO)
   - **Harish** (Sound Engineer)
   - **V. Murali** (Cinematography & Editing)
   - **Aashrith** (Market & Social Media Lead)

6. **Studio Technical Specs & Hardware**:
   - Detailed gear list covering Neumann U87 Ai, Shure SM7B, Genelec SAM 7.1.4 array, Universal Audio Apollo, DaVinci Resolve Studio, and calibrated 4K OLED monitoring.

7. **Banjara Hills Location Hub**:
   - Directions link to Banjara Hills Rd No 3 behind TV9.
   - Click-to-call, email, WhatsApp, and downloadable PDF brochure.

---

## 📁 Project Directory Structure

```text
pushpin-studios-app/
├── index.html                   # Main application webpage
├── server.rb                    # Zero-dependency local web server (Ruby WEBrick)
├── start.sh                     # One-click launch shell script
├── README.md                    # Documentation
└── assets/
    ├── css/
    │   └── style.css            # Studio dark mode theme, glassmorphic UI, animations
    ├── js/
    │   └── app.js               # Audio visualizer engine, booking calculator, modals
    ├── images/
    │   ├── logo.png             # Pushpin Studios branding
    │   ├── monsoon_reel.png     # Monsoon Reel portfolio frame
    │   ├── aurelia_vo.png       # Aurelia VO portfolio frame
    │   ├── amber_frequency.png  # Amber Frequency portfolio frame
    │   ├── ad_astra.png         # Ad Astra portfolio frame
    │   ├── saturday_edit.png    # Saturday Edit portfolio frame
    │   ├── glasshouse.png       # Glasshouse portfolio frame
    │   ├── afterglow.png        # Afterglow portfolio frame
    │   ├── airwave_sessions.png # Airwave Sessions portfolio frame
    │   ├── karronya_katrynn.png # CEO portrait
    │   ├── studio_lounge.png    # Studio interior lounge
    │   └── clapper_audio.png    # Clapper & audio equipment
    └── pushpin_brochure.pdf     # Original high-res studio brochure
```

---

## ⚡ How to Run Locally

### Option 1: Using the Built-In Local Server (Recommended)
Open your terminal and run:
```bash
cd /Users/laxviladsandrecordingstudio/.gemini/antigravity/scratch/pushpin-studios-app
./start.sh
```
Or directly:
```bash
ruby server.rb
```
Then open your browser at:
👉 **`http://localhost:3000`**

### Option 2: Direct Browser Launch
You can also double-click `index.html` or open it directly in Safari, Chrome, or Firefox.

---

## 🌐 Deployment Guidelines

This application is 100% static-ready and can be deployed in under 2 minutes:
- **Netlify / Vercel**: Drag and drop the `pushpin-studios-app` folder or connect a GitHub repository.
- **GitHub Pages**: Push the files to a repository and enable Pages in repository settings.
- **Custom Domain (`7kpushpin.com`)**: Upload the files to your Apache, Nginx, or cPanel public_html directory.
