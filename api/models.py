from django.db import models

SPEND_CAPS = [('None', 'None'), ('0', '0'), ('5', '5'), ('10', '10'), ('20', '20'), ('30', '30'), ('40', '40'),
              ('50', '50')]


class Customer(models.Model):

    ADD_LINE_OPTIONS = [('0', '0'), ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')]

    first_name = models.CharField(max_length=200, null=True)
    last_name = models.CharField(max_length=200, null=True)
    dob = models.DateField(null=True)
    email = models.EmailField(null=True)
    postcode = models.CharField(max_length=7, null=True)
    first_line_address = models.CharField(max_length=200, null=True)
    credit_class = models.IntegerField(null=True)
    add_lines_available = models.CharField(max_length=2, null=True, choices=ADD_LINE_OPTIONS)

    def __str__(self):

        return f"{self.last_name} {self.first_name}"


class Insurance(models.Model):

    INSURANCE_NAME = [('Full Cover £14', 'Full Cover £14'), ('Damage Cover £10', 'Damage Cover £10'),
                      ('Full Cover £12', 'Full Cover £12'), ('Damage Cover £8', 'Damage Cover £8'),
                      ('No Insurance', 'No Insurance')]

    EXCESS_FEES = [('120', '120'), ('100', '100')]

    insurance_name = models.CharField(max_length=200, null=True, choices=INSURANCE_NAME)
    mrc = models.FloatField(null=True)
    excess_fee = models.CharField(max_length=200, null=True, choices=EXCESS_FEES, blank=True)
    #ins_code = models.CharField(max_length=100, null=True)

    def __str__(self):

        return self.insurance_name

    class Meta:
        verbose_name_plural = "Insurance"


class SpendCaps(models.Model):

    cap_amount = models.CharField(max_length=100, null=True, choices=SPEND_CAPS)
    cap_name = models.CharField(max_length=200, null=True)
    mrc = models.IntegerField(null=True)
    upfront = models.IntegerField(null=True)
    cap_code = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.cap_name

    class Meta:
        verbose_name_plural = "Spend Caps"


class MobileNumber(models.Model):

    HANDSET_MANUFACTURES = [('Apple', 'Apple'), ('Samsung', 'Samsung')]

    CONTRACT_LENGTH = [('1', '1'), ('12', '12'), ('18', '18'), ('24', '24')]

    CONTRACT_TYPE = [('Handset', 'Handset'), ('Sim-Only', 'Sim-Only')]

    customer = models.ForeignKey(Customer, null=True, on_delete=models.CASCADE)
    user = models.CharField(max_length=11, null=True)

    """PRODUCTS"""
    number = models.CharField(max_length=11, null=True)
    contract_type = models.CharField(choices=CONTRACT_TYPE, null=True, max_length=10)
    plan = models.CharField(max_length=100, null=True)
    mrc = models.FloatField(null=True)
    device_manufacture = models.CharField(max_length=100, null=True, choices=HANDSET_MANUFACTURES)
    device_model = models.CharField(max_length=100, null=True)
    insurance = models.BooleanField(default=False, null=True)
    insurance_option = models.ForeignKey(Insurance, on_delete=models.SET_NULL, null=True)
    #average_bill = models.FloatField(max_length=6, null=True, blank=True)
    data_allowance = models.FloatField(max_length=6, null=True)

    """USAGE"""
    spend_cap = models.CharField(max_length=100, null=True, choices=SPEND_CAPS)
    #data_usage_3m = models.FloatField(max_length=10, null=True)
    #texts_sent_3m = models.IntegerField(null=True)
    #call_mins = models.IntegerField(null=True)
    #mms_sent = models.IntegerField(null=True)

    """Eligibility"""
    contract_start = models.DateField(null=True)
    contract_end = models.DateField(null=True)
    contract_length_months = models.CharField(max_length=10, null=True, choices=CONTRACT_LENGTH)

    """DISCOUNT/S"""
    friends_and_family = models.BooleanField(null=True)

    def __str__(self):
        return f"{self.number} {self.customer}"


class SimOnlyTariffs(models.Model):

    CONTRACT_LENGTH = [('1', '1'), ('12', '12'), ('18', '18'), ('24', '24')]

    DATA_ALLOWANCE = [('0.25', '0.25'), ('1', '1'), ('3', '3'), ('20', '20'), ('60', '60'), ('100', '100'),
                      ('200', '200'), ('1000', '1000')]

    PLAN_TYPE = [('Standard', 'Standard')]

    contract_length = models.CharField(max_length=10, null=True, choices=CONTRACT_LENGTH)
    mrc = models.FloatField(null=True)
    upfront = models.FloatField(null=True)
    data_allowance = models.CharField(max_length=10, null=True, choices=DATA_ALLOWANCE)
    plan_type = models.CharField(max_length=10, null=True, choices=PLAN_TYPE)
    tariff_code = models.CharField(max_length=10, null=True)

    class Meta:
        verbose_name_plural = "Sim Only Tariffs"

    def __str__(self):

        return f"{self.plan_type}{self.data_allowance}{self.contract_length}"


class SimOnlyOrder(models.Model):

    CONTRACT_LENGTH = [('1', '1'), ('12', '12'), ('18', '18'), ('24', '24')]

    PLAN_TYPE = [('Standard', 'Standard')]

    CONTRACT_TYPE = [('Sim-Only', 'Sim-Only')]

    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    ctn = models.CharField(null=True, max_length=11)
    #is_ordered = models.BooleanField(default=False)

    contract_length = models.CharField(null=True, choices=CONTRACT_LENGTH, max_length=2)
    plan_type = models.CharField(null=True, max_length=30, choices=PLAN_TYPE)
    contract_type = models.CharField(null=True, max_length=20, choices=CONTRACT_TYPE)
    tariff = models.OneToOneField(SimOnlyTariffs, on_delete=models.SET_NULL, null=True)
    cap = models.OneToOneField(SpendCaps, on_delete=models.SET_NULL, null=True)
    #existing_insurance = models.OneToOneField(Insurance, on_delete=models.SET_NULL, null=True)
    #friends_and_family = models.BooleanField(default=False, null=True)

    # Customer Validations on Order
    #postcode_validated = models.BooleanField(null=True)
    #mob_validated = models.BooleanField(null=True)
    #otp = models.IntegerField(null=True)
    #otp_validated = models.BooleanField(null=True)

    #date_ordered = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Sim Only Orders"

    def __str__(self):
        return f"{self.customer} {self.tariff}"

