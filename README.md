<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Kalinga Jyoti Token System</h3>

  <p align="center">
    A premium, mobile-first ecosystem for seamless event management and fast QR-based ticket validation.
    <br />
    <a href="https://kj-ticket-2.vercel.app/">View Demo</a>
    <br />
    <i>(Note: Website might be inaccessible if the free Supabase database is paused)</i>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#how-to-use">How to Use</a></li>
    <li><a href="#additional-information">Additional Information</a></li>
    <li><a href="#credits">Credits & Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Welcome to the **Kalinga Jyoti Token System**! This platform is designed to streamline event management with highly interactive, intuitive, and beautifully responsive user interfaces. 

Hosted at [https://kj-ticket.vercel.app/](https://kj-ticket.vercel.app/), this platform offers multi-session token management, reducing user entry waiting time drastically and resolving redundancy issues associated with physical tickets through secure QR-based authentication.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
* [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
* [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
* [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How to Use

### 1. Admin Dashboard
- Navigate to the **Admin Portal** (`/admin`) and enter the secure PIN (default: `024680`).
- **Session Manager**: Create new consecutive event sessions (e.g., "Annual Fest 2025") and upload custom Canva-designed Ticket Banner images per session. You can flexibly activate one session at a time.
- **Upload Attendees**: Upload attendees rapidly from Excel using the integrated SheetBest URL hook, or manually add individual names via the interactive dashboard.
- **Ticket Generation**: Click "Generate" to map a unique universally-unique identifier (UUID) ticket for each user.
- **Distribution**: Easily copy the generated "Public Ticket Link" for any user and share it to them sequentially.

### 2. Public Ticket Viewer
- Attendees easily click your shared Public Ticket Link (e.g. `/token/Name/UUID`).
- They can view their dynamically generated event ticket and download/screenshot it securely onto their mobile device.
- Tickets are highly responsive and natively parse whatever custom Canva design was uploaded for the actively bound session.

### 3. QR Event Scanner
- On event day, volunteers navigate to the **Scanner Page** (`/scan`) and log in securely via scanner PIN (default: `135791`).
- Instantly point the camera at an attendee's downloaded ticket.
- The system automatically authenticates the precise encoded UUID natively against the PostgreSQL Supabase database to prevent forgery, instantaneously increments the scan count to definitively prevent duplicate entries, and audibly alerts the volunteer.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Additional Information

The Kalinga Jyoti Token System utilizes modern database constraints and rich ambient aesthetics:

1. **Frontend Architecture**: Built on strict React Desktop/Mobile parity. Completely modernized, responsive fluid ticket views and modular admin grids heavily utilizing TailwindCSS container layouts, semantic flexbox grids, and rich glassmorphism UI/UX.
2. **Backend & RLS Security**: Backed cleanly by **Supabase**. Secure Row Level Security (RLS) policies strictly govern `anon` access parameters dynamically from the client scope. Public read/write dynamic storage buckets instantly serve custom event ticket graphic media.
3. **QR-Based Authentication**: Drastically reduces queue waiting time exponentially and securely associates a universally unique identifier tightly bounded to relational keys encoded directly into an auto-generated high-fidelity QR canvas.
4. **Database Pause Protection**: Since the database is hosted entirely on a free tier, Supabase frequently pauses databases when inactive. The system implements a defensive fetch error detector and gracefully alerts administrators to automatically unpause the project through the management panel.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Credits & Acknowledgements

* **Original Idea & Repository Creator**: A huge thanks to the original proprietor, **Ritesh Pradhan** ([riteshpradhan2003@gmail.com](mailto:riteshpradhan2003@gmail.com)). Project Link: [https://github.com/RITESHP36/E-Ticket.io](https://github.com/RITESHP36/E-Ticket.io)
* **Rebuilt & Maintained By**: This repository has been heavily updated and improvised, and is currently maintained directly by **Sanket Kumar Kar**. Enhancements notably include full UI/UX mobile-responsiveness, traditional custom component themes, dynamic Canva template parsing wrappers, exact UUID security database binding, resilient error management, and comprehensive multi-session system structural architecture!

<p align="right">(<a href="#readme-top">back to top</a>)</p>
