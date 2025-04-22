from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/ping', methods=['GET'])
def ping():
    return "pong"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)