from flask import Flask
from flask import request
import json

app = Flask(__name__)

@app.route('/')
def hello():
    odpoved = "hello from python"
    return json.dumps(
        {
            'odpoved': odpoved
        }
    )

@app.route('/prediction')
def prediction():
    rok = request.args.get('school_year')
    model = request.args.get('model')
    app.logger.error('%s rok', rok)
    app.logger.error('model: %s', model)
    #logging.info("model" + model)
    return json.dumps (
        {
            'rok': rok,
            'model': model
        }
    )
    

if __name__ == "__main__":
    app.run()