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
# pattern for double escaped entities (eg. &amp;quot; but not &amp;)
pattern = re.compile(r"&amp;([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});")
with open(args.file, "r") as file:
    # find the pattern and replace &amp; with &
    def replaceMatch(match):
        entity = match.group(1)
        return f"&{entity};"

    fixed = pattern.sub(replaceMatch, file.read())

# load xml file
root = ET.fromstring(fixed)

# open db
conn = sqlite3.connect(args.db)
cursor = conn.cursor()

# functions to add object to db, object keys become db columns
def insertObject(obj, table, crsr):
    columns = ", ".join(obj.keys())
    placeholders = ", ".join(f":{key}" for key in obj.keys())
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    crsr.execute(query, obj)
    return crsr.lastrowid

for word in root:

    newWord = {}
    newWord["value"] = word.get("value")
    newWord["language"] = word.get("lang")
    newWord["class"] = word.get("class")
    newWord["comment"] = word.get("comment")

    # defaultdict(list) creates non existing keys automatically
    rest = defaultdict(list)

    # making "matches", matches are searchable things: words, inflections, etc.
    # matches are connected to their original word with its base data (value and language)
    # to properly display them in the search field (clean value, no |)
    wordData = {"word": word.get("value").replace("|", ""), "language": word.get("lang")}

    matches = []

    # Match: base word match (clean value, no |, | is annoying when searching)
    newMatch = {"value": word.get("value").replace("|", ""), "key": "Word"}
    newMatch.update(wordData) # add base word data
    matches.append(newMatch)

    for child in word:
        # Translations (stored in 3 ways)
        if child.tag == "translation":
            transValue = child.get("value")
            transValueNoUs = re.sub(
                r"\s?\[US\]\s?", "", transValue
            )  # "[US]" not needed in search

            # no () characters in all values, not needed in search
            values = []

            # Match: translation with no [] characters
            # eg [school] term => school term
            value1 = transValueNoUs.replace("[", "").replace("]", "").replace("(", "").replace(")", "").strip()
            values.append(value1)

            # Match: translation with no [] and no content inside []
            # eg [telephone] answering machine => answering machine
            transValueNoSquares = re.sub(r"\s?\[.+?\]\s?", "", transValueNoUs)
            value2 = transValueNoSquares.replace("(", "").replace(")", "").strip()
            if value2 not in values:
                values.append(value2)

            # Match: translation with no [] and () and content inside
            # eg [phone-in radio programme] host (hostess) => host
            value3 = re.sub(r"\s?\(.+?\)\s?", "", transValueNoSquares).strip()
            if value3 not in values:
                values.append(value3)

            for value in values:
                newMatch = {"value": value, "key": "Translation"}
                newMatch.update(wordData) # add base word data
                matches.append(newMatch)

        # Compounds
        if child.tag == "compound":
            # Match: clean compound, no |
            cleanValue = child.get("value").replace("|", "")
            newMatch = {"value": cleanValue, "key": "Compound"}
            newMatch.update(wordData) # add base word data
            matches.append(newMatch)

        # Inflections
        if child.tag == "paradigm":
            for paradigmChild in child:
                if paradigmChild.tag == "inflection":
                    # Match: inflection
                    newMatch = {"value": paradigmChild.get("value"), "key": "Inflection"}
                    newMatch.update(wordData) # add base word data
                    matches.append(newMatch)


        # Derivations
        if child.tag == "derivation":
            # Match: derivation
            newMatch = {"value": child.get("value"), "key": "Derivation"}
            newMatch.update(wordData) # add base word data
            matches.append(newMatch)

        # Variants
        if child.tag == "variant":
            # Match: variant
            newMatch = {"value": child.get("value"), "key": "Variant"}
            newMatch.update(wordData) # add base word data
            matches.append(newMatch)

        # all word data to store in the main table, for client
        newChild = defaultdict(list)
        for attrib in child.items():
            newChild[attrib[0]] = attrib[1].strip()

        # also get nested elements
        for childChild in child:
            newChildChild = {}
            for attrib in childChild.items():
                newChildChild[attrib[0]] = attrib[1].strip()
            newChild[childChild.tag].append(newChildChild)

        rest[child.tag].append(newChild)

    # store in json
    if rest:
        newWord["rest"] = json.dumps(rest)

    # word data in Words table
    wordId = insertObject(newWord, "Words", cursor)
    for matchObj in matches:
        # connect matches to word with word_id
        matchObj["word_id"] = wordId
        # matches in Matches table
        insertObject(matchObj, "Matches", cursor)

conn.commit()
conn.close()
