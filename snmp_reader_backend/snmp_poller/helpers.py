import re

def cut_word(word):
    match = re.search("b'(.*)'", word)
    if match:
        return match.group(1)
    else:
        return word  # or handle the error appropriately