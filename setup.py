from setuptools import setup, find_packages

setup(
    name='your_project_name',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'Flask==3.0.2',
        'Flask_Bcrypt==1.0.1',
        'Flask_Cors==4.0.0',
        'Flask_Login==0.6.3',
        'pymongo==4.6.2',
        'gunicorn==21.2.0',
    ],
)
