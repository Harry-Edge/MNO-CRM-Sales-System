from django.utils.crypto import get_random_string

def send_otp():
    pin = get_random_string(length=6, allowed_chars='1234567890')

    return pin
