from datetime import datetime, timedelta


class DateTimeCalculations:

    def __init__(self, ctn):
        self.ctn = ctn
        self.today = datetime.today().date()

    def calculate_days_remaining(self):

        contract_end_date = self.ctn.contract_end
        days_remaining = (contract_end_date - self.today).days

        return int(days_remaining)

    def calculate_upgrade_date(self):

        contract_end_date = self.ctn.contract_end
        days = timedelta(45)
        upgrade_date = contract_end_date - days

        return upgrade_date

    def calculate_end_date(self, contract_length):

        if contract_length == '24':
            return self.today + timedelta(days=730)

        elif contract_length == '18':
            return self.today + timedelta(days=547)

        elif contract_length == '12':
            return self.today + timedelta(days=365)

        elif contract_length == '1':
            return self.today + timedelta(days=30)

    def calculate_if_eligible(self):

        upgrade_date = self.calculate_upgrade_date()

        if self.today >= upgrade_date:
            return True
        else:
            return False

    def calculate_early_upgrade_fee(self):

        if self.calculate_if_eligible() is True:
            return 0

        else:

            tariff_mrc = self.ctn.mrc
            contract_end_date = self.ctn.contract_end

            num_months = (contract_end_date.year - self.today.year) * 12 + (contract_end_date.month - self.today.month)

            return num_months * tariff_mrc