from flask import Flask, request





app = Flask(__name__)


# GET request endpoint
@app.route('/<user_id>')
def index(user_id):
    return 'welcome %s' % user_id


# TODO: Post request endpoint



if __name__ == "__main__":
    app.run(debug=True)


