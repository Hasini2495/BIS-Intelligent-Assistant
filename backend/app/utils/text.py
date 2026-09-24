import re
from typing import List

def extract_keywords(text: str) -> List[str]:
    # Very basic keyword extraction
    words = re.findall(r'\b\w+\b', text.lower())
    stop_words = {'the', 'a', 'an', 'is', 'are', 'and', 'or', 'to', 'for', 'in', 'of', 'on', 'with', 'what', 'how'}
    return [w for w in words if w not in stop_words and len(w) > 2]
