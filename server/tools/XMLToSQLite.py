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
    newWord["value"] = word.get("value")
    newWord["language"] = word.get("lang")
    newWord["class"] = word.get("class")
    newWord["comment"] = word.get("comment")

    rest = defaultdict(list)

    matches = []
    matches.append({"value": word.get("value").replace("|", ""), "key": "Word"})

    for child in word:

        # separate match table for search

        # Translations
        if child.tag == "translation":
            transValue = child.get("value")
            transValueNoUs = re.sub(
                r"\s?\[US\]\s?", "", transValue
            )  # not needed in search

            # no () in all values, not needed in search
            values = []

            # no [], eg [school] term => school term
            value1 = transValueNoUs.replace("[", "").replace("]", "").replace("(", "").replace(")", "").strip()
            values.append(value1)

            # no [] and content, eg [telephone] answering machine => answering machine
            transValueNoSquares = re.sub(r"\s?\[.+?\]\s?", "", transValueNoUs)
            value2 = transValueNoSquares.replace("(", "").replace(")", "").strip()
            if value2 not in values:
                values.append(value2)

            # no [] and () and content, [phone-in radio programme] host (hostess) => host
            value3 = re.sub(r"\s?\(.+?\)\s?", "", transValueNoSquares).strip()
            if value3 not in values:
                values.append(value3)

            for value in values:
                matches.append({"value": value, "key": "Translation"})

        # Compounds
        if child.tag == "compound":
            cleanValue = child.get("value").replace("|", "")
            matches.append({"value": cleanValue, "key": "Compound"})

        # Inflections
        if child.tag == "paradigm":
            for paradigmChild in child:
                if paradigmChild.tag == "inflection":
                    matches.append({"value": paradigmChild.get("value"), "key": "Inflection"})


        # Derivations
        if child.tag == "derivation":
            matches.append({"value": child.get("value"), "key": "Derivation"})

        # Variants
        if child.tag == "variant":
            matches.append({"value": child.get("value"), "key": "Variant"})

        # all data also in main table for client
        newChild = defaultdict(list)
        for attrib in child.items():
            newChild[attrib[0]] = attrib[1].strip()

        # for nested elements
        for childChild in child:
            newChildChild = {}
            for attrib in childChild.items():
                newChildChild[attrib[0]] = attrib[1].strip()
            newChild[childChild.tag].append(newChildChild)

        rest[child.tag].append(newChild)

    if rest:
        newWord["rest"] = json.dumps(rest)

    wordId = insertObject(newWord, "Words", cursor)
    for matchObj in matches:
        matchObj["word_id"] = wordId
        insertObject(matchObj, "Matches", cursor)

conn.commit()
conn.close()
