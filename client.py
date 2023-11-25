import requests
import sys
import json

api_url = 'http://10.111.233.250:32196/api/recommend'

if len(sys.argv) < 2:
    print("Usage: python client.py <song1> ...")
    sys.exit(1)

input_playlist = sys.argv[1:]

data = json.dumps({'songs': input_playlist})

headers = {'Content-Type': 'application/json'}

response = requests.post(api_url, data=data, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")