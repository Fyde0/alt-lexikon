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
pattern = re.compile(r"&amp;([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});")
with open(args.file, "r") as file:
    # Find the pattern and replace &amp; with &
    def replaceMatch(match):
        entity = match.group(1)
        return f"&{entity};"

    fixed = pattern.sub(replaceMatch, file.read())

root = ET.fromstring(fixed)

conn = sqlite3.connect(args.db)
cursor = conn.cursor()

def insertObject(obj, table, crsr):
    columns = ", ".join(obj.keys())
    placeholders = ", ".join(f":{key}" for key in obj.keys())
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    crsr.execute(query, obj)
    return crsr.lastrowid

for word in root:

    newWord = {}
    newWord["word"] = word.get("value")
    newWord["language"] = word.get("lang")
    newWord["class"] = word.get("class")
    newWord["comment"] = word.get("comment")

    rest = defaultdict(list)

    translations = []
    compounds = []
    inflections = []

    for child in word:
        # translations, compounds ans inflections go in separate tables for better search
        if child.tag == "translation":
            newTranslation = {}
            newTranslation["value"] = child.get("value")
            newTranslation["comment"] = child.get("comment")
            translations.append(newTranslation)
        if child.tag == "compound":
            newCompound = {}
            newCompound["value"] = child.get("value")
            newCompound["inflection"] = child.get("inflection")
            newCompound["comment"] = child.get("comment")
            for compoundChild in child:
                if compoundChild.tag == "translation":
                    newCompound["translation"] = compoundChild.get("value")
            compounds.append(newCompound)
        if child.tag == "paradigm":
            for paradigmChild in child:
                if paradigmChild.tag == "inflection":
                    newInflection = {}
                    newInflection["value"] = paradigmChild.get("value")
                    newInflection["comment"] = paradigmChild.get("comment")
                    inflections.append(newInflection)
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

    if rest:
        newWord["rest"] = json.dumps(rest)
    
    wordId = insertObject(newWord, "Words", cursor)
    for translation in translations:
        translation["word_id"] = wordId
        insertObject(translation, "Translations", cursor)
    for inflection in inflections:
        inflection["word_id"] = wordId
        insertObject(inflection, "Inflections", cursor)
    for compound in compounds:
        compound["word_id"] = wordId
        insertObject(compound, "Compounds", cursor)

conn.commit()
conn.close()