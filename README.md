# Hunger Bridge Backend

Hunger Bridge is a food redistribution platform that connects donors, NGOs, and volunteers to reduce food wastage and deliver surplus food to the needy.

## 📦 Tech Stack

- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **Auth**: JWT (via `djangorestframework-simplejwt`)

---

## 🔧 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hunger-bridge.git
cd hunger-bridge/backend
2. Create Virtual Environment
bash
Copy
Edit
python -m venv venv
venv\Scripts\activate   # Windows
3. Install Dependencies
bash
Copy
Edit
pip install djangorestframework-simplejwt
4. Create .env for Database Settings (if applicable)
env
Copy
Edit
DB_NAME=hungerbridge
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
5. Run Migrations
bash
Copy
Edit
python manage.py makemigrations
python manage.py migrate
6. Create Superuser
bash
Copy
Edit
python manage.py createsuperuser
7. Start the Server
bash
Copy
Edit
python manage.py runserver
🔐 Authentication
We use JWT for token-based authentication.

Obtain Token
POST /api/token/

json
Copy
Edit
{
  "email": "user@example.com",
  "password": "yourpassword"
}
Refresh Token
POST /api/token/refresh/

📄 Models Implemented
✅ User (Custom)
Extends AbstractBaseUser, PermissionsMixin

Fields: email, first_name, last_name, user_type (Donor, NGO, Volunteer)

✅ Donation
Donated food items by a Donor

Fields: food_description, quantity, pickup_time, status

✅ Request
Created by NGOs for a specific donation

Fields: donation, ngo, volunteer, priority, status

🚀 API Endpoints (Implemented)
🔹 Users
POST /api/register/ - Register new users

POST /api/token/ - Login & get JWT

GET /api/profile/ - Get current user's profile

🔹 Donations (Donor only)
POST /api/donations/ - Create a donation

GET /api/donations/ - List donor's donations

🔹 Requests
POST /api/requests/ - NGO creates a request for a donation

GET /api/requests/ -

NGO: See own requests

Volunteer: See unassigned requests (status = "Pending")

✅ Current Development Progress
 JWT Auth system with role-based permissions

 Custom User model for different roles

 Donation flow (Donor)

 Request flow (NGO to assign available donations)

 Filtering views based on user_type

 Volunteer claim & delivery flow

 Chat & Notification system (MongoDB)

 Route optimization (Neo4j)

