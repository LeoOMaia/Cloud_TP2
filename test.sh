wget --server-response \
     --output-document response.out \
     --header='Content-Type: application/json' \
     --post-data '{"songs": ["Yesterday", "Bohemian Rhapsody"]}' \
     http://10.111.233.250:32171/api/recommend