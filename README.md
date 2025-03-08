# Matchmakr

## Development Setup

### Prerequisites

- Python 3.8 or higher
- PostgreSQL 14 or higher
- pgAdmin (comes with PostgreSQL installation)

### Database Setup

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. During installation:

   - Remember the password you set for the `postgres` user
   - Keep the default port (5432)
   - Complete the installation

3. Open pgAdmin from your Start menu
4. Create the database:
   - Open pgAdmin and connect to your server
   - Right-click on "Databases"
   - Select "Create" > "Database"
   - Enter `matchmakr_db` as the database name
   - Leave the owner as "postgres"
   - Click "Save"

### Project Setup

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd matchmakr
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root:

   ```
   DEBUG=True
   SECRET_KEY='django-insecure-change-this-in-production'
   DB_NAME=matchmakr_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   DB_HOST=localhost
   DB_PORT=5432
   ```

   Replace `your_postgres_password_here` with the password you set during PostgreSQL installation.

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Important Notes

- Never commit the `.env` file to version control
- Each developer should maintain their own `.env` file with their local database credentials
- The database schema is version controlled through migrations, but the data is not
- For production deployment, different environment variables will be needed
