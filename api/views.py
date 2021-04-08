from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from django.forms.models import model_to_dict
from datetime import datetime
from .extrafunctions import date_calculations
from .extrafunctions.basket import GetBasketTotals
from .extrafunctions import twilio_functions
from .extrafunctions import recommendations
from .serializers import *
from .models import *
from datetime import datetime
import time
import csv


class GetEmployee(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        time.sleep(0.1)

        user = User.objects.get(id=request.user.id)
        data = EmployeeSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)


class GetCustomer(APIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = MobileNumberSerializer

    def post(self, request):
        """
        Returns a Customers full details based on a ctn on their account
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Simulated a realistic response server time rather than being on local host
            time.sleep(0.3)

            try:
                MobileNumber.objects.get(number=serializer.data.get('number'))
            except Exception:
                return Response('Not Found', status=status.HTTP_406_NOT_ACCEPTABLE)

            mobile_number_object = MobileNumber.objects.get(number=serializer.data.get('number'))
            customer_object = Customer.objects.get(id=mobile_number_object.customer.id)

            def get_other_lines():
                """
                Gets all the other lines the customer has and also adds the upgrade data and days remaining
                """
                other_lines = []
                for line in customer_object.mobilenumber_set.all().values():
                    other_lines.append(line)
                for count, line in enumerate(customer_object.mobilenumber_set.all()):
                    date_cal = date_calculations.DateTimeCalculations(line)
                    current_other_line_dic = other_lines[count]
                    current_other_line_dic['upgrade_date'] = date_cal.calculate_upgrade_date()
                    current_other_line_dic['days_remaining'] = date_cal.calculate_days_remaining()

                return other_lines

            # Recommendations
            recommended_sim_tariffs = recommendations.get_simo_recommendations(mobile_number_object)
            if recommended_sim_tariffs:
                recommended_sim_tariffs = recommended_sim_tariffs.values()
            else:
                recommended_sim_tariffs = None
            handset_tariffs_recommended, handsets = recommendations.get_handset_recommendations(mobile_number_object)

            handset_recommendations_list = []
            for count, tariff in enumerate(handset_tariffs_recommended):
                handset_recommended_dict = {}
                handset_recommended_dict['id'] = tariff.id
                handset_recommended_dict['handset'] = handsets[count].model
                handset_recommended_dict['data'] = tariff.data_allowance
                handset_recommended_dict['mrc'] = tariff.mrc
                handset_recommended_dict['upfront'] = recommendations.get_upfront(tariff.mrc, handsets[count].model, tariff.data_allowance)
                handset_recommendations_list.append(handset_recommended_dict)

            # Serializes Data
            date_cal = date_calculations.DateTimeCalculations(mobile_number_object)
            mobile_account = MobileNumberSerializer(mobile_number_object).data
            customer = CustomerSerializer(customer_object).data

            # Gets Open Order for the customer if there is any
            sim_only_open_orders = SimOnlyOrder.objects.filter(customer=customer_object)
            handset_open_orders = HandsetOrder.objects.filter(customer=customer_object)
            open_order_list = []
            for sim_order in sim_only_open_orders:
                open_order_list.append({'number': sim_order.ctn, 'type': sim_order.contract_type})
            for handset_order in handset_open_orders:
                open_order_list.append({'number': handset_order.ctn, 'type': handset_order.contract_type})

            # Makes amendments where necessary
            mobile_account['upgrade_date'] = date_cal.calculate_upgrade_date()
            mobile_account['early_upgrade_fee'] = date_cal.calculate_early_upgrade_fee()
            mobile_account['is_eligible'] = date_cal.calculate_if_eligible()
            mobile_account['days_remaining'] = date_cal.calculate_days_remaining()
            mobile_account['insurance_option'] = mobile_number_object.insurance_option.insurance_name
            customer['total_lines'] = customer_object.mobilenumber_set.all().count()
            customer['account_last_accessed_date_time'] = customer_object.account_last_accessed_date_time.date()
            customer['open_orders'] = open_order_list

            """
             The below puts date and time tracking information on the customer 
             and mobile accounts by a given employee
            """
            employee_accessing_account = serializer.data.get('account_last_accessed_by')
            customer_object.account_last_accessed_by = employee_accessing_account
            customer_object.account_last_accessed_date_time = datetime.now(tz=timezone.utc)
            mobile_number_object.account_last_accessed_by = employee_accessing_account
            mobile_number_object.account_last_accessed_date_time = datetime.now(tz=timezone.utc)
            mobile_number_object.save()
            customer_object.save()

            data = {'mobile_account': mobile_account, 'customer': customer, 'other_lines': get_other_lines(),
                    'sim_only_recommendations': recommended_sim_tariffs,
                    'handset_recommendations': handset_recommendations_list}

            return Response(data, status=status.HTTP_200_OK)

        return Response('Error', status=status.HTTP_400_BAD_REQUEST)


"""
Notes
"""
class GetCustomerNotes(APIView):
    permission_classes = (IsAuthenticated, )

    serializer_class = NotesSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            time.sleep(0.3)
            customer = serializer.data.get('id')

            customer_object = Customer.objects.get(id=customer)

            all_notes = Notes.objects.filter(customer=customer_object).order_by('-id')

            data = all_notes.values()

            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class AddNote(APIView):
    permission_classes = (IsAuthenticated, )

    serializer_class = NotesSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            note_content = serializer.data.get('note_content')
            customer_id = serializer.data.get('id')
            created_by_username = serializer.data.get('created_by')

            customer_object = Customer.objects.get(id=customer_id)

            note = Notes.objects.create(customer=customer_object, note_content=note_content,
                                        created_by=created_by_username)

            serialized_new_note = self.serializer_class(note).data

            return Response(serialized_new_note, status=status.HTTP_200_OK)

        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)

"""
Sim-Only Order
"""
class GetSimOnlyTariffs(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        # Simulated a realistic response server time rather than being on local host
        time.sleep(0.5)

        all_sim_only_tariffs = SimOnlyTariffs.objects.all()
        data = all_sim_only_tariffs.values()

        return Response(data, status=status.HTTP_200_OK)


class CreateSimOnlyOrder(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SimOnlyTariffsSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            tariff_object = SimOnlyTariffs.objects.get(tariff_code=serializer.data.get('tariff_code'))
            ctn = serializer.data.get('ctn')

            existing_sim_only_order = SimOnlyOrder.objects.filter(ctn=ctn)

            if existing_sim_only_order.exists():
                existing_sim_order = SimOnlyOrder.objects.get(ctn=ctn)
                existing_sim_order.contract_length = tariff_object.contract_length
                existing_sim_order.tariff = tariff_object
                existing_sim_order.save()
                return Response("Updated Existing Order", status=status.HTTP_200_OK)
            else:
                SimOnlyOrder.objects.create(ctn=ctn,
                                            contract_length=tariff_object.contract_length,
                                            contract_type='Sim-Only',
                                            plan_type=tariff_object.plan_type,
                                            tariff=tariff_object,
                                            customer=MobileNumber.objects.get(number=ctn).customer
                                            )

                return Response('All Good', status=status.HTTP_200_OK)
        else:
            return Response('Error When Creating Sim-Only Order', status=status.HTTP_400_BAD_REQUEST)


class SimOnlyOrderApi(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SimOnlyOrderSerializer

    def post(self, request):
        """
        Returns a Sim-Only order based on the ctn posted
        """
        # Simulated a realistic response server time rather than being on local host
        time.sleep(0.25)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            ctn = serializer.data.get('ctn')

            sim_only_order_exists = SimOnlyOrder.objects.filter(ctn=ctn)
            if sim_only_order_exists.exists():
                sim_only_order_object = SimOnlyOrder.objects.get(ctn=ctn)

                sim_order = SimOnlyOrderSerializer(sim_only_order_object).data
                tariff_object = SimOnlyTariffs.objects.get(id=sim_order['tariff'])

                if sim_order['cap']:
                    spend_cap_object = SpendCaps.objects.get(id=sim_order['cap'])
                    sim_order['cap_name'] = spend_cap_object.cap_name
                if sim_order['existing_insurance']:
                    test = {'insurance_name': sim_only_order_object.existing_insurance.insurance_name,
                            'insurance_mrc': sim_only_order_object.existing_insurance.mrc}
                    sim_order['existing_insurance'] = test

                get_basket_totals = GetBasketTotals(sim_only_order_object)
                basket_totals = {'upfront': get_basket_totals.get_total_upfront(),
                                 'mrc': get_basket_totals.get_total_mrc()}

                sim_order['tariff_data'] = tariff_object.data_allowance
                sim_order['tariff_mrc'] = tariff_object.mrc

                data = {'sim_order_items': sim_order, 'basket_totals': basket_totals}

                return Response(data, status=status.HTTP_200_OK)

            else:
                return Response("No Order", status=status.HTTP_200_OK)
        return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            sim_only_order_object = SimOnlyOrder.objects.get(ctn=serializer.data.get('ctn'))
            sim_only_order_object.delete()

            return Response('Deleted Item', status=status.HTTP_200_OK)
        else:
            return Response('Error Deleting Sim-Only Order', status=status.HTTP_304_NOT_MODIFIED)


class KeepOrCancelInsurance(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = InsuranceSerializer(data=request.data)

        if serializer.is_valid():
            sim_order = SimOnlyOrder.objects.get(ctn=serializer.data.get('ctn'))

            if serializer.data.get('keep_or_cancel_insurance') == 'keep':
                mobile_object = MobileNumber.objects.get(number=serializer.data.get('ctn'))
                existing_insurance = mobile_object.insurance_option
                sim_order.existing_insurance = existing_insurance
                sim_order.save()

                return Response("Continued Existing Insurance", status=status.HTTP_200_OK)
            else:
                no_insurance_object = Insurance.objects.get(id=5)
                sim_order.existing_insurance = no_insurance_object
                sim_order.save()
                return Response("Cancelled Existing Insurance", status=status.HTTP_200_OK)
        else:
            return Response('Error with insurance options', status=status.HTTP_400_BAD_REQUEST)


class AddSpendCapToSimOnlyOrder(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SpendCapSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            spend_cap_object = SpendCaps.objects.get(id=serializer.data.get('id'))

            sim_order = SimOnlyOrder.objects.get(ctn=serializer.data.get('ctn'))

            sim_order.cap = spend_cap_object
            sim_order.save()

            return Response("Added Spend Cap to Order", status=status.HTTP_200_OK)
        else:
            return Response("Error When adding Spend Cap", status=status.HTTP_400_BAD_REQUEST)


"""
Handset Order
"""
class GetHandsets(APIView):
    permission_classes = (AllowAny,)

    all_handsets = Handsets.objects.all()
    serializer_class = HandsetsSerializer

    def return_non_repeating_handsets(self, queryset):
        check_repeating_models_list = []
        new_handset_list = []
        for handset in queryset:
            if handset.model not in check_repeating_models_list:
                check_repeating_models_list.append(handset.model)
                new_handset_list.append(self.serializer_class(handset).data)

        for handset in new_handset_list:
            all_colours_available = []
            filter = Handsets.objects.filter(model=handset['model'])
            for handset_model in filter:
                dic = {}
                dic[handset_model.colour] = {"id": handset_model.id, 'stock': 3}
                all_colours_available.append(dic)
            handset['colours'] = all_colours_available

        return new_handset_list

    def get(self, request):
        time.sleep(0.5)

        data = self.return_non_repeating_handsets(Handsets.objects.all())

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Returns a queryset of handsets based on a search term of a model
        """
        handsets = self.all_handsets.filter(model__icontains=request.data['model'])
        data = self.return_non_repeating_handsets(handsets)

        return Response(data, status=status.HTTP_200_OK)


class GetHandsetTariffs(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = HandsetTariffsSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            handset_order_object = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))
            handset_object = Handsets.objects.get(id=handset_order_object.handset.id)

            tariffs_available = handset_object.tariffs_available.values()

            def get_handset_tariff_upfront(tariff_count, handset, mrc, data_csv):
                mrc_correct_format = (str(mrc)[:-2])

                location = f'/Users/harry/Desktop/Git Projects/Excalibur Pro/crm/handset_tariff_and_upfront_prices/{data_csv}.csv'

                reader = csv.DictReader(open(location))

                for tariffs in reader:
                    if tariffs['Handset'] == handset.upper():
                        tariffs_available[tariff_count]['upfront'] = tariffs[mrc_correct_format]
                        return tariffs[mrc_correct_format]

            for count, tariff in enumerate(tariffs_available):
                if tariff['data_allowance'] == '4':
                    get_handset_tariff_upfront(count, handset_object.model, tariff['mrc'], '4gb_tariffs')
                if tariff['data_allowance'] == '10':
                    get_handset_tariff_upfront(count, handset_object.model, tariff['mrc'], '10gb_tariffs')
                if tariff['data_allowance'] == '100':
                    get_handset_tariff_upfront(count, handset_object.model, tariff['mrc'], '100gb_tariffs')
                if tariff['data_allowance'] == '1000':
                    get_handset_tariff_upfront(count, handset_object.model, tariff['mrc'], 'ultd_tariffs')

            data = tariffs_available

            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class CreateHandsetOrder(APIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = HandsetOrderSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            handset_object = Handsets.objects.get(id=serializer.data.get('handset'))
            ctn = serializer.data.get('ctn')

            existing_handset_order = HandsetOrder.objects.filter(ctn=ctn)
            if existing_handset_order.exists():
                existing_order = HandsetOrder.objects.get(ctn=ctn)
                existing_order.handset = handset_object
                existing_order.save()
                return Response('Update Existing Handset Order', status=status.HTTP_200_OK)
            else:
                calculate_upgrade_fee = date_calculations.DateTimeCalculations(MobileNumber.objects.get(number=ctn))

                HandsetOrder.objects.create(ctn=ctn,
                                            customer=MobileNumber.objects.get(number=ctn).customer,
                                            contract_type='Handset',
                                            early_upgrade_fee=calculate_upgrade_fee.calculate_early_upgrade_fee(),
                                            handset=handset_object)
                return Response('Created Handset Order', status=status.HTTP_200_OK)
        else:
            return Response('Error When Creating Handset Order', status=status.HTTP_400_BAD_REQUEST)


class AddHandsetCreditToOrder(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = GenericSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            handset_order_object = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))

            handset_credit_selected = serializer.data.get('string')

            if float(handset_credit_selected) > handset_order_object.upfront:
                handset_order_object.handset_credit = handset_order_object.upfront
            else:
                handset_order_object.handset_credit = handset_credit_selected
            handset_order_object.save()

            return Response('Added credit to order', status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class AddHandsetTariffToOrder(APIView):
    permission_classes = (IsAuthenticated, )

    serializer_class = HandsetTariffsSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            handset_order = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))
            tariff_object = HandsetTariffs.objects.get(mrc=serializer.data.get('mrc'),
                                                       data_allowance=serializer.data.get('data_allowance'))

            handset_order.handset_tariff = tariff_object
            handset_order.contract_type = 'Handset'
            handset_order.plan_type = tariff_object.plan_type
            handset_order.contract_length = tariff_object.contract_length
            handset_order.upfront = serializer.data.get('upfront')
            handset_order.save()

            return Response('Added Tariff To Order', status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class AddSpendCapToHandsetOrder(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SpendCapSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            spend_cap_object = SpendCaps.objects.get(id=serializer.data.get('id'))

            handset_order = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))

            handset_order.cap = spend_cap_object
            handset_order.save()

            return Response("Added Spend Cap to Order", status=status.HTTP_200_OK)
        else:
            return Response("Error When adding Spend Cap", status=status.HTTP_400_BAD_REQUEST)


