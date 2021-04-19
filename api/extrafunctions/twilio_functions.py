from django.utils.crypto import get_random_string
from twilio.rest import Client
from django.utils.crypto import get_random_string
from .secret_keys import account_sid_key, auth_token_key, from_number

account_sid = account_sid_key
auth_token = auth_token_key
client = Client(account_sid, auth_token)


def send_otp():
    pin = get_random_string(length=6, allowed_chars='1234567890')

    return pin


def send_one_time_pin(to_number):
    pin = get_random_string(length=6, allowed_chars='1234567890')

    message = "\nPIN:" + str(pin) + " Please provide this pin to the advisor you are speaking to"

    client.messages.create(
        from_=from_number,
        body=message,
        to=to_number
    )

    return pin


def send_sim_only_order_information(cus_order, to_number):
    insurance = ""
    try:
        if cus_order.existing_insurance.insurance_name is not None:
            insurance = cus_order.existing_insurance.insurance_name
    except AttributeError:
        insurance = "No insurance"

    message = f"Hi {cus_order.cus.first_name}, here are you contract details for the number {cus_order.ctn}," \
              f" £{cus_order.tariff.mrc}pm, {cus_order.tariff.data_allowance}GB {cus_order.tariff.plan_type}," \
              f" {insurance} . Please confirm all details are correct and agree with advisor to continue with the " \
              f"order. "

    client.messages.create(
        from_=from_number,
        body=message,
        to=to_number
    )


def send_handset_order_information(cus_order, to_number):

    if cus_order.handset_tariff.data_allowance == "1000":
        cus_order.handset_tariff.data_allowance = "ULTD "

    message = f"Hi {cus_order.cus.first_name}, here are you contract details for the number {cus_order.ctn} for an" \
              f" {cus_order.handset.model}. £{cus_order.handset_tariff.mrc}pm," \
              f" {cus_order.handset_tariff.data_allowance}GB {cus_order.handset_tariff.plan_type}, " \
              f"{cus_order.insurance.insurance_name}, £{cus_order.upfront} Upfront, £{cus_order.early_upgrade_fee} " \
              f"Early Upgrade Fee. Please confirm all details are correct and agree with advisor to continue" \
              f" with the order. "

    client.messages.create(
        from_=from_number,
        body=message,
        to=to_number
    )
