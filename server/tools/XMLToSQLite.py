#!/usr/bin/env python3

import argparse
import xml.etree.ElementTree as ET
import sqlite3
from collections import defaultdict
import json

parser = argparse.ArgumentParser(description="Convert XML to SQLite")
parser.add_argument("file", metavar="file.xml", type=open, help="XML file")
parser.add_argument("db", metavar="sqlite.db", help="SQLite database")
args = parser.parse_args()

tree = ET.parse(args.file)
root = tree.getroot()

conn = sqlite3.connect(args.db)
cursor = conn.cursor()

words = []

for word in root:

    newWord = {}
    newWord["word"] = word.get("value")
    newWord["language"] = word.get("lang")
    newWord["class"] = word.get("class")
    newWord["comment"] = word.get("comment")

    for child in word:
        newChild = {}
        for attrib in child.items():
            newChild[attrib[0]] = attrib[1]
        newWord[child.tag] = json.dumps(newChild)

        for child in child:
            newChildChild = {}
            for attrib in child.items():
                newChildChild[attrib[0]] = attrib[1]
            newChild[child.tag] = json.dumps(newChildChild)

    words.append(newWord)


for word in words:
    # build query
    columns = ", ".join(word.keys())
    placeholders = ", ".join(f":{key}" for key in word.keys())
    query = f"INSERT INTO Words ({columns}) VALUES ({placeholders})"

    cursor.execute(query, word)

conn.commit()
conn.close()
