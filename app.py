from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import json
#################################################
# Database Setup
#################################################
client = MongoClient('mongodb://localhost:27017/')
db = client['king-bachman']
collection = db['king-bachman']

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')





@app.route('/author')
def author_review():
    return render_template('author.html')

@app.route('/api/v1.0/authors')
def get_authors_data():
    with open('static/data/charts/author_dates.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/api/v1.0/published')
def get_published_data():
    with open('static/data/charts/publish_dates.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

def get_authors_and_books():
    authors = {}  # Dictionary to store authors and their books
    for book in collection.find():
        book_id = str(book['_id'])
        book_title = book['volumeInfo']['title']

        # Check if 'authors' key exists before accessing it
        if 'authors' in book['volumeInfo']:
            book_authors = book['volumeInfo']['authors']
            for author in book_authors:
                if author not in authors:
                    authors[author] = []
                authors[author].append({'id': book_id, 'title': book_title})

    return authors





@app.route('/network')
def network_page():
    with open('static/data/mongo-king-bachman-cleaned2.json', encoding='utf-8') as json_file:
        data = json.load(json_file)
    return render_template('network.html', data=data)



@app.route('/book-review')
def book_review():
    return render_template('book-review.html')





@app.teardown_appcontext
def close_connection(exception):
    client.close()

if __name__ == '__main__':
    app.run(debug=True)
