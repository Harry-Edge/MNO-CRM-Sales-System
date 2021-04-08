from django.urls import path
from .views import *

urlpatterns = [

    # Customer/Employee
    path('get-employee', GetEmployee.as_view()),
    path('get-customer', GetCustomer.as_view()),
    path('get-customer-notes', GetCustomerNotes.as_view()),
    path('add-note', AddNote.as_view()),

    # Get Products
    path('get-handsets', GetHandsets.as_view()),
    path('get-handset-tariffs', GetHandsetTariffs.as_view()),
    path('get-spend-caps', GetSpendCaps.as_view()),
    path('get-sim-only-tariffs', GetSimOnlyTariffs.as_view()),

    # Sim-Only Order
    path('create-sim-only-order', CreateSimOnlyOrder.as_view()),
    path('add-spend-cap-to-sim-only-order', AddSpendCapToSimOnlyOrder.as_view()),
    path('keep-or-cancel-insurance', KeepOrCancelInsurance.as_view()),
    path('sim-only-order', SimOnlyOrderApi.as_view()),

    # HandsetOrder
    path('create-handset-order', CreateHandsetOrder.as_view()),
    path('handset-order', HandsetOrderAPI.as_view()),
    path('add-handset-tariff-to-order', AddHandsetTariffToOrder.as_view()),
    path('add-handset-credit-to-order', AddHandsetCreditToOrder.as_view()),
    path('add-spend-cap-to-handset-order', AddSpendCapToHandsetOrder.as_view()),
    path('get-handset-insurance', GetHandsetInsurance.as_view()),
    path('add-insurance-to-handset-order', AddInsuranceToHandsetOrder.as_view()),

    # Validations
    path('check-ctn-exists', CheckCTNExists.as_view()),
    path('validate-postcode', ValidatePostcode.as_view()),
    path('validate-mob', ValidateMonthOfBirth.as_view()),
    path('send-one-time-pin', SendOneTimePin.as_view()),

    # Submit Order
    path('submit-sim-only-order', SubmitSimOnlyOrder.as_view())
]