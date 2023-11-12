from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

rules_path = 'rules.pkl'

@app.route('/api/recommend', methods=['POST'])
def recommend():
    songs = request.json['songs']

    rules = pickle.load(open(rules_path, 'rb'))

    recommended_songs = []

    for song in songs:
        recommended_songs.append("teste")

    return jsonify(recommended_songs)

if __name__ == '__main__':
    app.run(port=5000)


