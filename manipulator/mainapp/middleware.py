from django.conf import settings
from django.http import HttpResponse


class DevCorsMiddleware:
    """
    Lightweight CORS support for local frontend development.
    Enabled only when DEBUG=True and only for /api/ endpoints.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        is_api = request.path.startswith("/api/")

        if is_api and request.method == "OPTIONS":
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        if is_api and settings.DEBUG:
            origin = request.headers.get("Origin")
            if origin:
                response["Access-Control-Allow-Origin"] = "*"
                response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                response["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With"
                response["Access-Control-Max-Age"] = "86400"

        return response
