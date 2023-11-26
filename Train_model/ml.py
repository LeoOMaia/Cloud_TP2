import pickle
import pandas as pd
import os
import ssl
from mlxtend.frequent_patterns import apriori, association_rules

FILE_PATH_DATASET = os.environ.get('FILE_PATH_DATASET')
RULES_PATH = "/app/models/rules.pkl"
FREK_PATH = "/app/models/freq.pkl"

min_support = 0.05
min_threshold = 1

class FreqDatasetMining:
    def __init__(self, file_path):
        self.file_path = file_path
        self.df = None
        self.freq = None
        self.rules = None
    
    def group_by_pid_and_track_uri(self):
        df = pd.read_csv(self.file_path)

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
        
    # # Keep the container running forever
    # while True:
    #     print("Running...")
    #     time.sleep(3)


if __name__ == '__main__':
    fdm = FreqDatasetMining(FILE_PATH_DATASET)
    fdm.group_by_pid_and_track_uri()
    fdm.get_freq()
    fdm.get_rules()