class GetHandsetInsurance(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Retrieves the insurance available for a given handset
        """

        serializer = GenericSerializer(data=request.data)

        if serializer.is_valid():
            handset_order_object = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))
            handset_insurance_options = handset_order_object.handset.insurance_available.values()

            return Response(handset_insurance_options, status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class AddInsuranceToHandsetOrder(APIView):

    permission_classes = (IsAuthenticated,)

    serializer_class = HandsetInsuranceSerializer

    def post(self, request):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            handset_order_object = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))
            insurance_object = Insurance.objects.get(id=serializer.data.get('id'))

            handset_order_object.insurance = insurance_object
            handset_order_object.save()

            return Response('Added Insurance', status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class HandsetOrderAPI(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = HandsetOrderSerializer

    def post(self, request):
        """
        Returns a Handset order based on the ctn posted
        """
        # Simulated a realistic response server time rather than being on local host
        time.sleep(0.25)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            ctn = serializer.data.get('ctn')

            handset_order_exists = HandsetOrder.objects.filter(ctn=ctn)
            if handset_order_exists.exists():
                handset_order_object = HandsetOrder.objects.get(ctn=ctn)
                handset_order = self.serializer_class(handset_order_object).data

                handset_order['handset'] = Handsets.objects.get(id=handset_order['handset']).model +\
                                           " " + Handsets.objects.get(id=handset_order['handset']).colour

                if handset_order['handset_tariff']:
                    tariff_object = HandsetTariffs.objects.get(id=handset_order['handset_tariff'])
                    handset_order['tariff_data'] = tariff_object.data_allowance
                    handset_order['tariff_mrc'] = tariff_object.mrc

                if handset_order['cap']:
                    spend_cap_object = SpendCaps.objects.get(id=handset_order['cap'])
                    handset_order['cap_name'] = spend_cap_object.cap_name
                if handset_order['insurance']:
                    insurance_object = Insurance.objects.get(id=handset_order['insurance'])
                    handset_order['insurance'] = insurance_object.insurance_name
                    handset_order['insurance_mrc'] = insurance_object.mrc

                get_basket_totals = GetBasketTotals(handset_order_object)
                basket_totals = {'upfront': get_basket_totals.get_total_upfront(),
                                 'mrc': get_basket_totals.get_total_mrc()}


                data = {'handset_order_items': handset_order, 'basket_totals': basket_totals}

                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response('No Order', status=status.HTTP_200_OK)

        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            handset_order_object = HandsetOrder.objects.get(ctn=serializer.data.get('ctn'))
            handset_order_object.delete()

            return Response('Deleted Handset Order', status=status.HTTP_200_OK)
        else:
            return Response('Error Deleting Sim-Only Order', status=status.HTTP_304_NOT_MODIFIED)


"""
Misc
"""
class GetSpendCaps(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        time.sleep(0.5)

        spend_caps = SpendCaps.objects.all()
        data = spend_caps.values()

        return Response(data, status=status.HTTP_200_OK)


class CheckCTNExists(APIView):

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = MobileNumberSerializer(data=request.data)

        if serializer.is_valid():

            ctn = serializer.data.get('number')

            try:
                MobileNumber.objects.get(number=ctn)

                return Response("CTN Exists", status=status.HTTP_200_OK)
            except Exception as e:
                print(e)

                return Response('CTN Does Not Exist', status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)



"""
Order Validations
"""
class ValidatePostcode(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = GenericSerializer(data=request.data)

        if serializer.is_valid():
            inputted_postcode = serializer.data.get('string')
            mobile_account = MobileNumber.objects.get(number=serializer.data.get('ctn'))

            if mobile_account.customer.postcode[-3:] == inputted_postcode.upper():
                return Response('Postcode Validated', status=status.HTTP_200_OK)
            else:
                return Response('Incorrect Postcode', status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response('Error', status=status.HTTP_400_BAD_REQUEST)


class ValidateMonthOfBirth(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = GenericSerializer(data=request.data)

        if serializer.is_valid():
            month_of_birth_inputted = serializer.data.get('string')
            mobile_account = MobileNumber.objects.get(number=serializer.data.get('ctn'))

            if month_of_birth_inputted == str(mobile_account.customer.dob.month):
                return Response('MOB Validated', status=status.HTTP_200_OK)
            else:
                return Response('Incorrect MOB', status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response('Error', status=status.HTTP_400_BAD_REQUEST)


class SendOneTimePin(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):

        serializer = MobileNumberSerializer(data=request.data)

        if serializer.is_valid():
            ctn_to_send_to = serializer.data.get('number')
            print('sending to', ctn_to_send_to)

            pin = twilio_functions.send_otp()
            print(pin)

            return Response({'pin': pin}, status=status.HTTP_200_OK)
        else:
            return Response('Error When Sending OTP', status=status.HTTP_400_BAD_REQUEST)


class SubmitSimOnlyOrder(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = MobileNumberSerializer(data=request.data)

        if serializer.is_valid():
            """
            Currently, this will just delete the order that has been made rather than actually 
            submitting it and changing the details in the database
            """
            time.sleep(5)
            order_object = SimOnlyOrder.objects.get(ctn=serializer.data.get('number'))
            order_object.delete()

            return Response('Order Submitted', status=status.HTTP_200_OK)
        else:
            return Response('Bad Request', status=status.HTTP_400_BAD_REQUEST)
