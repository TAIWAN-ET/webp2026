from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class HelloWorldView(APIView):
    def get(self, request):
        name = request.GET.get('name', None)
        if name:
            retValue = {}
            retValue["data"] = "Hello" + name
            return Response(retValue, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Name parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST)
            