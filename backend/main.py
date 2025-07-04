from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
"""
This module defines a FastAPI application for managing a list of medicines.
It provides endpoints to retrieve all medicines, retrieve a single medicine by name,
and create a new medicine.
Endpoints:
- GET /medicines: Retrieve all medicines from the data.json file.
- GET /medicines/{name}: Retrieve a single medicine by name from the data.json file.
- POST /create: Create a new medicine with a specified name and price.
- POST /update: Update the price of a medicine with a specified name.
- DELETE /delete: Delete a medicine with a specified name.
Functions:
- get_all_meds: Reads the data.json file and returns all medicines.
- get_single_med: Reads the data.json file and returns a single medicine by name.
- create_med: Reads the data.json file, adds a new medicine, and writes the updated data back to the file.
- update_med: Reads the data.json file, updates the price of a medicine, and writes the updated data back to the file.
- delete_med: Reads the data.json file, deletes a medicine, and writes the updated data back to the file.
Usage:
Run this module directly to start the FastAPI application.
"""
import uvicorn
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/medicines")
def get_all_meds():
    """
    This function reads the data.json file and returns all medicines.
    Returns:
        dict: A dictionary of all medicines
    """
    with open('data.json') as meds:
        data = json.load(meds)
    return data

@app.get("/medicines/{name}")
def get_single_med(name: str):
    """
    This function reads the data.json file and returns a single medicine by name.
    Args:
        name (str): The name of the medicine to retrieve.
    Returns:
        dict: A dictionary containing the medicine details
    """
    with open('data.json') as meds:
        data = json.load(meds)
        for med in data["medicines"]:
            print(med)
            if med['name'] == name:
                return med
    return {"error": "Medicine not found"}

@app.post("/create")
def create_med(name: str = Form(...), price: float = Form(...)):
    """
    This function creates a new medicine with the specified name and price.
    It expects the name and price to be provided as form data.
    Args:
        name (str): The name of the medicine.
        price (float): The price of the medicine.
    Returns:
        dict: A message confirming the medicine was created successfully.
    """
    with open('data.json', 'r+') as meds:
        current_db = json.load(meds)
        new_med = {"name": name, "price": price}
        current_db["medicines"].append(new_med)
        meds.seek(0)
        json.dump(current_db, meds)
        meds.truncate()
        
    return {"message": f"Medicine created successfully with name: {name}"}

@app.post("/update")
def update_med(name: str = Form(...), price: float = Form(...)):
    """
    This function updates the price of a medicine with the specified name.
    It expects the name and price to be provided as form data.
    Args:
        name (str): The name of the medicine.
        price (float): The new price of the medicine.
    Returns:
        dict: A message confirming the medicine was updated successfully.
    """
    with open('data.json', 'r+') as meds:
        current_db = json.load(meds)
        for med in current_db["medicines"]:
            if med['name'] == name:
                med['price'] = price
                meds.seek(0)
                json.dump(current_db, meds)
                meds.truncate()
                return {"message": f"Medicine updated successfully with name: {name}"}
    return {"error": "Medicine not found"}

@app.delete("/delete")
def delete_med(name: str = Form(...)):
    """
    This function deletes a medicine with the specified name.
    It expects the name to be provided as form data.
    Args:
        name (str): The name of the medicine to delete.
    Returns:
        dict: A message confirming the medicine was deleted successfully.
    """
    with open('data.json', 'r+') as meds:
        current_db = json.load(meds)
        for med in current_db["medicines"]:
            if med['name'] == name:
                current_db["medicines"].remove(med)
                meds.seek(0)
                json.dump(current_db, meds)
                meds.truncate()
                return {"message": f"Medicine deleted successfully with name: {name}"}
    return {"error": "Medicine not found"}

# Add your average function here
@app.get("/avg")
def avg_med_price():
    """ 
    This function calculates the average price of all medicines in the data.json file.
    It reads the data.json file, iterates through the medicines, and calculates the average price.

    Returns:
        dict: A dictionary containing the average price of the medicines
    """
    with open('data.json', 'r+') as meds:
        current_db = json.load(meds)
        total_price = 0
        count = 0
        # Iterate through the medicines and calculate the total price and count
        for med in current_db["medicines"]:
            if med['price'] is None or 'price' not in med:
                return {"error": "Price not found for one or more medicines"}
            if med['name'] is None or 'name' not in med:
                return {"error": "Name not found for one or more medicines"}
            total_price += med['price']
            count += 1
        if count == 0:
            return {"error": "No medicines found"}
        average_price = round(total_price / count, 2) # ensure number does not exceed 2 decimals
        return {"message": f"Total Price Calculated successfully: ${average_price}"}
            
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)