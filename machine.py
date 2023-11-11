import pandas as pd
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules

df_spotify_ds1 = pd.read_csv("/home/datasets/2023_spotify_ds1.csv")
df_spotify_ds2 = pd.read_csv("/home/datasets/2023_spotify_ds2.csv")
df_songs = pd.read_csv("/home/datasets/2023_spotify_songs.csv")



print(f"spotify_ds1:\n{df_spotify_ds1.head()}")
print(f"spotify_ds2:\n{df_spotify_ds2.head()}")
print(f"songs:\n{df_songs.head()}")