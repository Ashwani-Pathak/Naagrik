# Naagrik 🚦

Empowering Communities for a Better Tomorrow

---

Naagrik is a modern, social-media-inspired civic issue reporting platform. It enables citizens to report, track, and resolve local issues collaboratively, making neighborhoods safer, cleaner, and more responsive.

## 🌟 Features

- **Interactive Map:** Report and view issues on a real-time map.
- **Social Feed:** Upvote, comment, and discuss issues like a social platform.
- **Profile Management:** Custom avatars, bios, and contact info for users.
- **Infographics & Stats:** Live counters, user stories, and civic impact data.
- **Authority & Emergency Contacts:** Quick access to key contacts and resources.
- **Image Uploads:** Attach photos to issues and profiles.
- **Reverse Geocoding:** See human-readable location names for issues.
- **Admin Dashboard:** Manage users, issues, and comments.

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla), [Leaflet.js](https://leafletjs.com/) for maps
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT-based
- **Image Uploads:** Multer
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

## 🚀 Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/naagrik.git
cd naagrik
```

### 2. Setup Backend
```sh
cd backend
npm install
# Create a .env file with MONGO_URI, JWT_SECRET, SMTP config, etc.
npm start
```

### 3. Setup Frontend
```sh
cd ../frontend
# Open index.html in your browser (or deploy to Vercel)
```

### 4. Environment Variables (Backend)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_SECURE=false
```

## 🌍 Deployment
- **Frontend:** Deploy `/frontend` to [Vercel](https://vercel.com/)
- **Backend:** Deploy `/backend` to [Render](https://render.com/) or [Railway](https://railway.app/)
- Update `API_BASE` in `frontend/api.js` to your backend URL after deployment.

## 🤝 Contributing
1. Fork this repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📸 Screenshots
![Map and Issue Feed](./screenshots/map-feed.png)
![Profile Dropdown](./screenshots/profile-dropdown.png)
![Add Issue Modal](./screenshots/add-issue-modal.png)

## 📄 License
MIT

---

> Made with ❤️ for civic engagement and community empowerment. 