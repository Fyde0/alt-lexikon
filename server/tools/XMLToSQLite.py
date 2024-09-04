#!/usr/bin/env python3

import argparse
import xml.etree.ElementTree as ET
import sqlite3
from collections import defaultdict
import json
import re

parser = argparse.ArgumentParser(description="Convert XML to SQLite")
parser.add_argument("file", metavar="file.xml", help="XML file")
parser.add_argument("db", metavar="sqlite.db", help="SQLite database")
args = parser.parse_args()

# The file has some html entities escaped twice, but not all, this fixes it
# Pattern for double escaped entities (eg. &amp;quot; but not &amp;)
pattern = re.compile(r'&amp;([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});')
with open(args.file, "r") as file:
    # Find the pattern and replace &amp; with &
    def replaceMatch(match):
        entity = match.group(1)
        return f'&{entity};'
    fixed = pattern.sub(replaceMatch, file.read())

root = ET.fromstring(fixed)

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
    inflections = []
    rest = defaultdict(list)

    for child in word:
        # storing translations compounds and inflections in their own column for search
        if child.tag == "translation":
            translations.append(child.get("value"))
        if child.tag == "compound":
            compounds.append(child.get("value"))
        if child.tag == "inflections":
            inflections.append(child.get("value"))
        # and also with everything else together
        # not pretty but it helps in the client
        newChild = defaultdict(list)
        for attrib in child.items():
            newChild[attrib[0]] = attrib[1]

        # for example/translation, paradigm/inflection, idiom/translation
        for childChild in child:
            newChildChild = {}
            for attrib in childChild.items():
                newChildChild[attrib[0]] = attrib[1]
            newChild[childChild.tag].append(newChildChild)

        rest[child.tag].append(newChild)

    # arrays and dictionaries to json
    if len(translations) > 0:
        newWord["translations"] = json.dumps(translations)
    if len(compounds) > 0:
        newWord["compounds"] = json.dumps(compounds)
    if len(inflections) > 0:
        newWord["inflections"] = json.dumps(inflections)
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
