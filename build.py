import os
import sys
import fnmatch

import boto
from flask.ext.frozen import Freezer
from flask_s3 import FlaskS3

from settings.production import *

from app import app, assets
from views import *

BASE_DIR = os.path.realpath(os.path.dirname(__file__))
BUILD_DIR = os.path.join(BASE_DIR, 'build')

freezer = Freezer(app)
s3 = FlaskS3(app)

# http://stackoverflow.com/a/22462419/868724
conn = boto.s3.connect_to_region(S3_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    calling_format = boto.s3.connection.OrdinaryCallingFormat())

# consider a try/except block here
# location=boto.s3.connection.Location.USWest
bucket = conn.get_bucket(S3_BUCKET_NAME)


def all_files(root, patterns='*', single_level=False, yield_folders=False):
    """
    Expand patterns form semicolon-separated string to list
    example usage: thefiles = list(all_files('/tmp', '*.py;*.htm;*.html'))
    """
    patterns = patterns.split(';')

    for path, subdirs, files in os.walk(root):
        if yield_folders:
            files.extend(subdirs)

        files.sort()

        for name in files:
            for pattern in patterns:
                if fnmatch.fnmatch(name, pattern):
                    yield os.path.join(path, name)
                    break

        if single_level:
            break

def _grab_assets(source_dir, directory_list):
    """
    Take a source directory and a list of directories and look for matches
    Returns list of matching files in specified directories
    """
    upload_file_names = []
    for dir_, _, files in os.walk(source_dir):
        dirname = os.path.basename(dir_)

        if dirname in directory_list:
            for filename in files:
                relative_directory = os.path.relpath(dir_, source_dir)
                relative_file = os.path.join(relative_directory, filename)

                upload_file_names.append(relative_file)

    return upload_file_names

def upload_assets():
    """
    Upload assets to S3
    """

    #max size in bytes before uploading in parts. between 1 and 5 GB recommended
    MAX_SIZE = 20 * 1000 * 1000
    #size of parts when uploading in parts
    PART_SIZE = 6 * 1000 * 1000

    ASSET_DIRECTORY = os.path.join(BUILD_DIR, 'static')

    asset_files = _grab_assets(ASSET_DIRECTORY, ['build', 'images', 'stories'])
    htmlfiles = [os.path.basename(htmlfile) for htmlfile in list(all_files(BUILD_DIR, '*.html', single_level=True))]

    def upload_files(sourceDir, destDir, thefiles):
        def percent_cb(complete, total):
            sys.stdout.write('.')
            sys.stdout.flush()

        for filename in thefiles:
            sourcepath = os.path.join(sourceDir, filename)
            destpath = os.path.join(destDir, filename)
            print 'Uploading %s to Amazon S3 bucket %s' % \
                   (sourcepath, S3_BUCKET_NAME)

            filesize = os.path.getsize(sourcepath)

            if filesize > MAX_SIZE:
                print "multipart upload"
                mp = bucket.initiate_multipart_upload(destpath)
                fp = open(sourcepath,'rb')
                fp_num = 0
                while (fp.tell() < filesize):
                    fp_num += 1
                    print "uploading part %i" %fp_num
                    mp.upload_part_from_file(fp, fp_num, cb=percent_cb, num_cb=10, size=PART_SIZE)

                mp.complete_upload()

            else:
                print "singlepart upload"
                k = boto.s3.key.Key(bucket)
                k.key = destpath
                k.set_contents_from_filename(sourcepath,
                        cb=percent_cb, num_cb=10)
                k.make_public()

    # ASSETS
    upload_files(ASSET_DIRECTORY, 'static', asset_files)
    # HTML FILES
    upload_files(BUILD_DIR, '', htmlfiles)

if __name__ == '__main__':
    app.config['DEBUG'] = False
    app.config['ASSETS_DEBUG'] = False

    app.config['FREEZER_RELATIVE_URLS'] = True
    app.config['FLASK_ASSETS_USE_S3']= True
    app.config['S3_BUCKET_NAME'] = S3_BUCKET_NAME
    app.config['S3_USE_HTTPS'] = False
    app.config['AWS_ACCESS_KEY_ID'] = AWS_ACCESS_KEY_ID
    app.config['AWS_SECRET_ACCESS_KEY'] = AWS_SECRET_ACCESS_KEY

    freezer.freeze()
    upload_assets()
