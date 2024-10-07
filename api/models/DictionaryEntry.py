class DictionaryEntry:
    def __init__(self, date: str, hwi: dict, shortdef: list, fl: str):
        self.date = date
        self.hwi = hwi
        self.shortdef = shortdef
        self.fl = fl  # Part of speech

    def to_dict(self):
        return {
            "date": self.date,
            "hwi": {
                "hw": self.hwi.get("hw"),
                "prs": [{"mw": p.get("mw")} for p in self.hwi.get("prs", []) if "mw" in p]
            },
            "shortdef": self.shortdef,
            "fl": self.fl  # Add part of speech to the dictionary representation
        }