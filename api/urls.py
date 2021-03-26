from django.urls import path
from .views import *
from rest_framework_jwt.views import obtain_jwt_token


urlpatterns = [
    path('get-customer', GetCustomer.as_view()),
    path('get-sim-only-tariffs', GetSimOnlyTariffs.as_view()),
    path('create-sim-only-order', CreateSimOnlyOrder.as_view()),
    path('add-spend-cap-to-sim-only-order', AddSpendCapToSimOnlyOrder.as_view()),
    path('keep-or-cancel-insurance', KeepOrCancelInsurance.as_view()),
    path('sim-only-order', SimOnlyOrderApi.as_view()),
    path('get-spend-caps', GetSpendCaps.as_view()),
    path('validate-postcode', ValidatePostcode.as_view()),
    path('validate-mob', ValidateMonthOfBirth.as_view()),
    path('send-one-time-pin', SendOneTimePin.as_view())
]