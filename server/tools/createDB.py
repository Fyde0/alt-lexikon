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
    word TEXT,
    language TEXT,
    class TEXT,
    comment TEXT,
    rest TEXT
)
"""
)

cursor.execute(
    """
CREATE TABLE Translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    comment TEXT,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute(
    """
CREATE TABLE Inflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    comment TEXT,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute(
    """
CREATE TABLE Compounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    translation TEXT,
    inflection TEXT,
    comment TEXT,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

conn.commit()
conn.close()
