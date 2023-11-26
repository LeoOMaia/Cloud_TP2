from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS
import pickle
import json
import pandas as pd

app = Flask(__name__)
CORS(app)

RULES_PATH = "/app/models/rules.pkl"
FREK_PATH = "/app/models/freq.pkl"

def recommendations(songs):
    rules = pd.read_pickle(RULES_PATH)
    freq = pd.read_pickle(FREK_PATH)

    recommended_playlists = {}

    for song in songs:
        filtered_rules = rules[rules['antecedents'].apply(lambda x: song in x)]
        if not filtered_rules.empty:
            for index, row in filtered_rules.iterrows():
                consequents = row['consequents']
                for consequent in consequents:
                    if consequent not in recommended_playlists:
                        recommended_playlists[consequent] = 0
                    recommended_playlists[consequent] += 1
        
        filtered_freq = freq[freq['itemsets'].apply(lambda x: song in x)]
        if not filtered_freq.empty:
            for index, row in filtered_freq.iterrows():
                itemsets = row['itemsets']
                for item in itemsets:
                    if item not in recommended_playlists:
                        recommended_playlists[item] = 0
                    recommended_playlists[item] += 1

    # Removing input songs from recommendations
    for song in songs:
        recommended_playlists.pop(song, None)

    # Sort recommended playlists by their weights (occurrences)
    recommended_playlists = dict(sorted(recommended_playlists.items(), key=lambda x: x[1], reverse=True))
    
    return list(recommended_playlists.keys())


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    input_songs = data.get('songs', [])
    
    recommended = recommendations(input_songs)
    return jsonify({'recommended_playlists': recommended})

@app.route('/api/songs', methods=['GET'])
def get_songs():
    with open('Tracknames/updated_track_names.json', 'r') as file:
        songs_data = json.load(file)
    return jsonify({'songs': songs_data})

if __name__ == '__main__':
    app.run(port=32196)