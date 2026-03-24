from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    photo = models.URLField(blank=True)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class Course_table(models.Model):
    department = models.CharField(max_length=100, db_column="Department")
    course_title = models.CharField(max_length=200, db_column="Course Title")
    instructor = models.CharField(max_length=100, db_column="Instructor")

    class Meta:
        db_table = "Course_table"

    def __str__(self):
        return f"{self.department} - {self.course_title}"