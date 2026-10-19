# DESIGN.md — SafeBelt AI

## 1. Project Overview

**Project Name:** SafeBelt AI  
**Type:** Interactive educational web demo  
**Stack:** React.js + TypeScript + Tailwind CSS + Framer Motion (optional) + SVG/Canvas for visualization  
**Purpose:**  
Membuat website interaktif yang mensimulasikan sistem pemantauan sabuk pengaman pada mobil. Pengguna dapat mengubah kondisi kursi, status sabuk, dan kecepatan kendaraan, lalu melihat bagaimana sistem memberikan peringatan secara real-time.

## 2. Product Vision

SafeBelt AI bukan aplikasi AI palsu yang hanya menampilkan jargon, tetapi sebuah **interactive simulation website** yang menjelaskan bagaimana sistem pendeteksian keselamatan bekerja secara visual, logis, dan mudah dipahami.

Website harus terasa:
- Engineering-oriented
- Interaktif
- Informatif
- Modern
- Real-time
- Visual, bukan sekadar teks

## 3. Core Experience Goals

1. **User memahami sistem hanya dengan berinteraksi.**
2. **Setiap perubahan state langsung terlihat secara visual.**
3. **Beberapa POV membantu user memahami kondisi mobil dari sudut berbeda.**
4. **Panel deteksi AI menjelaskan input, proses, dan hasil.**
5. **Website terasa seperti simulasi engineering, bukan landing page promosi biasa.**

## 4. Problem Statement

Banyak demo AI terlihat abstrak dan tidak menjelaskan mekanisme sistem secara konkret. SafeBelt AI ingin menunjukkan simulasi keselamatan sabuk pengaman melalui:
- status kursi,
- status sabuk,
- status kendaraan,
- warning logic,
- dan visualisasi kondisi kabin mobil secara real-time.

## 5. MVP Scope

### Included in MVP
- Multi-section interactive web
- Toggle bahasa Indonesia / English
- Driver seat + rear passenger seats
- Seat states:
  - Empty
  - Occupied + belt fastened
  - Occupied + belt unfastened
- Vehicle speed control
- Real-time alert logic
- Multiple visual POVs:
  - Dashboard Summary View
  - Top View Cabin
  - Side Driving View
  - Detection Logic Panel
- Sound alert when dangerous condition occurs
- Recommendation text: slow down / secure seat belt
- Status indicator for each seat
- Realtime system explanation panel

### Excluded from MVP
- Real camera detection
- Real AI model inference
- Automatic braking / automatic stopping
- Real vehicle sensor integration
- Mobile app
- Backend database
- Authentication

## 6. Safety & Ethical Product Rules

1. Jangan mengklaim bahwa website ini benar-benar menjalankan AI vision model jika belum ada model nyata.
2. Jelaskan bahwa demo ini adalah **simulation of safety detection logic**.
3. Jangan menampilkan perilaku mobil yang otomatis berhenti mendadak saat sabuk dilepas.
4. Sistem hanya memberi:
   - visual warning
   - sound alert
   - text recommendation
5. Untuk produk nyata, dibutuhkan kombinasi:
   - seat occupancy sensor
   - buckle sensor
   - vehicle speed signal
   - optional camera-based monitoring

## 7. Target Audience

- Juri lomba / dosen / mentor
- Mahasiswa
- Pengunjung demo teknologi
- Orang awam yang ingin memahami konsep sistem keselamatan kendaraan

## 8. Design Principles

### 8.1 Functional First
Semua elemen visual harus membantu pemahaman sistem.

### 8.2 Interactive > Decorative
Animasi dan ilustrasi harus mendukung simulasi, bukan sekadar hiasan.

### 8.3 Explain the Logic
User harus tahu kenapa warning muncul.

### 8.4 Multi-View Clarity
POV berbeda harus saling melengkapi:
- Top view = posisi penumpang
- Side view = mobil berjalan
- Dashboard = status ringkas
- AI panel = logika deteksi

### 8.5 Real-Time Feedback
Perubahan status harus langsung terlihat tanpa reload.

## 9. Brand & Visual Direction

## Overall Style
A clean, high-clarity engineering UI inspired by industrial/educational simulation products:
- dark or neutral base
- high-contrast indicators
- cyan / blue accents
- yellow/orange for warnings
- red for danger
- green for safe states
- structured cards and panels
- diagram-like layout
- neat labeling
- technical feeling without being intimidating

## Tone
- Smart
- Precise
- Trustworthy
- Clear
- Technical but approachable

