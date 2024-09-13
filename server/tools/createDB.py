#!/usr/bin/env python3

import argparse
import sqlite3

parser = argparse.ArgumentParser(
    description="Create SQLite database with proper columns"
)
parser.add_argument("dest_file", metavar="sqlite.db", help="SQLite DB")
args = parser.parse_args()

conn = sqlite3.connect(args.dest_file)
cursor = conn.cursor()

cursor.execute(
    """
CREATE TABLE IF NOT EXISTS Words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT,
    language TEXT,
    class TEXT,
    comment TEXT,
    rest TEXT
)
"""
)

cursor.execute("CREATE INDEX idx_word_id ON Words(id)")

cursor.execute(
    """
CREATE TABLE Matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    language TEXT NOT NULL,
    value TEXT NOT NULL,
    key TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute("CREATE INDEX idx_match_word_id ON Matches(word_id)")
cursor.execute("CREATE INDEX idx_match_value ON Matches(value)")

conn.commit()
conn.close()
