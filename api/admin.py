from django.contrib import admin
from .models import *


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'first_line_address', 'postcode')


@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'note_content', 'date_created')


@admin.register((Handsets))
class HandsetAdmin(admin.ModelAdmin):
    list_display = ('id', 'manufacture', 'model', 'storage', 'colour', 'speed_type')


@admin.register(MobileNumber)
class MobileNumberAdmin(admin.ModelAdmin):
    list_display = ('number', 'customer', 'user', 'mrc', 'data_allowance', 'contract_start', 'contract_end')


@admin.register(HandsetTariffs)
class HandsetTariffs(admin.ModelAdmin):
    list_display = ('id', 'plan_type', 'mrc', 'data_allowance', 'contract_length')


@admin.register(Insurance)
class InsuranceAdmin(admin.ModelAdmin):
    list_display = ('id', 'insurance_name', 'mrc', 'excess_fee')


@admin.register(SpendCaps)
class SpendCapAdmin(admin.ModelAdmin):
    list_display = ('id', 'cap_name', 'cap_amount', 'cap_code')


@admin.register(SimOnlyTariffs)
class SimOnlyTariffsAdmin(admin.ModelAdmin):
    list_display = ('id', 'plan_type', 'data_allowance', 'mrc', 'contract_length')


@admin.register(SimOnlyOrder)
class SimoOnlyOrder(admin.ModelAdmin):
    list_display = ('id', 'customer', 'ctn', 'plan_type', 'contract_length', 'tariff', 'cap', 'order_created_by')

