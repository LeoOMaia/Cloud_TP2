import pickle
import pandas as pd
import requests
import time
from io import StringIO
from mlxtend.frequent_patterns import apriori, association_rules

URL = "https://homepages.dcc.ufmg.br/~cunha/hosted/cloudcomp-2023s2-datasets/2023_spotify_ds1.csv"
RULES_PATH = "models/rules.pkl"
FREK_PATH = "models/freq.pkl"

min_support = 0.04
min_threshold = 1

class FreqDatasetMining:
    def __init__(self, file):
        self.file = file
        self.df = None
        self.freq = None
        self.rules = None
    
    def group_by_pid_and_track_uri(self):
        df = self.file

        df = df.groupby(['pid', 'track_name'])['track_name'].count().unstack().fillna(0)

        df = df.applymap(self.encode)

        self.df = df

    def encode(self, x):
        if x <= 0:
            return False
        if x >= 1:
            return True
    
    def get_freq(self):
        self.freq = apriori(self.df, min_support=min_support, use_colnames=True, verbose=1)
        self.freq.to_pickle(FREK_PATH)
    
    def get_rules(self):
        self.rules = association_rules(self.freq, metric="lift", min_threshold=min_threshold)
        self.rules.to_pickle(RULES_PATH)

if __name__ == '__main__':
    response = requests.get(URL, verify=False)
    csv_data = StringIO(response.text)
    df = pd.read_csv(csv_data)
    fdm = FreqDatasetMining(df)
    fdm.group_by_pid_and_track_uri()
    fdm.get_freq()
    fdm.get_rules()