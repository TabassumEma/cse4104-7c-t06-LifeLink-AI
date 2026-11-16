# LifeLink AI - AI-Powered Blood Donation Management System

CSE 4104 - Software Development III
Northern University of Business and Technology, Khulna

## Project Title

**LifeLink AI - AI-Powered Blood Donation Management System**

LifeLink AI is a web app that connects blood donors with patients in Bangladesh. When someone posts a blood request, the system uses AI (Gemini API) to suggest the best available donors based on blood group, location, urgency and availability. It also hides donors who donated recently and closes the request when enough donors have accepted.

## Team Information

- **Team Name:** CSE4104-7C-T06
- **Section:** 7C
- **Team Leader:** Tabassum Naima Ema
- **Course Instructor:** Md. Riaz Mahmud, Assistant Professor, Dept. of CSE
- **GitHub Repository:** https://github.com/TabassumEma/cse4104-7c-t06-LifeLink-AI

| Name | Student ID | Role |
|---|---|---|
| Tabassum Naima Ema | 11230321430 | Team Leader, AI Integration |
| Marzia Hasan Ritu | 11230321574 | Frontend |
| Lamia Sultana | 11230321401 | Backend, Database |
| Farha Afroz Oboni | 11230321427 | Frontend |

## Objectives

- Build one platform that connects blood donors with patients in Bangladesh
- Use AI (Gemini API) to recommend the most suitable available donors for each request
- Reduce the time needed to find a donor in an emergency
- Protect donor privacy by sharing phone numbers only after a donor accepts
- Track the donation cooldown automatically and remind donors when they can donate again
- Close a request automatically when enough donors have accepted
- Give admins tools to verify users, remove fake requests and monitor the system
- Deploy a secure and responsive system online

## Features

- Registration and login for donors, requesters and admin (JWT + bcrypt)
- Create blood requests and track their status (Open, In Progress, Fulfilled, Closed)
- AI-based donor recommendation with a short reason for each donor
- AI reads a normal text request (English or Banglish) and fills the form automatically
- Donation cooldown: donor is hidden for 90 days (male) or 120 days (female) after donating
- "I'm Going" button: request closes when enough donors accept and reopens if someone cancels
- Donor phone number is shown only after they accept a request
- Notifications for new requests, status changes and cooldown reminders
- Donor dashboard and admin dashboard with blood group statistics
- Admin can verify or block users and remove fake requests

## Technology Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **AI:** Google Gemini API
- **Authentication:** JWT, bcrypt
- **Deployment:** Vercel, Render / Railway
- **Tools:** GitHub, Figma, Draw.io, dbdiagram.io, Postman

## Repository Structure

```
cse4104-7c-t06-LifeLink-AI/
├── frontend/           # React app
├── backend/            # Express API
├── documentation/      # proposal, SRS, diagrams
│   ├── CSE4104-7C-T06_Week01.pdf
│   ├── CSE4104-7C-T06_TeamInfo.pdf
│   ├── CSE4104-7C-T06_Proposal.pdf
│   ├── CSE4104-7C-T06_SRS.pdf
│   └── diagrams/
│       ├── CSE4104-7C-T06_UseCaseDiagram.pdf
│       ├── CSE4104-7C-T06_ERDiagram.pdf
│       ├── CSE4104-7C-T06_ArchitectureDiagram.pdf
│       └── *.drawio      # editable draw.io files
├── screenshots/
├── presentation/
├── testing/
└── README.md
```

## Documentation

- [Week 01 - Team Formation & Idea Selection](documentation/CSE4104-7C-T06_Week01.pdf)
- [Week 02 - Team Information Sheet](documentation/CSE4104-7C-T06_TeamInfo.pdf)
- [Week 02 - Project Proposal](documentation/CSE4104-7C-T06_Proposal.pdf)
- [Week 03 - SRS Document](documentation/CSE4104-7C-T06_SRS.pdf)
- [Use Case Diagram](documentation/diagrams/CSE4104-7C-T06_UseCaseDiagram.pdf)
- [ER Diagram](documentation/diagrams/CSE4104-7C-T06_ERDiagram.pdf)
- [Architecture Diagram](documentation/diagrams/CSE4104-7C-T06_ArchitectureDiagram.pdf)

## Installation

```bash
git clone https://github.com/TabassumEma/cse4104-7c-t06-LifeLink-AI.git

cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
```

Add a `.env` file in the backend folder with the database URL, JWT secret and Gemini API key.

## Deployment Link

Not deployed yet.

## Screenshots

Will be added later.
