import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs

# Websiden som skal scrapes
URL = "https://snl.no/ost/"

def get_robots(url):
    parts = url.split('/', 3)
    if len(parts) >= 4:
        return '/'.join(parts[:3]) + "/robots.txt"
    

# Funksjon som scraper siden og filtrerer ut den viktigste informasjonen
def scrape(url:str) -> None:
    req = rq.get(url)
    soup = bs(req.text, 'html.parser')  
    print(soup.find("title").text)
    print(soup.find("h1").text)
    print(soup.find(class_="article-text").text)

# scrape(URL)
result = get_robots(URL)
print(result)