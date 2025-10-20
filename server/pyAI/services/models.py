# services/models.py
import spacy
from sentence_transformers import SentenceTransformer

# Load models once and export them for other modules to use
print("Loading AI models...")
nlp = spacy.load("en_core_web_sm")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
print("AI models loaded successfully.")