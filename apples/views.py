from .models import Apple
from .serializers import serialize_apples
from django.http import JsonResponse


def apple_list(request):
    apples = Apple.objects.all()
    return JsonResponse(serialize_apples(apples), safe=False)