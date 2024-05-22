from .models import Apple
from typing import Iterable, List, Dict, Any


def serialize_apples(apples: Iterable[Apple]) -> List[Dict[str, Any]]:
    data = []
    for apple in apples:
        data.append({
            'name': apple.name,
            'color': apple.color,
            'photo_url': apple.photo_url,
        })
    return data
