# UI/UX Screen Designs: Shuk Trash Removal (STR)
**Subject:** Application Layout, Color Scheme, and Component Specifications

---

## 1. Design Tokens & Branding
* **Primary Color:** Emerald Green (`#10b981`) - Represents ecology, efficiency, and cleanliness.
* **Secondary Accent:** Cyan / Teal (`#06b6d4`) - Highlights active telemetry and tracking.
* **Base Background:** Sleek Dark Mode (`#080c14` / `#0b0f19`) - Offers a premium high-tech feel.
* **Containers:** Glassmorphism style cards with `backdrop-filter: blur(16px)` and subtle white borders (`rgba(255,255,255,0.1)`).

---

## 2. Screen Specifications

### A. Customer App Interface
1. **Welcome Screen**
   - Centered gradient logo.
   - Large green buttons for sign-up/login.
2. **Main Dashboard**
   - Active job progress bar.
   - Large "Book Eco-Pickup" card.
   - "Green Impact Scorecard" displaying CO2 saved, trees saved, and items upcycled.
3. **AI Volume Estimator Form**
   - Dashed file-upload container for photo uploads.
   - Dynamic sliders showing the volume estimate.
   - Upcycle items tag list (e.g. "Wood", "Metal").
4. **Order Tracking View**
   - Live Map showing the courier's vehicle path.
   - ETA countdown clock.
   - Action buttons: "Message Hauler", "Cancel Job".

### B. Courier App Interface
1. **Hauler Home Dashboard**
   - "Go Online" availability toggle.
   - Active daily earnings widget (Instant Cashout button).
   - "Available Pings" carousel.
2. **Dispatch Ping Screen**
   - Full-width modal overlay.
   - Payout amount in large font ($90.00).
   - Map showing route from current location -> pickup -> eco-station.
   - Accept/Reject buttons with 30s countdown bar.
3. **Job Navigation & Proof**
   - Mapbox/Google Maps turn-by-turn directions.
   - "Upload Before Photo" & "Upload After Photo" actions.
   - Slider to "Slide to Complete Job".

### C. Admin Dashboard
1. **Overview & Analytics**
   - Grid cards showing active jobs, online haulers, and revenue charts.
2. **Founder Profit Share**
   - Highlighted section displaying the 45% profit share split for founder **Shukrani Ahadi** (shukraniahadi6@gmail.com).
3. **SDS Case Review**
   - List of jobs flagged for hazardous waste.
   - Admin action buttons: "Approve Safety Clearance", "Cancel Job & Refund".
