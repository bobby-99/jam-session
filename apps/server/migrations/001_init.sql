CREATE TABLE hosts (
  id UUID PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE guests (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  nickname TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE songs (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  youtube_id TEXT NOT NULL,
  title TEXT,
  artist TEXT,
  added_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
  id UUID PRIMARY KEY,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  vote INT CHECK (vote IN (-1, 1)),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(song_id, guest_id)
);

CREATE TABLE session_state (
  session_id UUID PRIMARY KEY REFERENCES sessions(id),
  current_song_id UUID,
  updated_at TIMESTAMP DEFAULT NOW()
);
