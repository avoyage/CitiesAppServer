{
  "json_object( 'kinopoisk_rating', t.kinopoisk_rating, 'imdb_rating', t.imdb_rating, 'total_seasons', t.total_seasons, 'players', json_array( (select GROUP_CONCAT( json_object( 'hostname', p.hostname, 'file_name', tpe.file_name, 'season', tpe.season, 'episod":
  "{\"players\": [\"{\\\"season\\\": 1, \\\"episode\\\": 1, \\\"hostname\\\": \\\"kinoclub.cc\\\", \\\"file_name\\\": \\\"19891-molodoy-papa.html\\\"},{\\\"season\\\": 1, \\\"episode\\\": 2, \\\"hostname\\\": \\\"kinoclub.cc\\\", \\\"file_name\\\": \\\"19891-molodoy-papa.html\\\"},{\\\"season\\\": 1, \\\"episode\\\": 1, \\\"hostname\\\": \\\"kinoclub.cc\\\", \\\"file_name\\\": \\\"123.html\\\"}\"], \"imdb_rating\": 8.5, \"total_seasons\": 1, \"kinopoisk_rating\": 8.300000190734863}"
}