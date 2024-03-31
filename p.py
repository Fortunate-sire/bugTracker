import requests
import time

def query_new_awards():
    url = "https://open.gsa.gov/api/get-opportunities-public-api/"
    params = {
        "type": "awards",
        "postedFrom": "2022-01-01",
        "postedTo": time.strftime("%Y-%m-%d"),
        # Add any other necessary parameters here
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code)
        return None

def check_for_criteria(award):
    company_names = ["Openai", "Microsoft", "Apple", "Nvidia"]
    keywords = ["AI", "LLM", "Artificial Intelligence", "Neural network"]
    
    company_name_matches = any(company.lower() in award["name"].lower() for company in company_names)
    keyword_matches = any(keyword.lower() in award["description"].lower() for keyword in keywords)
    
    return company_name_matches or keyword_matches

def send_discord_alert(award):
    # Implement your Discord webhook logic here
    print("Alert: New award matching criteria found!")
    print("Name:", award["name"])
    print("Description:", award["description"])
    print("URL:", award["url"])
    print("-" * 50)

def main():
    while True:
        awards = query_new_awards()
        if awards:
            for award in awards:
                if check_for_criteria(award):
                    send_discord_alert(award)
        time.sleep(60)  # Adjust the time interval as needed

if __name__ == "__main__":
    main()