## Avoid
- Generic AI gradients everywhere
- Overused “futuristic” fluff
- Fake hologram aesthetics
- Empty buzzwords
- Stock-photo-heavy layout
- Overly rounded “startup saas” design

## 10. Information Architecture

1. Hero Section
2. Interactive Simulation Overview
3. Top View Cabin Simulation
4. Side View Driving Simulation
5. Detection Logic / “AI” Panel
6. Scenario Playground
7. System Flow Explanation
8. Use Cases / Safety Insights
9. Footer

## 11. Section-by-Section Design

## 11.1 Hero Section

**Goal:** immediately communicate the project.

**Contains:**
- Title: SafeBelt AI
- Subtitle:
  "Interactive safety-belt monitoring simulation for vehicle occupants."
- Small disclaimer:
  "This demo simulates detection logic and alerts. It does not control the vehicle."
- CTA buttons:
  - Try Simulation
  - View Detection Logic

**Visual:**
- Large dashboard-style panel preview
- Small moving indicators
- Animated pulse on alert nodes
- Mini car cabin illustration preview

## 11.2 Interactive Summary Dashboard

**Goal:** show global status in one glance.

**Cards:**
- Vehicle Speed
- Driver Status
- Rear Left Status
- Rear Right Status
- Risk Level
- Active Alerts

**Status Labels:**
- Empty
- Occupied
- Belt Fastened
- Belt Unfastened
- Warning Active
- Safe

**Optional widgets:**
- Speed gauge
- Occupancy count
- Alert timeline

## 11.3 Top View Cabin Simulation

**Goal:** visualize seat positions clearly.

**Visual concept:**
A top-down simplified SVG of a car interior:
- Driver seat
- Front passenger (optional future)
- Rear left
- Rear center (optional future)
- Rear right

For MVP, minimally include:
- Driver
- Rear Left
- Rear Right

**Each seat shows:**
- empty / occupied icon
- belt status
- highlighted outline color by state
- mini label
- clickable or configurable from side control panel

**Seat color states:**
- Gray = empty
- Green = occupied + belt fastened
- Yellow = occupied + warning potential
- Red = occupied + belt unfastened while moving

## 11.4 Side View Driving Simulation

**Goal:** make the car feel alive and moving.

**Visual concept:**
- Side-view car illustration
- wheels rotating subtly
- road lines moving horizontally
- background parallax
- speed changes affect animation speed
- when alert is triggered, warning beacon or dashboard blink appears

**Behavior:**
- If speed = 0, car is stationary
- If speed > 0, car appears moving
- Higher speed = faster road animation
- If occupied passenger unbuckles while moving:
  - warning animation blinks
  - sound alert may trigger
  - advisory text appears:
    "Please fasten seat belt and reduce speed safely."

## 11.5 Detection Logic Panel

**Goal:** explain the pseudo-AI / detection process clearly.

**Panel structure:**

### Inputs
- Seat Occupancy
- Seat Belt Status
- Vehicle Speed

### Interpreted Conditions
Examples:
- Driver occupied
- Driver belt unfastened
- Vehicle speed above threshold
- Rear passenger occupied
- Rear right buckle disengaged while moving

### Output
- Safe
- Notice
- Warning
- Critical Warning

### Recommendations
- Fasten seat belt
- Check rear passengers
- Reduce speed safely
- Reconfirm all occupied seats are secured

**Important copy rule:**
Do not say “AI detected” if it is only manual simulation logic.  
Use:
- "Detection logic result"
- "Simulated detection output"
- "System interpretation"

## 11.6 Scenario Playground

**Goal:** allow custom testing.

**Controls:**
- Language toggle (ID/EN)
- Driver:
  - Occupied?
  - Belt fastened?
- Rear left:
  - Occupied?
  - Belt fastened?
- Rear right:
  - Occupied?
  - Belt fastened?
- Vehicle speed slider
- Scenario presets:
  - All Safe
  - Driver Unbelted
  - Rear Passenger Unbelted
  - Passenger Unbuckles While Moving
  - Vehicle Stopped
- Reset button

## 11.7 System Flow Explanation

Simple step flow:
1. Read seat occupancy
2. Read belt buckle state
3. Read speed
4. Compare conditions
5. Generate alert level
6. Show recommendation

This can be visualized as boxes or a node-flow diagram.

## 12. Main Interaction Model

## Global State Example

```ts
type SeatStatus = {
  occupied: boolean;
  belted: boolean;
};

type VehicleState = {
  speed: number;
  language: "id" | "en";
  seats: {
    driver: SeatStatus;
    rearLeft: SeatStatus;
    rearRight: SeatStatus;
  };
};