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

    translations = []
    compounds = []
    rest = {}

    for child in word:
        # storing translations and compounds in their own column for better search
        if child.tag == "translation":
            translations.append(child.get("value"))
        if child.tag == "compound":
            compounds.append(child.get("value"))
        # and also with everything else together
        # not pretty but it helps in the client
        newChild = {}
        for attrib in child.items():
            newChild[attrib[0]] = attrib[1]

        # only for example/translation and paradigm/inflection
        for childChild in child:
            newChild[childChild.tag] = childChild.get("value")
            if childChild.get("comment") != None:
                newChild[childChild.tag + "_comment"] = childChild.get("comment")

        rest[child.tag] = newChild

    # arrays and dictionaries to json
    if len(translations) > 0:
        newWord["translations"] = json.dumps(translations)
    if len(compounds) > 0:
        newWord["compounds"] = json.dumps(compounds)
    if rest:
        newWord["rest"] = json.dumps(rest)
    words.append(newWord)


for word in words:
    # build query
    columns = ", ".join(word.keys())
    placeholders = ", ".join(f":{key}" for key in word.keys())
    query = f"INSERT INTO Words ({columns}) VALUES ({placeholders})"

    cursor.execute(query, word)

conn.commit()
conn.close()
