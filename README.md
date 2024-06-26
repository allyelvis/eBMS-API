To achieve this workflow, we'll break it down into several steps:

1. **Get Invoice from Zoho**: Use Zoho's API to retrieve the invoice data.
2. **Stream Data to External Endpoint**: Use a REST API to send this data in real-time to an external endpoint.
3. **Authentication**: Use basic authentication to get a bearer token.
4. **Post Invoice to External Endpoint with Bearer Token**: Post the invoice data to the external endpoint using the bearer token.
5. **Store Data in PostgreSQL**: Store the retrieved invoice data in a PostgreSQL database.

### Step 1: Get Invoice from Zoho

First, you need to authenticate and retrieve the invoice from Zoho. 

#### Authentication with Zoho:

1. Obtain the Zoho OAuth 2.0 access token.
2. Use the access token to make API calls.

Here’s a Python example using the `requests` library:

```python
import requests

# Define your credentials
client_id = 'your_client_id'
client_secret = 'your_client_secret'
refresh_token = 'your_refresh_token'
redirect_uri = 'your_redirect_uri'

# Get access token
auth_url = 'https://accounts.zoho.com/oauth/v2/token'
params = {
    'refresh_token': refresh_token,
    'client_id': client_id,
    'client_secret': client_secret,
    'redirect_uri': redirect_uri,
    'grant_type': 'refresh_token'
}

response = requests.post(auth_url, params=params)
access_token = response.json()['access_token']

# Retrieve an invoice
invoice_id = 'your_invoice_id'
invoice_url = f'https://books.zoho.com/api/v3/invoices/{invoice_id}'
headers = {
    'Authorization': f'Zoho-oauthtoken {access_token}'
}

response = requests.get(invoice_url, headers=headers)
invoice_data = response.json()
```

### Step 2: Stream Data to External Endpoint

Assume you have an external endpoint that expects data in a specific format. Here’s how you can stream data in real-time using REST API.

### Step 3: Authentication to Get Bearer Token

You need to perform basic authentication to get a bearer token from your external endpoint.

```python
auth_endpoint = 'https://external-endpoint.com/auth'
auth_response = requests.post(auth_endpoint, auth=('your_username', 'your_password'))
bearer_token = auth_response.json()['access_token']
```

### Step 4: Post Invoice to External Endpoint with Bearer Token

Now, use the bearer token to post the invoice data.

```python
post_invoice_url = 'https://external-endpoint.com/invoices'
headers = {
    'Authorization': f'Bearer {bearer_token}',
    'Content-Type': 'application/json'
}

post_response = requests.post(post_invoice_url, headers=headers, json=invoice_data)
```

### Step 5: Store Data in PostgreSQL

Install the `psycopg2` library if you haven’t already:

```sh
pip install psycopg2
```

Then, use the following code to store the invoice data in PostgreSQL:

```python
import psycopg2
import json

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname='your_dbname',
    user='your_dbuser',
    password='your_dbpassword',
    host='your_dbhost',
    port='your_dbport'
)
cur = conn.cursor()

# Example: Assume invoice_data is a dictionary and we store it as a JSON string
invoice_json = json.dumps(invoice_data)

# Create table if not exists
cur.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_data JSONB
    )
""")

# Insert the invoice data
cur.execute("""
    INSERT INTO invoices (invoice_data)
    VALUES (%s)
""", (invoice_json,))

# Commit and close
conn.commit()
cur.close()
conn.close()
```

This workflow outlines how to retrieve invoice data from Zoho, authenticate and post it to an external endpoint, and store the data in PostgreSQL. Adjust the example code to fit your specific requirements and environment.