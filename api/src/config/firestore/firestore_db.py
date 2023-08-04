from google.cloud import firestore
import firebase_admin


# Project ID is determined by the GCLOUD_PROJECT environment variable
firestore_db = firestore.Client()
firebase_admin.initialize_app()
