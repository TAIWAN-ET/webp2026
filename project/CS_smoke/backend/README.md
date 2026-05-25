# Django backend for CS_smoke

This folder contains a minimal Django project exposing `Point` and `Route` models and simple JSON endpoints.

Requirements
- Python 3.8+
- Django (install via pip)

Quick start

1. Create a virtualenv and install Django:

```bash
python -m venv .venv
source .venv/bin/activate
pip install Django
```

2. Apply migrations and create a superuser (optional):

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

3. Run the server:

```bash
python manage.py runserver
```

APIs
- `GET /api/points/` -> list of points
- `GET /api/routes/` -> list of routes

Importing example SQL

If you prefer to import the provided SQLite SQL instead of creating objects via Django admin, run the script at repository root:

```bash
sqlite3 db.sqlite3 < ../sql/init_points_routes.sql
```
