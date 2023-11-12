import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

FILE_PATH = '2023_spotify_ds1.csv'

min_support = 0.05
min_threshold = 0.05

class FreqDatasetMining:
    def __init__(self, file_path):
        self.file_path = file_path
        self.df = None
        self.freq = None
        self.rules = None
    
    def group_by_pid_and_track_uri(self):
        df = pd.read_csv(self.file_path)

        df = df[['pid', 'track_uri']]

        df = df.groupby(['pid', 'track_uri'])['track_uri'].count().unstack().fillna(0)

        df = df.applymap(self.encode)

        self.df = df

    def encode(self, x):
        if x <= 0:
            return False
        if x >= 1:
            return True
    
    def get_freq(self):
        self.freq = apriori(self.df, min_support=min_support, use_colnames=True)
        self.freq.to_pickle('freq.pkl')
        print("freq.pkl created successfully")
    
    def get_rules(self):
        self.rules = association_rules(self.freq, metric="lift", min_threshold=min_threshold)
        self.rules.to_pickle('rules.pkl')
        print("rules.pkl created successfully")


if __name__ == '__main__':
    fdm = FreqDatasetMining(FILE_PATH)

    fdm.group_by_pid_and_track_uri()

    fdm.get_freq()
    fdm.get_rules()



