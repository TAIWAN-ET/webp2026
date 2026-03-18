from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.serializers.json import DjangoJSONEncoder
import json
import logging
from .models import Post

logger = logging.getLogger(__name__)

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

@api_view(['GET']) 
def add_post(request): 
    title = request.GET.get('title', '') 
    content = request.GET.get('content', '')
    photo = request.GET.get('photo', '') 
    location = request.GET.get('location', '')

    new_post = Post() 
    new_post.title = title 
    new_post.content = content 
    new_post.photo = photo 
    new_post.location = location 
    new_post.save() 
    logger.debug("************** myhello_api: " + title) 
    if title: 
        return Response({"data": title + " insert!"}, status=status.HTTP_200_OK) 
    else: 
        return Response({"res": "parameter: name is None"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_post(request): 
    posts = Post.objects.all().values() 
    return JsonResponse(list(posts), safe=False)
    #return Response (
    #    {"data": 
    #   json.dumps ( 
    #      list(posts), 
    #     sort_keys = True, 
    #    indent = 1, 
    #   cls = DjangoJSONEncoder)}, 
    #  status=status.HTTP_200_OK)