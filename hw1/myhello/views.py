from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.serializers.json import DjangoJSONEncoder
import json
import logging
from .models import Post, Course_table

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


@api_view(['GET'])
def course_list(request):
    courses = Course_table.objects.all().values()
    return JsonResponse(list(courses), safe=False)


@api_view(['GET', 'POST'])
def add_course(request):
    if request.method == 'POST':
        department = request.data.get('department', '')
        course_title = request.data.get('course_title', '')
        instructor = request.data.get('instructor', '')
    else:
        department = request.GET.get('department', '')
        course_title = request.GET.get('course_title', '')
        instructor = request.GET.get('instructor', '')

    if not department or not course_title or not instructor:
        return Response(
            {"error": "department, course_title, instructor are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    course = Course_table.objects.create(
        department=department,
        course_title=course_title,
        instructor=instructor,
    )
    return Response(
        {
            "id": course.id,
            "department": course.department,
            "course_title": course.course_title,
            "instructor": course.instructor,
            "message": "course inserted",
        },
        status=status.HTTP_201_CREATED,
    )