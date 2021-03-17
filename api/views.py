from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.utils import timezone
from django.forms.models import model_to_dict
from datetime import datetime
from .extrafunctions import date_calculations
from .serializers import *
from .models import *
import time


class GetCustomer(APIView):

    permission_classes = (AllowAny,)
    serializer_class = MobileNumberSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Simulated a realistic response server time rather than being on local host
            time.sleep(0.5)

            mobile_number_object = MobileNumber.objects.get(number=serializer.data.get('number'))
            customer_object = Customer.objects.get(id=mobile_number_object.customer.id)

            def get_other_lines():
                """
                Get all the other lines the customer has and also adds the upgrade data and days remaining
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


            date_cal = date_calculations.DateTimeCalculations(mobile_number_object)

            mobile_account = MobileNumberSerializer(mobile_number_object).data
            customer = CustomerSerializer(customer_object).data

            mobile_account['upgrade_date'] = date_cal.calculate_upgrade_date()
            mobile_account['early_upgrade_fee'] = date_cal.calculate_early_upgrade_fee()
            mobile_account['is_eligible'] = date_cal.calculate_if_eligible()
            mobile_account['days_remaining'] = date_cal.calculate_days_remaining()
            mobile_account['insurance_option'] = mobile_number_object.insurance_option.insurance_name
            customer['total_lines'] = customer_object.mobilenumber_set.all().count()

            data = {'mobile_account': mobile_account, 'customer': customer, 'other_lines': get_other_lines()}

            return Response(data, status=status.HTTP_200_OK)
        return Response('Error', status=status.HTTP_400_BAD_REQUEST)


class GetSimoOnlyTariffs(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SimOnlyTariffsSerializer

    def get(self, request):
        # Simulated a realistic response server time rather than being on local host
        time.sleep(0.5)

        all_sim_only_tariffs = SimOnlyTariffs.objects.filter()

        data = all_sim_only_tariffs.values()

        return Response(data, status=status.HTTP_200_OK)


class CreateSimOnlyOrder(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SimOnlyTariffsSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            customer_object = Customer.objects.get(id=1)
            tariff_object = SimOnlyTariffs.objects.get(tariff_code=serializer.data.get('tariff_code'))

            existing_sim_only_order = SimOnlyOrder.objects.filter(customer=customer_object)
            if existing_sim_only_order.exists():
                existing_sim_order = SimOnlyOrder.objects.get(ctn='08888888888')
                existing_sim_order.contract_length = tariff_object.contract_length
                existing_sim_order.tariff = tariff_object
                existing_sim_order.save()
                return Response("Updated Existing Order", status=status.HTTP_200_OK)
            else:
                SimOnlyOrder.objects.create(ctn='08888888888',
                                            contract_length=tariff_object.contract_length,
                                            contract_type='Sim-Only',
                                            plan_type=tariff_object.plan_type,
                                            tariff=tariff_object,
                                            customer=customer_object
                                            )

                return Response('All Good', status=status.HTTP_200_OK)
        else:
            return Response('Error When Creating Sim-Only Order', status=status.HTTP_400_BAD_REQUEST)


class GetSimOnlyOrder(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SimOnlyOrderSerializer

    def get(self, request):
        customer_object = Customer.objects.get(id=1)

        sim_only_order_exists = SimOnlyOrder.objects.filter(customer=customer_object)
        if sim_only_order_exists.exists():
            sim_only_order_object = SimOnlyOrder.objects.get(ctn='08888888888')

            sim_order = SimOnlyOrderSerializer(sim_only_order_object).data
            tariff_object = SimOnlyTariffs.objects.get(id=sim_order['tariff'])

            sim_order['tariff_data'] = tariff_object.data_allowance
            sim_order['tariff_mrc'] = tariff_object.mrc

            return Response(sim_order, status=status.HTTP_200_OK)
        else:
            return Response("No Order", status=status.HTTP_204_NO_CONTENT)


class DeleteSimOnlyOrder(APIView):
    permission_classes = (AllowAny,)
    serializer_class = SimOnlyOrderSerializer

    def delete(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            sim_only_order_object = SimOnlyOrder.objects.get(ctn=serializer.data.get('ctn'))
            sim_only_order_object.delete()

            return Response('Deleted Item', status=status.HTTP_200_OK)
        else:
            return Response('Error Deleting Sim-Only Order', status=status.HTTP_304_NOT_MODIFIED)

