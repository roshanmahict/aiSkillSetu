from googletrans import Translator

def translate_to_hindi(text):
    if not text:
        return ''
    translator = Translator()
    try:
        result = translator.translate(text, src='en', dest='hi')
        return result.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # fallback to original