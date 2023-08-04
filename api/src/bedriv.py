from flask import Flask, jsonify

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.controller.drive_controller import drive_bp

app = Flask(__name__)

app.register_blueprint(drive_bp)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
