# LifeLink AI - AI-Powered Blood Donation Management System

CSE 4104 - Software Development III
Northern University of Business and Technology, Khulna

## Team Information

- **Team Name:** CSE4104-7C-T06
- **Section:** 7C
- **Project Title:** LifeLink AI - AI-Powered Blood Donation Management System
- **Team Leader:** Tabassum Naima Ema
- **GitHub Repository:** https://github.com/TabassumEma/cse4104-7c-t06-LifeLink-AI

| Name | Student ID | Role |
|---|---|---|
| Tabassum Naima Ema | 11230321430 | Team Leader, AI Integration |
| Marzia Hasan Ritu | 11230321574 | Frontend |
| Lamia Sultana | 11230321401 | Backend, Database |
| Farha Afroz Oboni | 11230321427 | Frontend |

## Project Description

In Bangladesh, finding a blood donor in an emergency is still hard. People post on Facebook and call donors one by one. Many times the donor has donated recently and can't donate again, or too many donors come for one request.

LifeLink AI is a web app that connects blood donors with patients. When someone posts a blood request, the system uses AI (Gemini API) to suggest the best available donors based on blood group, location, urgency and availability. It also hides donors who donated recently and closes the request when enough donors have accepted.

## Features

- Login and registration for donors and admin
- Create blood requests and track their status
- AI-based donor recommendation
- AI reads a normal text request and fills the form automatically
- Donation cooldown (donor is hidden until they can donate again)
- "I'm Going" button: request closes when enough donors accept
- Notifications for new requests and reminders
- Donor dashboard and admin dashboard
- Donor phone number is shown only after they accept a request

## Technology Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **AI:** Google Gemini API
- **Authentication:** JWT, bcrypt
- **Deployment:** Vercel, Render / Railway

## Project Structure

```
frontend/        # React app
backend/         # Express API
documentation/   # proposal, SRS, diagrams
screenshots/
presentation/
testing/
README.md
```

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
