import sys
import re
from re import search
import glob

# COPYRIGHT_REGEX = '(?:copyright[ \t]*)?\(c\)[ \t]+(?:20)[0-9]{2}(?: - (?:20)[0-9]{2})? ACME GmbH - All Rights Reserved\.(?:\n\/\/)? ACME, ACME\.com are trademarks of ACME AG'
# COPYRIGHT_REGEX = '\/\*\s*\*\s*@copyright Copyright \(c\) \d{4} [^\*]+\*\/'
# COPYRIGHT_REGEX = '\/\/ <copyright>\n\/\/ [^\n]*\n\/\/ [^\n]*\n\/\/ [^\n]*\n\/\/ [^\n]*\n\/\/ Copyright \(c\) \d{4} - \d{4} [^\n]*\n\/\/ [^\n]*\n\/\/ <\/copyright>'

# TYPESCRIPT
TS_COPYRIGHT_REGEX = '\/(\*|\*\*)\s*\*\s*@copyright Copyright \(c\) \d{4} [^\*]+\*\/'

# C#
CS_COPYRIGHT_REGEX ='\/\/ <copyright>(?:[\s\S]*?)\/\/ <\/copyright>'

# Symbols
check = '\u2714'
failed = '\u2718'

findings = []

def printPositive(file):
    print(f'{check}', file)

def printNegative(file):
    print(f'{failed}', file)

def addToNegativeList(file):
    findings.append(file)

def buildRegex(fileExtension):
    if fileExtension == '*.ts':
        COPYRIGHT_REGEX = TS_COPYRIGHT_REGEX
    if fileExtension == '*.cs':
        COPYRIGHT_REGEX = CS_COPYRIGHT_REGEX

    return re.compile(COPYRIGHT_REGEX, re.MULTILINE | re.IGNORECASE)

def scan(path, fileExtension):

    regexPattern = buildRegex(fileExtension)

    for path in glob.glob(path, recursive=True):

        with open(path) as file:
            filetext = file.read()
            matches = re.findall(regexPattern, str(filetext))

            if len(matches) > 0:
                printPositive(path)
                if len(matches) > 1:
                    print("To many copyright notice header found. Remove obsolete ones from file.")
            else:
                printNegative(path)
                addToNegativeList(path)

if __name__ == "__main__":

    if len(sys.argv) == 1:
        print(
            '!!! \U0001F40D ERROR: Please provide a root-path and a file-extension to scan and search for matching copyright \U0001F40D !!!')
    else:
        root = sys.argv[1]  # root path
        file_ext = sys.argv[2]  # file extension

        print("Start scan ... \n")
        scan(root + file_ext, file_ext)

        print("\n")
        print("----------------------------------------------------")
        print("----------------- SUMMARY --------------------------")
        print("----------------------------------------------------")
        if findings:
            print("Please check following files: \n")
            for finding in findings:
                print("\t", finding)
        else:
            print("\t >>> 404: No files found! <<<")
        print("----------------------------------------------------")
        print("----------------------------------------------------")
