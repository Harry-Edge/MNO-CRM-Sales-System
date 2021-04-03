class GetBasketTotals:

    def __init__(self, customer_order):
        self.customer_order = customer_order

    def get_total_mrc(self):

        if self.customer_order.contract_type == 'Sim-Only':
            tariff_mrc = self.customer_order.tariff.mrc

            if self.customer_order.friends_and_family is True:
                try:
                    insurance_mrc = self.customer_order.existing_insurance.mrc

                    new_total = (tariff_mrc * 0.7) + insurance_mrc
                    return round(new_total, 2)

                except AttributeError:
                    return round(tariff_mrc * 0.7, 2)

            else:
                try:
                    insurance_mrc = self.customer_order.existing_insurance.mrc
                    return tariff_mrc + insurance_mrc

                except AttributeError:
                    return tariff_mrc

        elif self.customer_order.contract_type == 'Handset':

            handset_mrc = self.customer_order.handset.mrc

            try:
                handset_tariff_mrc = self.customer_order.handset_tariff.mrc

                if self.customer_order.friends_and_family is True:
                    total = (handset_mrc + handset_tariff_mrc) * 0.7

                    try:
                        insurance = self.customer_order.insurance.mrc
                        return round(total, 2) + insurance
                    except AttributeError:
                        return round(total, 2)

                try:
                    insurance = self.customer_order.insurance.mrc
                    return handset_mrc + handset_tariff_mrc + insurance
                except AttributeError:
                    return handset_mrc + handset_tariff_mrc

            except AttributeError:
                return handset_mrc

    def get_total_upfront(self):

        if self.customer_order.contract_type == 'Sim-Only':
            return float(0.0)

        elif self.customer_order.contract_type == 'Handset':

            try:
                handset_upfront = self.customer_order.upfront

                if self.customer_order.handset_credit != 0:

                    handset_upfront = handset_upfront - self.customer_order.handset_credit

                    try:
                        return handset_upfront + self.customer_order.early_upgrade_fee
                    except AttributeError:
                        return handset_upfront
                try:
                    return handset_upfront + self.customer_order.early_upgrade_fee
                except AttributeError:
                    return handset_upfront

            except AttributeError:
                return float(0)

