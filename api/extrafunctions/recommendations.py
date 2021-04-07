from api.models import Handsets, SimOnlyTariffs, HandsetTariffs
import random
import csv
from .date_calculations import DateTimeCalculations


def get_upfront(mrc, model, data_allowance):

    """ This tag get all the upfront costs for the relevant tariffs for a specific handset """

    mrc_correct_format = (str(mrc)[:-2])

    def get_handset_upfront(handset, mrc, data_csv):

        location = f'/Users/harry/Desktop/Git Projects/Excalibur Pro/crm/handset_tariff_and_upfront_prices/{data_csv}.csv'

        reader = csv.DictReader(open(location))

        for tariffs in reader:
            if tariffs['Handset'] == handset.upper():
                return tariffs[mrc]

    if data_allowance == '1000':
        return get_handset_upfront(model, mrc_correct_format, 'ultd_tariffs')

    elif data_allowance == '100':
        return get_handset_upfront(model, mrc_correct_format, '100gb_tariffs')

    elif data_allowance == '10':
        return get_handset_upfront(model, mrc_correct_format, '10gb_tariffs')

    elif data_allowance == '4':
        return get_handset_upfront(model, mrc_correct_format, '4gb_tariffs')


def get_handset_recommendations(mobile_account_object):

    """ This will return 2 lists of handsets/tariffs that are recommended depending on the how much
        data the mobile number uses, and their current handset manufacture """

    handset_tariffs_recommended = []
    handsets_recommended = []

    def get_recommendations(manufacture):

        def return_recommendation_tariff(handset, data_needed):

            # Gets first as might return multiple depending on colour
            handset_object = Handsets.objects.filter(model=handset)[0]

            all_recommended_data_tariffs = []
            for tariffs in handset_object.tariffs_available.all():
                if float(tariffs.data_allowance) == data_needed:
                    all_recommended_data_tariffs.append(tariffs.mrc)
            if all_recommended_data_tariffs:

                # Make the recommended handsets look more dynamic
                all_recommended_data_tariffs.sort(reverse=True)

                recommended_handset_tariff_object = HandsetTariffs.objects.get(data_allowance=data_needed,
                                                                           mrc=all_recommended_data_tariffs[0])

                # Adds both the tariff object and handset to the two lists that is to be return in the parent function
                handset_tariffs_recommended.append(recommended_handset_tariff_object)
                handsets_recommended.append(handset_object)
            else:
                # If there is an error finding tariffs
                return None

        handset_recommendations = []

        for device in Handsets.objects.filter(manufacture=manufacture):

            """ Gets all the devices in the database based on current 
                manufacture and adds it to a list if it is not already there """

            if device.model not in handset_recommendations:
                handset_recommendations.append(device.model)

        # Shuffles the list and only keeps 4 device by random
        random.shuffle(handset_recommendations)
        handset_recommendations = handset_recommendations[:4]

        for device in handset_recommendations:

            """ Gets the recommended tariffs based on the users data and on the devices in 'handset_recommendations """

            if mobile_account_object.data_usage_3m > 100:
                return_recommendation_tariff(device, 1000)
            elif mobile_account_object.data_usage_3m >= 10:
                return_recommendation_tariff(device, 100)
            elif mobile_account_object.data_usage_3m < 10:
                return_recommendation_tariff(device, 10)

    if 'Apple' in mobile_account_object.device_manufacture or 'iPhone' in mobile_account_object.device_manufacture:
        get_recommendations('Apple')
    elif 'Samsung' in mobile_account_object.mobile_number.device_manufacturee:
        get_recommendations('Samsung')

    return handset_tariffs_recommended, handsets_recommended


def get_simo_recommendations(mobile_account_object):

    """ This will return recommended sim-only tariffs depending on the how much data the mobile number uses """

    simo_tariffs = SimOnlyTariffs.objects.filter()
    date_cal = DateTimeCalculations(mobile_account_object)

    # Only shows/calls the simo recommended functions if the ctn is due to upgrade
    if date_cal.calculate_if_eligible():
        def get_sim_tariff_recommendations(data_option):

            recommended_data_options = []

            for tariff in simo_tariffs:
                if data_option == 10:
                    if float(tariff.data_allowance) < data_option:
                        recommended_data_options.append(tariff.data_allowance)
                else:
                    if float(tariff.data_allowance) >= data_option:
                        recommended_data_options.append(tariff.data_allowance)

            recommended_data_options.sort(reverse=True)

            recommended_tariffs = SimOnlyTariffs.objects.filter(data_allowance__in=recommended_data_options)

            return recommended_tariffs[:4]

        if mobile_account_object.data_usage_3m > 60:
            return get_sim_tariff_recommendations(60)
        elif mobile_account_object.data_usage_3m >= 40:
            return get_sim_tariff_recommendations(50)
        elif mobile_account_object.data_usage_3m > 10:
            return get_sim_tariff_recommendations(10)
        else:
            return get_sim_tariff_recommendations(10)