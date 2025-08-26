import sys, json
import pytesseract
from PIL import Image

file_path = sys.argv[1]

try:
    text = pytesseract.image_to_string(Image.open(file_path))
    result = {
        "name": "Demo Name", 
        "aadhaarNumber": "XXXX-XXXX-1234",
        "dob": "1998-01-01",
        "gender": "Male",
        "address": text[:200]  # crude demo
    }
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))
