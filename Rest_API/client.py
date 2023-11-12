import requests
import sys
import json

api_url = 'http://127.0.0.1:5000/api/recommend'

input_playlist = sys.argv[1:]

data = json.dumps({'songs': input_playlist})

headers = {'Content-Type': 'application/json'}

response = requests.post(api_url, data=data, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")