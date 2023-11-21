from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)
rules_path = '../Pickle/rules.pkl'
freq_path = '../Pickle/freq.pkl'

@app.route('/api/recommend', methods=['POST'])
def recommend():
    songs = request.json['songs']
    rules = pickle.load(open(rules_path, 'rb'))
    freq = pickle.load(open(freq_path, 'rb'))
    recommended_playlists = []

    # Verifica as regras de associação para recomendar playlists
    for song in songs:
        filtered_rules = rules[rules['antecedents'] == frozenset({song})]
        if not filtered_rules.empty:
            recommended_playlists.extend(filtered_rules['consequents'].values[0])

    # Remove duplicatas e converte para uma lista única de playlists recomendadas
    recommended_playlists = list(set(recommended_playlists))

    return jsonify({'recommended_playlists': recommended_playlists})

if __name__ == '__main__':
    app.run(port=32196)