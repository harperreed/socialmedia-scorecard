from app import app

if __name__ == '__main__':
    print("Starting Flask server at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)