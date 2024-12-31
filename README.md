# Oasis Storefront

A Flask-based web application for an online store, enabling users to browse, wishlist, and purchase products. Built using **Python (Flask)**, **JavaScript (jQuery)**, **CSS (Bootstrap)**, and connected to **SQLite/PostgreSQL**.

## Features
- **User Accounts**: Register and log in to manage personal profiles.
- **Product Browsing**: View all products available for sale.
- **Wishlists**: Add favorite products to your wishlist (*Registered users only*).
- **Shopping Cart**: Add products to your cart and make purchases (*Registered users only*).
- **Seller Features**: Put up products for sale (*Registered users only*).

## Setup Instructions

### Prerequisites
- **Python 3.10+ (but below 3.12)** is recommended.
- Using a virtual environment is strongly recommended.

### Installation
1. Clone the repository:
```bash
git clone https://github.com/AmiraliSajadi/Oasis-Storefront.git
cd cd Oasis-Storefront
```
2. Set up a virtual environment:
```bash
python3 -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
### Database Configuration
#### SQLite (Default)
1. Use the included database.db file or populate it with dummy data:
```bash
sqlite3 app/sqlite/database.db
sqlite> .read ./sample_query.txt
```
#### PostgreSQL
1. Set the following environment variables used in config.py: `OASIS_DATABASE_URL`
2. Update config.py accordingly.

### Run the Application
Start the Flask app by running:
```bash
python run.py
```
### Access the Application
Open your web browser and navigate to http://localhost:5000
