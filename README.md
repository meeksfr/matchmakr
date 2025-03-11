# Matchmakr

A job matching platform built with Django and React Native/Expo.

## Quick Start with Docker

### Prerequisites

#### Docker Setup
- Download Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop/)
- Install Docker Desktop
- Start Docker Desktop and wait for it to fully initialize (whale icon in menu bar should stop animating)
- Ensure Docker Desktop has at least 4GB of memory allocated (Settings -> Resources -> Memory)

#### Required Software
- Docker
- Docker Compose

### Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd matchmakr
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

This will:
- Build and start the PostgreSQL database
- Build and start the Django backend
- Build and start the React Native/Expo frontend

3. Access the application:
- Backend API: http://localhost:8000
- Frontend (Web): http://localhost:8081
- Frontend (Mobile): Use Expo Go app to scan the QR code displayed in the terminal

### Development Workflow

#### Making Changes
- The application uses Docker volumes, so any changes you make to the code will be reflected immediately
- Backend changes will be automatically reloaded
- Frontend changes will trigger a hot reload

#### Database Migrations
When you need to run migrations:
```bash
docker-compose exec backend python manage.py migrate
```

#### Creating a Superuser
To create an admin user:
```bash
docker-compose exec backend python manage.py createsuperuser
```

#### Viewing Logs
```bash
docker-compose logs -f
```

To view logs for a specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Environment Variables

The following environment variables can be configured:

#### Backend (Django)
- `DEBUG`: Set to "True" for development
- `SECRET_KEY`: Django secret key
- `DATABASE_URL`: PostgreSQL connection URL

#### Database
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

### Troubleshooting

1. If the frontend fails to start:
   - Ensure ports 8081, 19000, and 19001 are not in use
   - Try rebuilding the frontend container:
     ```bash
     docker-compose up -d --build frontend
     ```

2. If the backend can't connect to the database:
   - Wait a few seconds for the database to initialize
   - Check the database logs:
     ```bash
     docker-compose logs db
     ```

3. If you need to reset the database:
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

### Production Deployment

For production deployment:
1. Update `ALLOWED_HOSTS` in Django settings
2. Set `DEBUG=False`
3. Use a proper secret key
4. Configure proper database credentials
5. Set up proper SSL/TLS certificates

### Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### License

[Your License Here]

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
