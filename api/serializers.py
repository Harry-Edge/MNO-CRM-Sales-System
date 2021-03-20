from rest_framework import serializers
from .models import *


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'first_name', 'last_name', 'postcode', 'first_line_address', 'credit_class',
                  'add_lines_available')


class InsuranceSerializer(serializers.ModelSerializer):

    keep_or_cancel_insurance = serializers.CharField()

    class Meta:
        model = Insurance
        fields = ('insurance_name', 'keep_or_cancel_insurance')


class SpendCapSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpendCaps
        fields = ('id', 'cap_name', 'cap_amount', 'mrc', 'upfront')
        extra_kwargs = {'id': {'read_only': False}}


class MobileNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = MobileNumber
        fields = ('number', 'customer', 'user', 'plan', 'mrc', 'device_manufacture', 'device_model', 'insurance',
                  'insurance_option', 'data_allowance', 'spend_cap', 'contract_start', 'contract_end',
                  'contract_length_months', 'friends_and_family')


class SimOnlyTariffsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimOnlyTariffs
        fields = ('tariff_code', 'contract_length', 'mrc', 'upfront', 'data_allowance', 'plan_type',)


class SimOnlyOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimOnlyOrder
        fields = ('id', 'customer', 'ctn', 'plan_type', 'contract_type', 'contract_length', 'tariff', 'cap',
                  'existing_insurance')
