CREATE TABLE hosts (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  host_id TEXT REFERENCES hosts(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE guests (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  nickname TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE songs (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  youtube_id TEXT NOT NULL,
  title TEXT,
  artist TEXT,
  added_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  song_id TEXT REFERENCES songs(id) ON DELETE CASCADE,
  guest_id TEXT REFERENCES guests(id) ON DELETE CASCADE,
  vote INT CHECK (vote IN (-1, 1)),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(song_id, guest_id)
);

CREATE TABLE session_state (
  session_id TEXT PRIMARY KEY REFERENCES sessions(id),
  current_song_id TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
