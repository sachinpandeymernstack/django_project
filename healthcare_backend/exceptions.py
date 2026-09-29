from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        message = 'An error occurred while processing your request.'
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
            elif 'non_field_errors' in response.data and isinstance(response.data['non_field_errors'], list):
                message = str(response.data['non_field_errors'][0])
            elif len(response.data) > 0:
                first_key = list(response.data.keys())[0]
                val = response.data[first_key]
                if isinstance(val, list) and len(val) > 0:
                    message = f"{first_key}: {val[0]}"
                else:
                    message = f"{first_key}: {val}"

        response.data = {
            'status': 'error',
            'code': response.status_code,
            'message': message,
            'details': response.data
        }

    return response
