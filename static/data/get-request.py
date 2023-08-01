import requests
import json
import os
from config import api_key  # Import the API key from the config.py file

def get_books_by_author(author_name):
    base_url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": f"inauthor:{author_name}",
        "key": api_key,  
        "startIndex": 80, 
        "maxResults": 40,  
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve books. Status Code: {response.status_code}")
        return None

def save_json_to_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file)

author_name = "Richard Bachman"

result = get_books_by_author(author_name)

if result:
    # Get the current directory and create a file path in the same folder as the script
    current_directory = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_directory, "bachman3.json")
    
    save_json_to_file(result, file_path)
    print(f"JSON data for {author_name} saved to {file_path}")
else:
    print("No books found.")
