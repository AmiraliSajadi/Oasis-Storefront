# CS530-SDA
The project lives on [GitHub](https://github.com/AmiraliSajadi/CS530-SDA/)

This is a webapp based on JavaScript(jQuery), CSS (Bootstrap), and Python (Flask). The app was initially created to connect to PostgreSQL but we have adapted it to work with SQLite so that we can host it on tux.

## Setup
Your Python3 version needs to be below 3.12. Python 3.10 was used to install the required packages. Using a virtual environment is strongly recommended. Navigate to the root folder and:
```
virtualenv ./myenv
```

install the required packages:

```
pip install -r requirements.txt
```

activate the virtual env

## PostgreSQL speicfic instruction: Set your system variables
You need to set the two variables used in *config.py*:
- OASIS_DATABASE_URL

## SQLite specific instruction
The database files is included in the repository. You can use/hack the `sample_query.txt` file to populate the database with dummy data. To use this file run:
```
sqlite3 app/sqlite/database.db

sqlite> .read ./sample_query.txt
```

## Run the Flask app
just run the `run.py` file in the root directory:

```
python run.py
```

## Some Notable Features:
- Users can create accounts.
- view all the products up for sale.
- Add products to their wishlists (*Registered* users only).
- Add products to their carts and make purchases (*Registered* users only).
- Put up products for sale (*Registered* users only).