"""
Django settings for iand project.

Generated by 'django-admin startproject' using Django 5.0.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import pymysql
import os
import json
from django.core.exceptions import ImproperlyConfigured
import environ

# django database 구성 변경
pymysql.install_as_MySQLdb()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

# !! 배포하기 전 secret key 다 정리하기 !! 
# secret_file = os.path.join(BASE_DIR, 'secrets.json')

# with open(secret_file) as f:
#     secrets = json.loads(f.read())

# def get_secret(setting, secrets=secrets):
#     try:
#         return secrets[setting]
#     except KeyError:
#         error_msg = "Set the {} environment variable".format(setting)
#         raise ImproperlyConfigured(error_msg)

# SECRET_KEY = get_secret('SECRET_KEY')

SECRET_KEY = "django-insecure-@ff*bv71why14^4c7qm+!n0&j9n(ev3njd#^*)-%ix_g(v(cvd"



# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

env = environ.Env(
    DEBUG=(bool, False)
)

environ.Env.read_env(
    env_file=os.path.join(BASE_DIR, 'secrets.config')
)

SITE_ID = 14

ACCOUNT_SIGNUP_REDIRECTION_URL = 'login'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
ACCOUNT_LOGOUT_ON_GET = True # 로그아웃 물어보는 페이지 안나옴

SESSION_COOKIE_AGE = 3600 # 로그인 세션 1시간 유지?
ACCOUNT_SESSION_REMEMBER = True # 브라우저를 닫으면 유저 로그아웃

# 회원가입 폼
# ACCOUNT_FORMS = {
#     'signup': 'accounts.forms.CustomSignupForm',
# }

# 소셜 계정으로 로그인 시 자동으로 사용자 계정을 생성할지
SOCIALACCOUNT_AUTO_SIGNUP = False
SOCIALACCOUNT_SIGNUP_REDIRECTION_URL = 'login'
SOCIALACCOUNT_FORMS = {
    # 소셜계정 가입 후 추가 폼
    'signup': 'accounts.forms.CustomSocialSignupForm',
}
# 이메일을 아이디로
# ACCOUNT_AUTHENTICATION_METHOD='email'
ACCOUNT_EMAIL_REQUIRED = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts',
    'main',
    'playground',
    'community',
    'mypage',
    
    # allauth
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    
    # login-api
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.kakao',
    'allauth.socialaccount.providers.naver',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'iand_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [f'{BASE_DIR}/templates', f'{BASE_DIR}/main/templates',],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'community.context_processors.menu_links',
            ],
        },
    },
]

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "APP": {
            "client_id": env('GOOGLE_OAUTH_CLIENT_ID'),
            "secret": env('GOOGLE_OAUTH_SECRET'),
            'key': '' 
        },
    },
    
    "kakao": {
        # "SCOPE": [
        #     "profile",
        #     "email",
        # ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "APP": {
            "client_id": env('KAKAO_OAUTH_CLIENT_ID')
        },
    },
    
    "naver": {
        # "SCOPE": [
        #     "profile",
        #     "email",
        # ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "APP": {
            "client_id": env('NAVER_OAUTH_CLIENT_ID'),
             "secret": env('NAVER_OAUTH_SECRET')
        },
    },
}



WSGI_APPLICATION = 'iand_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.mysql",
#         "NAME": 'iandDB1', 
#         "USER" : 'admin',
#         "PASSWORD" : 'aivle202304',
#         "HOST" : 'iand-db-1.cwr76q1tgyva.ap-northeast-2.rds.amazonaws.com',
#         "PORT" : '3306',
#         "OPTIONS" : {
#             'init_command' : "SET sql_mode='STRICT_TRANS_TABLES'"
#         }
#     }
# }
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",  # 경로는 프로젝트 디렉토리에 db.sqlite3 파일을 생성하도록 수정하세요.
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'community', 'static'),
    os.path.join(BASE_DIR, 'playground', 'static'),
    os.path.join(BASE_DIR, 'mypage', 'static'),
    os.path.join(BASE_DIR, 'main', 'static'),
    # os.path.join(BASE_DIR, 'accounts', 'static'),
    ]

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

AUTH_USER_MODEL = 'accounts.User'