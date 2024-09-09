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
    newWord["clean_value"] = word.get("value").replace("|", "") # for search
    newWord["language"] = word.get("lang")
    newWord["class"] = word.get("class")
    newWord["comment"] = word.get("comment")

    rest = defaultdict(list)

    translations = []
    compounds = []
    inflections = []
    derivations = []
    variants = []

    for child in word:

        # separate tables only for search

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
                translations.append({"value": value})

        # Compounds
        if child.tag == "compound":
            newCompound = {}
            newCompound["value"] = child.get("value")
            newCompound["clean_value"] = child.get("value").replace("|", "") # for search
            newCompound["inflection"] = child.get("inflection")
            for compoundChild in child:
                if compoundChild.tag == "translation":
                    newCompound["translation"] = compoundChild.get("value")
            compounds.append(newCompound)

        # Inflections
        if child.tag == "paradigm":
            for paradigmChild in child:
                if paradigmChild.tag == "inflection":
                    newInflection = {}
                    newInflection["value"] = paradigmChild.get("value")
                    inflections.append(newInflection)

        # Derivations
        if child.tag == "derivation":
            newDerivation = {}
            newDerivation["value"] = child.get("value")
            newDerivation["inflection"] = child.get("inflection")
            for derivChild in child:
                if derivChild.tag == "translation":
                    newDerivation["translation"] = derivChild.get("value")
            derivations.append(newDerivation)

        # Variants
        if child.tag == "variant":
            newVariant = {}
            newVariant["value"] = child.get("value")
            variants.append(newVariant)

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
    for translation in translations:
        translation["word_id"] = wordId
        insertObject(translation, "Translations", cursor)
    for inflection in inflections:
        inflection["word_id"] = wordId
        insertObject(inflection, "Inflections", cursor)
    for compound in compounds:
        compound["word_id"] = wordId
        insertObject(compound, "Compounds", cursor)
    for deriv in derivations:
        deriv["word_id"] = wordId
        insertObject(deriv, "Derivations", cursor)
    for variant in variants:
        variant["word_id"] = wordId
        insertObject(variant, "Variants", cursor)

conn.commit()
conn.close()
