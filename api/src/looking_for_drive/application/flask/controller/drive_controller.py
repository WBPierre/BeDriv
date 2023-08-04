from flask import Blueprint

from src.config.firestore.firestore_db import firestore_db
from src.config.google.pubsub.pubsub_client import publisher_client
from src.looking_for_drive.application.flask.controller.route.customer.cancel_drive_route import CancelDriveRoute
from src.looking_for_drive.application.flask.controller.route.customer.change_destination_route import \
    ChangeDestinationRoute
from src.looking_for_drive.application.flask.controller.route.customer.order_drive_route import OrderDriveRoute
from src.looking_for_drive.application.flask.controller.route.customer.estimate_price_route import EstimatePriceRoute
from src.looking_for_drive.application.flask.controller.route.customer.transfer_balance_route import \
    TransferBalanceRoute
from src.looking_for_drive.application.flask.controller.route.driver.accept_drive_route import AcceptDriveRoute
from src.looking_for_drive.application.flask.controller.route.driver.decline_drive_route import DeclineDriveRoute
from src.looking_for_drive.application.flask.controller.route.driver.driver_cancel_drive_route import \
    DriverCancelDriveRoute
from src.looking_for_drive.application.flask.controller.route.driver.finish_drive_route import FinishDriveRoute
from src.looking_for_drive.application.flask.controller.route.driver.pick_up_customer_route import PickUpCustomerRoute
from src.looking_for_drive.infrastructure.blockchain.adapter.local_blockchain import LocalBlockChain
from src.looking_for_drive.infrastructure.firestore.adapter.firestore_customers import FirestoreCustomers
from src.looking_for_drive.infrastructure.firestore.adapter.firestore_drivers import FirestoreDrivers
from src.looking_for_drive.infrastructure.firestore.adapter.firestore_drives import FirestoreDrives
from src.looking_for_drive.infrastructure.google.cloud_messaging.adapter.FCM_notifications import FCMNotifications
from src.looking_for_drive.infrastructure.google.distance_matrix.adapter.google_distances import GoogleDistances
from src.looking_for_drive.infrastructure.google.pubsub.adapter.google_pubsub_publisher import GooglePubSubPublisher
from src.looking_for_drive.infrastructure.stripe.adapter.stripe_payments import StripePayments

drive_bp = Blueprint('looking_for_drive', __name__, url_prefix='/looking_for_drive')

estimate_price_view = EstimatePriceRoute.as_view('estimatePrice',
                                                 distances=GoogleDistances())
drive_bp.add_url_rule('/estimatePrice/<start>/<destination>',
                      view_func=estimate_price_view)

order_drive_view = OrderDriveRoute.as_view('looking_for_drive',
                                           customers=FirestoreCustomers(firestore_db),
                                           drives=FirestoreDrives(firestore_db),
                                           publisher=GooglePubSubPublisher(publisher_client),
                                           payments=StripePayments())
drive_bp.add_url_rule('/order/<customer_id>',
                      view_func=order_drive_view)

accept_drive_view = AcceptDriveRoute.as_view('accept_drive',
                                             drives=FirestoreDrives(firestore_db),
                                             drivers=FirestoreDrivers(firestore_db),
                                             notifications=FCMNotifications())
drive_bp.add_url_rule('/accept/drive/<drive_id>/driver/<driver_id>',
                      view_func=accept_drive_view)

customer_cancel_drive_view = CancelDriveRoute.as_view('customer_cancel_drive',
                                                      drives=FirestoreDrives(firestore_db),
                                                      customers=FirestoreCustomers(firestore_db),
                                                      drivers=FirestoreDrivers(firestore_db),
                                                      notifications=FCMNotifications())
drive_bp.add_url_rule('/customer/<customer_id>/cancel/drive/<drive_id>',
                      view_func=customer_cancel_drive_view)

driver_cancel_drive_view = DriverCancelDriveRoute.as_view('driver_cancel_drive',
                                                          drives=FirestoreDrives(firestore_db),
                                                          drivers=FirestoreDrivers(firestore_db),
                                                          notifications=FCMNotifications(),
                                                          publisher=GooglePubSubPublisher(publisher_client))
drive_bp.add_url_rule('/driver/<driver_id>/cancel/drive/<drive_id>',
                      view_func=driver_cancel_drive_view)

pick_up_customer_view = PickUpCustomerRoute.as_view('pick_up_customer',
                                                    drives=FirestoreDrives(firestore_db))
drive_bp.add_url_rule('/driver/<driver_id>/pickUp/<drive_id>',
                      view_func=pick_up_customer_view)

finish_drive_view = FinishDriveRoute.as_view('finish_drive',
                                             drives=FirestoreDrives(firestore_db),
                                             drivers=FirestoreDrivers(firestore_db),
                                             distances=GoogleDistances(),
                                             customers=FirestoreCustomers(firestore_db),
                                             notifications=FCMNotifications(),
                                             payments=StripePayments(),
                                             blockchain=LocalBlockChain())
drive_bp.add_url_rule('/finishDrive/<drive_id>/by/<driver_id>',
                      view_func=finish_drive_view)

change_destination_view = ChangeDestinationRoute.as_view('change_destination',
                                                         drives=FirestoreDrives(firestore_db),
                                                         distances=GoogleDistances())
drive_bp.add_url_rule('/customer/<customer_id>/changeDestination/<drive_id>',
                      view_func=change_destination_view)

decline_drive_view = DeclineDriveRoute.as_view('decline_drive',
                                               drives=FirestoreDrives(firestore_db),
                                               publisher=GooglePubSubPublisher(publisher_client))
drive_bp.add_url_rule('/driver/<driver_id>/declineDrive/<drive_id>',
                      view_func=decline_drive_view)

transfer_balance_view = TransferBalanceRoute.as_view('transfer_balance',
                                                     customers=FirestoreCustomers(firestore_db),
                                                     blockchain=LocalBlockChain())
drive_bp.add_url_rule('/customer/<customer_id>/transferBalance',
                      view_func=transfer_balance_view)
