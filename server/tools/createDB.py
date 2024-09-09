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
    clean_value TEXT,
    language TEXT,
    class TEXT,
    comment TEXT,
    rest TEXT
)
"""
)

cursor.execute("CREATE INDEX idx_word_clean_value ON Words(clean_value)")

cursor.execute(
    """
CREATE TABLE Translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute("CREATE INDEX idx_translation_word_id ON Translations(word_id)")
cursor.execute("CREATE INDEX idx_translation_value ON Translations(value)")

cursor.execute(
    """
CREATE TABLE Inflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute("CREATE INDEX idx_inflection_word_id ON Inflections(word_id)")
cursor.execute("CREATE INDEX idx_inflection_value ON Inflections(value)")

cursor.execute(
    """
CREATE TABLE Compounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    clean_value TEXT NOT NULL,
    translation TEXT,
    inflection TEXT,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute("CREATE INDEX idx_compound_word_id ON Compounds(word_id)")
cursor.execute("CREATE INDEX idx_compound_clean_value ON Compounds(clean_value)")

cursor.execute(
    """
CREATE TABLE Derivations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    translation TEXT,
    inflection TEXT,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute("CREATE INDEX idx_derivation_word_id ON Derivations(word_id)")
cursor.execute("CREATE INDEX idx_derivation_value ON Derivations(value)")

cursor.execute(
    """
CREATE TABLE Variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES Words(id) ON DELETE CASCADE
)
"""
)

cursor.execute("CREATE INDEX idx_variant_word_id ON Variants(word_id)")
cursor.execute("CREATE INDEX idx_variant_value ON Variants(value)")

conn.commit()
conn.close()
