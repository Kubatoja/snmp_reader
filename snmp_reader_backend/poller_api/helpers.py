import io, csv, json
from datetime import datetime


def flatten_json(json_data):
    flattened_data = []
    
    for item in json_data:
        flat_item = {}

        for key, value in item.items():
            # Check if the value is a dictionary with an '$oid' key (MongoDB ObjectID)
            if isinstance(value, dict) and '$oid' in value:
                flat_item[key] = value['$oid']  # Replace with the value of the '$oid' key
            
            # Combine date and time fields into a single DateTime field
            elif key == "date" and "time" in item:
                combined_datetime = combine_date_time(item["date"], item["time"])
                flat_item["DateTime"] = combined_datetime  # Add the combined field

            # Add all other fields except 'date' and 'time' directly
            elif key not in ["date", "time"]:
                flat_item[key] = value

        flattened_data.append(flat_item)
    
    return flattened_data

def convert_json_to_csv(json_data):
    output = io.StringIO()
    
    writer = csv.DictWriter(output, fieldnames=json_data[0].keys())
    
    writer.writeheader()
    
    writer.writerows(json_data)
    
    csv_content = output.getvalue()
    
    output.close()
    
    return csv_content

#function that combines date and time for download
def combine_date_time(date_str, time_str):
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    
    combined_datetime = datetime.combine(date_obj.date(), datetime.strptime(time_str, "%H:%M").time())
    
    return combined_datetime.strftime("%Y-%m-%d %H:%M")
