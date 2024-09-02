#!/usr/bin/env python3
 
import argparse
import sqlite3

parser = argparse.ArgumentParser(description="Create SQLite database with proper columns")
parser.add_argument(
    "dest_file", metavar="sqlite.db", help="SQLite DB"
)
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
    translations TEXT,
    compounds TEXT,
    inflections TEXT,
    rest TEXT
)
"""
)

conn.commit()
conn.close()