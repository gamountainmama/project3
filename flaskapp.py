from flask import Flask, jsonify, render_template
import sqlite3 as sql
from itertools import chain

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/data")
def dashboard():
    #create session link from python to db
    with sql.connect("atl.sqlite") as con:
        cur = con.cursor()
        cur.execute("select * from Atlanta")
        rows = cur.fetchall()
        rows = list(chain.from_iterable(rows))
    con.close()
    return jsonify(rows)

if __name__=='__main__':
    app.run(debug=True)

"""
for documentation purposes:
Flask requires the index html file to be located within the 'templates' folder- that's where
it will go looking for it. Similarly, the javascript and css files need to be within a 'static'
folder, as the application will look for such files there. the HTML code was updated to include
these new file paths for the javascript files, to get them to work
"""
