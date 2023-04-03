from flask import Flask, jsonify
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base

# setup SQLite database
engine = create_engine("sqlite:///project3.sqlite")

# reflect DB into new model
Base = automap_base()
# reflect tables
Base.prepare(autoload_with=engine)

# save reference to table
Rentals = Base.classes.rentals

app = Flask(__name__)

@app.route("/")
def dashboard():
    #create session link from python to db
    session = Session(engine)

    allRentals = session.query(Rentals.County, Rentals.Studio, Rentals["1 Bedroom"]).all()

    session.close()

    allRentalsPerCounty = []
    for county, rentStudio, rent1 in allRentals:
        rentalDict = {}
        rentalDict["county"] = county
        rentalDict["studio"] = rentStudio
        rentalDict["1 bed"] = rent1

        allRentalsPerCounty.append(rentalDict)

    return jsonify(allRentalsPerCounty)

if __name__=='__main__':
    app.run(debug=True)


    
