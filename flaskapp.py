from flask import Flask, jsonify, render_template
import sqlite3 as sql
from itertools import chain
from pymongo import MongoClient
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)

app.config["MONGO_CONNECT"] = False
CORS(app)

client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017'))
atlDB = client.atl_db

@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')

@app.route("/data", methods=['GET'])
def dashboard():
    #create session link from python to db
    print(len(getCountyData()))
    return jsonify(data=getCountyData())
    
def getCountyData():
    countyData = []
    for county in list(atlDB.atlite.find()):
        countyData.append({
            'Name':county['County'],
            'Total Crash Fatalities (2020)': county['2020 Total Crash Fatalities'],
            'Total Crimes Reported (2020)': county['2020 Total Index Crimes Reported'],
            'Median Household Income (2020)': county['2020 Model-Based Estimate of Median Household Income, Dollars'],
            'Weekly Wages (2020)':county['2020 Average Weekly Wages, All Industries, Dollars'],
            'Public Schools Count (2020-21)':county['2020-21 Public Schools'],
            'CCRPI Score (2019)':county['2019 Public School CCRPI Score'],
            'Average SAT Score, Combined (2020-21)':county['2020-21 Most Recent SAT Administration Average Scores, Combined'],
            'ACT Composite Score (2019-20)':county['2019-20 ACT Composite Score'],
            'Average Commute Time (2016-20)':county['2016-2020 Mean Travel Time in Minutes'],
            'Democratic Votes, Pct (2020 Presidential Election)':county['2020 Votes Cast for President, Democratic Party, Percent'],
            'Republican Votes, Pct (2020 Presidential Election)': county['2020 Votes Cast for President, Republican Party, Percent'],
            'Total Persons in Poverty (2020)':county['2020 Total Persons in Poverty'],
            'Unemployment Rate (2020)':county['2020 Unemployment Rate'],
            'Median Gross Rent (2017-21)':county['median gross rent (2017 - 2021)'],
            'Median Value of Owner-Occupied Units (2017-21)':county['median value of owner-occupied housing units (2017 - 2021)']
        })
    return countyData

if __name__=='__main__':
    app.run(debug=True)

"""
for documentation purposes:
Flask requires the index html file to be located within the 'templates' folder- that's where
it will go looking for it. Similarly, the javascript and css files need to be within a 'static'
folder, as the application will look for such files there. the HTML code was updated to include
these new file paths for the javascript files, to get them to work
"""
