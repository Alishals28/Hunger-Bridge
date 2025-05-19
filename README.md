# Hunger Bridge Backend

Hunger Bridge is a food redistribution platform that connects donors, NGOs, and volunteers to reduce food wastage and deliver surplus food to the needy.

## 📦 Tech Stack

- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **Auth**: JWT (via `djangorestframework-simplejwt`)

---

# 🍽️ Hunger Bridge

Hunger Bridge is a full-stack food redistribution platform that connects **donors** with **NGOs** and facilitates **volunteers** to deliver surplus food efficiently using **route optimization** and **real-time notifications**. Built with Django, React, PostgreSQL, MongoDB, and Neo4j, it demonstrates advanced database integration and backend architecture.

---

## 📑 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schemas](#database-schemas)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 About the Project

**Hunger Bridge** addresses the food wastage crisis by:
- Enabling donors (individuals or restaurants) to list surplus food
- Allowing NGOs to request available donations
- Empowering volunteers to claim requests and deliver food
- Using route optimization to minimize delivery distance
- Sending real-time notifications about system events

---

## ✅ Features

- Custom Django User model with roles (Donor, NGO, Volunteer, Admin)
- Donation and Request workflows
- Volunteer claiming and delivery flow
- Transaction tracking and feedback system
- Notifications using MongoDB
- Route optimization using Neo4j
- Secure authentication using JWT

---

## 🧰 Tech Stack

- **Backend:** Django REST Framework
- **Frontend:** React (not covered in this repo)
- **Relational DB:** PostgreSQL
- **NoSQL DB:** MongoDB (notifications)
- **Graph DB:** Neo4j (route optimization)
- **Geocoding:** Nominatim / OpenStreetMap API

---

## 🏗️ Architecture Overview

```
            +--------------------------+
            |      React Frontend      |
            +------------+-------------+
                         |
                         v
           +-----------------------------+
           |       Django REST API       |
           +-------------+---------------+
                         |
         +---------------+---------------+-----------------+
         |                               |                 |
         v                               v                 v
+----------------+          +-------------------+    +----------------+
|   PostgreSQL   |          |     MongoDB       |    |     Neo4j      |
|  (Main DB)     |          | (Notifications)   |    | (Routes Graph) |
+----------------+          +-------------------+    +----------------+
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Python 3.9+
- PostgreSQL
- MongoDB
- Neo4j Desktop or AuraDB
- Node.js & npm (if using React frontend)
- [Poetry](https://python-poetry.org/) or `pipenv` (optional)

### Installation Steps

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/hunger-bridge.git
cd hunger-bridge
```

2. **Set up a Python virtual environment**
```bash
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL**
- Create a database:
```sql
CREATE DATABASE hungerbridge;
```
- Update `DATABASES` in `settings.py` with your credentials.

5. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create a superuser**
```bash
python manage.py createsuperuser
```

7. **Run the backend server**
```bash
python manage.py runserver
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root and configure the following:

```
SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=hungerbridge
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

MONGODB_URI=mongodb://localhost:27017
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

GEOCODING_API_URL=https://nominatim.openstreetmap.org
```

You may also use `python-decouple` or `django-environ` to manage settings cleanly.

---

## 📡 API Documentation

- Base URL: `http://localhost:8000/api/`

Example Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users/register/` | Register a new user |
| `POST` | `/users/login/` | JWT login |
| `GET`  | `/donations/` | List all donations |
| `POST` | `/donations/` | Create donation (Donor only) |
| `POST` | `/requests/` | Create request (NGO only) |
| `POST` | `/requests/{id}/claim/` | Claim a request (Volunteer only) |
| `POST` | `/requests/{id}/deliver/` | Mark as delivered |
| `GET`  | `/routes/optimize/?donor=X&ngo=Y` | Get optimized route |
| `GET`  | `/transactions/` | List transactions |

---

## 🗃️ Database Schemas

- **PostgreSQL:** User, Donation, NGO, Volunteer, Request, Transaction, Route
- **MongoDB:** Notifications collection (event-based docs)
- **Neo4j:** `Location` nodes with `CAN_DELIVER_TO` edges containing `distance` property

---

## 🤝 Contributing

Contributions are welcome! Please:
- Fork the repo
- Create a new branch (`feature/your-feature`)
- Commit your changes
- Open a Pull Request

---
## Neo4j
Ensure your neo4j server is active and is running 

## 🖥️ Running the Frontend (React)

Follow these steps to set up and run the React frontend:

### Prerequisites

- Node.js (v16 or above recommended)
- npm (comes with Node.js) or yarn

### Installation Steps

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or, if you use yarn:
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   or, if you use yarn:
   ```bash
   yarn dev
   ```

4. **Open your browser and go to**
   ```
   http://localhost:5173
   ```
   (or the port shown in your terminal)

### Notes

- Make sure your backend server is running and accessible at the API URLs expected by the frontend (default: `http://localhost:8000/api/`).
- If you need to change the API base URL, update it in your frontend source code (commonly in an `.env` file or a config file).

---
