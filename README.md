# Matchmakr

A modern job matching platform built with Django and React Native.

## Database Setup

To set up your local database with the initial data:

1. Make sure you have PostgreSQL installed and running
2. Create a new database named `matchmakr`:
   ```bash
   createdb matchmakr
   ```
3. Set up your environment variables in `.env`:
   ```
   DB_NAME=matchmakr
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Load the initial data:
   ```bash
   python manage.py loaddata v1/fixtures/initial_data.json
   ```

This will populate your database with the same data as the development environment.

## Development Setup

### Prerequisites

- Python 3.8 or higher
- PostgreSQL 14 or higher
- pgAdmin (comes with PostgreSQL installation)

### Project Setup

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd matchmakr
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv_new
   source venv_new/bin/activate  # On Windows: venv_new\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root:

   ```
   DEBUG=True
   SECRET_KEY='django-insecure-change-this-in-production'
   DB_NAME=matchmakr
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

   Replace `your_postgres_password` with the password you set during PostgreSQL installation.

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Load initial data:

   ```bash
   python manage.py loaddata v1/fixtures/initial_data.json
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Important Notes

- Never commit the `.env` file to version control
- Each developer should maintain their own `.env` file with their local database credentials
- The database schema is version controlled through migrations, but the data is not
- For production deployment, different environment variables will be needed

## Running the Application

1. Start the Django server:
```bash
./start_django.sh
```

2. Start the React Native app:
```bash
cd matchmakr
npm install
npx expo start
```

3. Press 'w' to open the web version or scan the QR code with Expo Go app.

## Features

- Profile matching based on skills and experience
- Real-time chat between employers and candidates
- Modern, responsive UI
- Secure authentication
- Profile management
- Job posting and application tracking
