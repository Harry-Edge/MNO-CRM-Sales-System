from api.serializers import EmployeeSerializer


def my_jwt_response_handler(token, user=None, request=None):

    return {
        'token': token,
        'user': EmployeeSerializer(user, context={'request': request}).data
    }